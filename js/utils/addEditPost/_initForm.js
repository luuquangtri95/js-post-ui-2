import { setBackgroundImage, setFieldValue, setTextContent } from '..'
import * as yup from 'yup'

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

function getPostSchema() {
  return yup.object().shape({
    title: yup.string().required('please enter title'),
    author: yup
      .string()
      .required('please enter author')
      .test('at-least-two-words', 'please enter at least two words ', (value) => {
        return value.split(' ').filter((x) => !!x && x.length >= 3).length >= 2
      }),
    description: yup.string(),
  })
}

function setFieldError(form, name, error) {
  const element = form.querySelector(`[name="${name}"]`)
  if (element) {
    element.setCustomValidity(error)
    setTextContent(element.parentElement, '.invalid-feedback', error)
  }
}

async function validatePostForm(form, formValues) {
  try {
    //reset prev error
    ;['title', 'author'].forEach((name) => setFieldError(form, name, ''))

    const schema = getPostSchema()
    await schema.validate(formValues, { abortEarly: false })
  } catch (error) {
    // console.log(error.name)
    // console.log(error.inner)

    const errorLog = {}

    if (error.name === 'ValidationError' && Array.isArray(error.inner)) {
      for (const validationError of error.inner) {
        const name = validationError.path // title, author
        const messageError = validationError.message

        // ignore if the field is already logged
        if (errorLog[name]) continue
        setFieldError(form, name, messageError)

        errorLog[name] = true
      }
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
