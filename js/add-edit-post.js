import postApi from './apis/postApi'
import { initForm, toast } from './utils'

async function handlePostFormSubmit(formValue) {
  try {
    const savedPost = formValue.id ? await postApi.update(formValue) : await postApi.add(formValue)

    // show message
    toast.success('saved post successfully')

    setTimeout(() => {
      window.location.assign(`/post-detail.html?id=${savedPost.id}`)
    }, 2000)
  } catch (error) {
    toast.error(error)
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

    console.log('default value', defaultValue)
    initForm({
      elementId: 'postForm',
      defaultValue,
      onSubmit: (formValue) => handlePostFormSubmit(formValue),
    })
  } catch (error) {
    console.log('failed to fetch', error)
  }
})()
