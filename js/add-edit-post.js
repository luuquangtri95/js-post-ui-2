import postApi from './apis/postApi'
import { initForm } from './utils'

async function handlePostFormSubmit(formValue) {}

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
