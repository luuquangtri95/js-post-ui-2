import postApi from './apis/postApi'
import { initForm, toast } from './utils'

function removeUnusedFields(formValue) {
  const payload = { ...formValue }
  // imageSource = "picsum" => remove image
  // imageSource = "upload" => remove imageUrl
  // finally remove imageSource
  if (payload.imageSource === 'upload') {
    delete payload.imageUrl
  } else {
    delete payload.image
  }

  delete payload.imageSource

  // remove id if it add mode
  if (!payload.id) delete payload.id // nếu payload không có giá trị - hoặc là giá trị undefined thì xoá id đó

  return payload
}

function jsonToFormData(jsonObject) {
  const formData = new FormData()

  for (const key in jsonObject) {
    formData.set(key, jsonObject[key])
  }

  return formData
}

async function handlePostFormSubmit(formValue) {
  try {
    const payload = removeUnusedFields(formValue)
    const formData = jsonToFormData(payload)

    const savedPost = formValue.id
      ? await postApi.updateFormData(formData)
      : await postApi.addFormData(formData)

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

    initForm({
      elementId: 'postForm',
      defaultValue,
      onSubmit: (formValue) => handlePostFormSubmit(formValue),
    })
  } catch (error) {
    console.log('failed to fetch', error)
  }
})()
