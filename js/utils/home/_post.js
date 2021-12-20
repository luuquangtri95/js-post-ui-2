import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { setTextContent, setThumbnail, truncate } from '../common'

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
  setTextContent(liElement, '[data-id="timeSpan"]', `- ${dayjs(post.updatedAt).fromNow()}`)
  setThumbnail(liElement, '[data-id="thumbnail"]', post.imageUrl)

  // attach event
  const divElement = liElement.firstElementChild
  if (!divElement) return

  divElement.addEventListener('click', (event) => {
    const menu = liElement.querySelector('[data-id="menu"]')
    if (menu && menu.contains(event.target)) return

    /**
     * TODO: nếu mà click vào menu chứa edit button và remove button thì sẽ bỏ qua không làm gì cả
     */

    // console.log('parent')
    window.location.assign(`/post-detail.html?id=${post.id}`)
  })

  const editIconElement = liElement.querySelector('[data-id="edit"]')
  if (!editIconElement) return

  editIconElement.addEventListener('click', () => {
    window.location.assign(`/add-edit-post.html?id=${post.id}`)
  })

  const buttonDeleteElement = liElement.querySelector('[data-id="remove"]')
  if (!buttonDeleteElement) return

  buttonDeleteElement.addEventListener('click', () => {
    const customEvent = new CustomEvent('post-delete', {
      bubbles: true,
      detail: post,
    })

    buttonDeleteElement.dispatchEvent(customEvent)
  })

  return liElement
}

export function renderPostList(ulElementId, postList) {
  if (!Array.isArray(postList)) return

  const ulElement = document.getElementById(ulElementId)
  if (!ulElement) return

  ulElement.textContent = ''

  postList.forEach((post) => {
    const liElement = createPostElement(post)

    ulElement.appendChild(liElement)
  })
}
