import postApi from './apis/postApi'
import { registerLightBox, renderPostDetail } from './utils'
;(async () => {
  try {
    registerLightBox({
      modalId: 'lightbox',
      imageSelector: 'img[data-id="lightboxImg"]',
      prevSelector: 'button[data-id="lightboxPrev"]',
      nextSelector: 'button[data-id="lightboxNext"]',
    })
    registerLightBox({
      modalId: 'lightbox',
      imageSelector: 'img[data-id="lightboxImg"]',
      prevSelector: 'button[data-id="lightboxPrev"]',
      nextSelector: 'button[data-id="lightboxNext"]',
    })
    /**
     * get post id from URL
     * fetch post detail API
     * render post detail
     */
    const queryParams = new URLSearchParams(window.location.search)
    const postId = queryParams.get('id')
    if (!postId) return

    const post = await postApi.getById(postId)

    renderPostDetail(post)
  } catch (error) {
    console.log('failed fetch api', error)
  }
})()
