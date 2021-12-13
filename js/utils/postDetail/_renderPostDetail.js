import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { setTextContent } from '..'

dayjs.extend(relativeTime)

export function renderPostDetail(post) {
  if (!post) return
  /**
   * render title
   * render desc
   * render author
   * render updateAt
   * render hero Image
   * render edit file link
   */

  setTextContent(document, '#postDetailTitle', post.title)
  setTextContent(document, '#postDetailAuthor', post.author)
  setTextContent(document, '#postDetailDescription', post.description)
  setTextContent(document, '#postDetailTimeSpan', ` - ${dayjs(post.updatedAt).fromNow()}`)

  const heroImageElement = document.getElementById('postHeroImage')
  if (!heroImageElement) return

  heroImageElement.style.backgroundImage = `url(${post.imageUrl})`
  heroImageElement.addEventListener('error', () => {
    heroImageElement.src = 'https://via.placeholder.com/1368x400?text=heroImageError'
  })

  // render edit page link
  const editPageLinkElement = document.getElementById('goToEditPageLink')
  if (editPageLinkElement) {
    editPageLinkElement.href = `/add-edit-post.html?id=${post.id}`
    editPageLinkElement.innerHTML = '<i class="fas fa-edit"></i> Edit Posts'
  }
}
