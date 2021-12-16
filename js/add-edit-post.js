import postApi from './apis/postApi'
import { initForm } from './utils'

async function handlePostFormSubmit(formValue) {
  try {
    const savedPost = formValue.id ? await postApi.update(formValue) : await postApi.add(formValue)

    window.location.assign(`/post-detail.html?id=${savedPost.id}`)
  } catch (error) {
    console.log('failed to fetch', error)
  }
}

;(async () => {
  try {
    const searchParams = new URLSearchParams(window.location.search)
    const postId = searchParams.get('id')

    const defaultValue = !!postId
      ? await postApi.getById(postId)
      : {
          title: '',
          description: '',
          imageUrl: '',
          author: '',
        }

    initForm({
      elementId: 'postForm',
      defaultValue,
      onSubmit: (formValue) => handlePostFormSubmit(formValue),
    })
  } catch (error) {
    console.log('failed to fetch', error)
  }
})()
