import { randomNumber, setBackgroundImage, setFieldValue, setTextContent } from '..'
import * as yup from 'yup'

const ImageSource = {
  PICSUM: 'picsum',
  UPLOAD: 'upload',
}

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

  console.log('data', data)

  for (let [key, value] of data) {
    formValues[key] = value
  }

  return formValues
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
    imageSource: yup
      .string()
      .required('please selected an image source')
      .oneOf([ImageSource.PICSUM, ImageSource.UPLOAD], 'invalid image source'),
    imageUrl: yup.string().when('imageSource', {
      is: ImageSource.PICSUM,
      then: yup
        .string()
        .required('please random a background image')
        .url('please enter a valid url'),
    }),
    image: yup.mixed().when('imageSource', {
      is: ImageSource.UPLOAD,
      then: yup
        .mixed()
        .test('required', 'please select an upload image', (value) => Boolean(value?.name))
        .test('max-3mb', 'the image is too large max 3mb', (file) => {
          const fileSize = file?.size || 0
          const MAX_SIZE = 3 * 1024 * 1024 // 3mb
          // const MAX_SIZE = 10 * 1024 // 3kb

          return fileSize <= MAX_SIZE
        }),
    }),
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
    ;['title', 'author', 'imageUrl'].forEach((name) => setFieldError(form, name, ''))

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
  if (!isValid) form.classList.add('was-validated') // nếu form không hợp lệ thì add class was-validated

  return isValid
}

async function validateFormField(form, formValue, name) {
  try {
    // clear previous error
    setFieldError(form, name, '')

    const schema = getPostSchema()
    await schema.validateAt(name, formValue)
  } catch (error) {
    setFieldError(form, name, error.message)
  }

  const field = form.querySelector(`[name="${name}"]`)
  if (field && !field.checkValidity()) field.parentElement.classList.add('was-validated')
}

function showLoading(form) {
  const buttonElement = form.querySelector('[name="submit"]')
  if (buttonElement) {
    buttonElement.disabled = true
    buttonElement.textContent = 'saving...'
  }
}

function hideLoading(form) {
  const buttonElement = form.querySelector('[name="submit"]')
  if (buttonElement) {
    buttonElement.disabled = false
    buttonElement.textContent = 'save'
  }
}

function initRandomImage() {
  const button = document.getElementById('postChangeImage')
  if (!button) return

  button.addEventListener('click', () => {
    // random id
    // build url
    const imageUrl = `https://picsum.photos/id/${randomNumber(1000)}/1368/400`
    // set image input + bg
    setFieldValue(document, '[name="imageUrl"]', imageUrl) //hidden field -> dùng để lấy image url dễ dàng hơn
    setBackgroundImage(document, '#postHeroImage', imageUrl)
  })
}

function renderImageSourceControl(form, selectedValue) {
  const controlList = form.querySelectorAll('[data-id="imageSource"]')

  controlList.forEach((control) => {
    control.hidden = selectedValue !== control.dataset.imageSource
  })
}

function initRadioImageSource(form) {
  const radioList = form.querySelectorAll('[name="imageSource"]')

  radioList.forEach((radio) => {
    radio.addEventListener('change', (event) => renderImageSourceControl(form, event.target.value))
  })
}

function initUploadImage(form) {
  const uploadImage = form.querySelector('[name="image"]')
  console.log(uploadImage)
  if (!uploadImage) return

  uploadImage.addEventListener('change', (event) => {
    // get selected file
    // preview file
    const file = event.target.files[0]
    if (file) {
      const imageUrl = URL.createObjectURL(file)

      setBackgroundImage(document, '#postHeroImage', imageUrl)

      validateFormField(form, { imageSource: ImageSource.UPLOAD, image: file }, 'image')
    }
  })
}

function initValidationOnChange(form) {
  ;['title', 'author'].forEach((name) => {
    const field = form.querySelector(`[name="${name}"]`)
    if (field) {
      field.addEventListener('input', (event) => {
        const newValue = event.target.value

        validateFormField(form, { [name]: newValue }, name)
      })
    }
  })
}

export function initForm({ elementId, defaultValue, onSubmit }) {
  const formElement = document.getElementById(elementId)
  if (!formElement) return

  let submitting = false

  setFormValue(formElement, defaultValue)

  // init random image
  initRandomImage()
  initRadioImageSource(formElement)
  initUploadImage(formElement)
  initValidationOnChange(formElement)

  formElement.addEventListener('submit', async (e) => {
    e.preventDefault()

    if (submitting) {
      return
    }

    // show loading
    showLoading(formElement)
    submitting = true

    // get form value
    const formValue = getFormValue(formElement)
    formValue.id = defaultValue.id // nếu là mode edit thì value phải có id
    // validation
    // if valid trigger submit callback
    // otherwise, show validation error

    const isValid = await validatePostForm(formElement, formValue)

    // if (!isValid) return // trường hợp không hợp lệ
    if (isValid) await onSubmit?.(formValue)

    // dù có valid hay không thì vẫn ẩn loading
    hideLoading(formElement)
    submitting = false
  })
}
