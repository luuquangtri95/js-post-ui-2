import { setBackgroundImage, setFieldValue } from '..'

function setFormValue(form, formValue) {
  setFieldValue(form, '[name="title"]', formValue?.title)
  setFieldValue(form, '[name="author"]', formValue?.author)
  setFieldValue(form, '[name="description"]', formValue?.description)

  setFieldValue(document, '[name="imageUrl"]', formValue?.imageUrl) //hidden field -> dùng để lấy image url dễ dàng hơn
  setBackgroundImage(document, '#postHeroImage', formValue?.imageUrl)
}

function getFormValue(form) {
  const formValues = {}

  // ;['title', 'author', 'description', 'imageUrl'].forEach((name) => {
  //   const field = form.querySelector(`[name="${name}"]`)
  //   if (field) value[name] = field.value
  // })

  // cach 2
  const data = new FormData(form)
  for (let [key, value] of data) {
    formValues[key] = value
  }

  return formValues
}

export function initForm({ elementId, defaultValue, onSubmit }) {
  const formElement = document.getElementById(elementId)
  if (!formElement) return

  setFormValue(formElement, defaultValue)

  formElement.addEventListener('submit', (e) => {
    e.preventDefault()

    // get form value
    const formValue = getFormValue(formElement)
    console.log(formValue)
    // validation
    // if valid trigger submit callback
    // otherwise, show validation error
  })
}
