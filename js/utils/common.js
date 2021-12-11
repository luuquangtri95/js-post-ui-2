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
    element.src = 'https://picsum.photos/200/300'
  })

  element.src = url
}
