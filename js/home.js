import postApi from './apis/postApi'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { getPaginationElement, setTextContent, setThumbnail, truncate } from './utils'

dayjs.extend(relativeTime)

function createPostElement(post) {
  if (!post) return

  // find template
  const template = document.getElementById('postItemTemplate')
  if (!template) return

  // find and clone template
  const liElement = template.content.firstElementChild.cloneNode(true)
  if (!liElement) return

  // update info
  setTextContent(liElement, '[data-id="title"]', post.title)
  setTextContent(liElement, '[data-id="description"]', truncate(post.description))
  setTextContent(liElement, '[data-id="author"]', post.author)

  // calc timeSpan
  // console.log(dayjs(post.updatedAt).fromNow())
  setTextContent(liElement, '[data-id="timeSpan"]', `- ${dayjs(post.updatedAt).fromNow()}`)
  setThumbnail(liElement, '[data-id="thumbnail"]', post.imageUrl)

  return liElement
}

function renderPostList(ulElementId, postList) {
  if (!Array.isArray(postList) || postList.length === 0) return

  const ulElement = document.getElementById(ulElementId)
  if (!ulElement) return

  ulElement.textContent = ''

  postList.forEach((post) => {
    const liElement = createPostElement(post)

    ulElement.appendChild(liElement)
  })
}

function renderPagination(pagination) {
  const ulPagination = getPaginationElement()
  if (!pagination || !ulPagination) return

  const { _page, _limit, _totalRows } = pagination
  // calc totalPages
  const totalPages = Math.ceil(_totalRows / _limit)

  // save page and totalPages to ulPagination
  ulPagination.dataset.page = _page
  ulPagination.dataset.totalPages = totalPages

  // check disable or enabled prev/next link
  if (_page <= 1) ulPagination.firstElementChild?.classList.add('disabled')
  else ulPagination.firstElementChild?.classList.remove('disabled')

  if (_page >= totalPages) ulPagination.lastElementChild?.classList.add('disabled')
  else ulPagination.lastElementChild?.classList.remove('disabled')
}

async function handleFilterChange(filterName, filterValue) {
  try {
    const url = new URL(window.location)
    url.searchParams.set(filterName, filterValue)
    history.pushState({}, '', url)

    // fetch API
    //re-render post list
    const { data, pagination } = await postApi.getAll(url.searchParams)

    renderPostList('postsList', data)
    renderPagination(pagination)
  } catch (error) {
    console.log('failed to fetch post list', error)
  }
}

function handlePrevClick(event) {
  event.preventDefault()

  const ulPagination = getPaginationElement()
  if (!ulPagination) return

  const page = Number.parseInt(ulPagination.dataset.page)
  if (page <= 1) return

  handleFilterChange('_page', page - 1)
}

function handleNextClick(event) {
  event.preventDefault()

  const ulPagination = getPaginationElement()
  if (!ulPagination) return

  const page = Number.parseInt(ulPagination.dataset.page) || 1
  const totalPages = Number.parseInt(ulPagination.dataset.totalPages)
  if (page >= totalPages) return

  handleFilterChange('_page', page + 1)
}

function initPagination() {
  const ulPagination = getPaginationElement()
  if (!ulPagination) return

  // add click event
  const prevLink = ulPagination.firstElementChild?.firstElementChild
  if (prevLink) {
    prevLink.addEventListener('click', () => handlePrevClick(event))
  }

  const nextLink = ulPagination.lastElementChild?.lastElementChild
  if (nextLink) {
    nextLink.addEventListener('click', () => handleNextClick(event))
  }
}

function initURL() {
  const url = new URL(window.location)

  // update search params
  if (!url.searchParams.get('_page')) url.searchParams.set('_page', 1)
  if (!url.searchParams.get('_limit')) url.searchParams.set('_limit', 6)

  history.pushState({}, '', url)
}

// MAIN
;(async () => {
  try {
    // attach event for links
    initPagination()

    // set default pagination (_page,_limit) on URL
    initURL()

    const queryParams = new URLSearchParams(window.location.search)

    // set default queryParams if not existed
    const { data, pagination } = await postApi.getAll(queryParams)

    renderPostList('postsList', data)
    renderPagination(pagination)
  } catch (error) {
    console.log(error)
  }
})()
