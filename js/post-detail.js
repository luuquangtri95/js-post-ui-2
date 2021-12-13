import postApi from './apis/postApi'
import { renderPostDetail } from './utils'
;(async () => {
  try {
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
