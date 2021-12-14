import { setBackgroundImage, setFieldValue } from '..'

function setFormValue(form, formValue) {
  setFieldValue(form, '[name="title"]', formValue?.title)
  setFieldValue(form, '[name="author"]', formValue?.author)
  setFieldValue(form, '[name="description"]', formValue?.description)

  setFieldValue(document, '[name="imageUrl"]', formValue?.imageUrl) //hidden field -> dùng để lấy image url dễ dàng hơn
  setBackgroundImage(document, '#postHeroImage', formValue?.imageUrl)
}

export function initForm({ elementId, defaultValue, onSubmit }) {
  const formElement = document.getElementById(elementId)
  if (!formElement) return

  setFormValue(formElement, defaultValue)

  formElement.addEventListener('submit', (e) => {
    e.preventDefault()
  })
}
