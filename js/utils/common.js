export function setTextContent(parentElement, selector, text) {
  if (!parentElement) return

  const element = parentElement.querySelector(selector)
  if (!element) return

  element.textContent = text
}

export function setThumbnail(parentElement, selector, url) {
  if (!parentElement) return

  const element = parentElement.querySelector(selector)
  if (!element) return

  element.addEventListener('error', () => {
    console.warn('loaded image error -> use default placeholder !!!')
    element.src = 'https://via.placeholder.com/1368x400?text=thumbnail'
  })

  element.src = url
}

export function truncate(text, maxLength = 100) {
  if (text.length < maxLength) {
    return text
  }

  return `${text.slice(0, maxLength - 1)}...`
}

export function setFieldValue(form, selector, value) {
  if (!form) return

  const field = form.querySelector(selector)
  if (field) field.value = value
}

export function setBackgroundImage(parent, selector, imageUrl) {
  if (!parent) return

  const element = parent.querySelector(selector)
  if (element) element.style.backgroundImage = `url("${imageUrl}")`
}

export function randomNumber(n) {
  if (n <= 0) return -1

  const random = Math.random() * n
  return Math.round(random)
}
