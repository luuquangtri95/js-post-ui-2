import postApi from './apis/postApi'
import { setTextContent, setThumbnail } from './utils'

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
  setTextContent(liElement, '[data-id="description"]', post.title)
  setTextContent(liElement, '[data-id="authors"]', post.title)
  setThumbnail(liElement, '[data-id="thumbnail"]', post.imageUrl)

  return liElement
}

function renderPostList(ulElementId, postList) {
  if (!Array.isArray(postList) || postList.length === 0) return

  const ulElement = document.getElementById(ulElementId)
  if (!ulElement) return

  postList.forEach((post) => {
    const liElement = createPostElement(post)

    ulElement.appendChild(liElement)
  })
}

// MAIN
;(async () => {
  try {
    const queryParams = {
      _page: 1,
      _limit: 6,
    }

    const { data, pagination } = await postApi.getAll(queryParams)

    renderPostList('postsList', data)
  } catch (error) {
    console.log(error)
  }
})()
