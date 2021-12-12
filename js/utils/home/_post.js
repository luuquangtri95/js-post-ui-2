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
  // console.log(dayjs(post.updatedAt).fromNow())
  setTextContent(liElement, '[data-id="timeSpan"]', `- ${dayjs(post.updatedAt).fromNow()}`)
  setThumbnail(liElement, '[data-id="thumbnail"]', post.imageUrl)

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
