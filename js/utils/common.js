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
