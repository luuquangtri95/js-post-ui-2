import { setBackgroundImage, setFieldValue, setTextContent } from '..'

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

function getTitleError(form) {
  const titleElement = form.querySelector('[name="title"]')
  if (!titleElement) return

  // check required
  if (titleElement.validity.valueMissing) return 'Please enter title'

  // at least two words
  if (titleElement.value.split(' ').filter((x) => !!x && x.length >= 3).length < 2) {
    return 'please enter at least two words of 2 characters'
  }

  return ''
}

function validatePostForm(form, formValues) {
  // get error
  const errors = {
    title: getTitleError(form),
  }

  // set error message
  for (const key in errors) {
    const element = form.querySelector(`[name="${key}"]`)
    if (element) {
      element.setCustomValidity(errors[key])
      setTextContent(element.parentElement, '.invalid-feedback', errors[key])
    }
  }

  // add was-validated class to form element
  const isValid = form.checkValidity()
  if (!isValid) form.classList.add('was-validated')

  return false
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

    if (!validatePostForm(formElement, formValue)) return // trường hợp không hợp lệ
  })
}
