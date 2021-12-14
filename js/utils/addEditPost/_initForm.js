export function initForm({ elementId, defaultValue, onSubmit }) {
  const formElement = document.getElementById(elementId)
  if (!formElement) return

  const formTitle = formElement.querySelector('[name="title"]')
  const formAuthor = formElement.querySelector('[name="author"]')
  const formDesc = formElement.querySelector('[name="description"]')

  if (!formAuthor || !formDesc || !formTitle) return

  formTitle.value = defaultValue.title
  formAuthor.value = defaultValue.author
  formDesc.value = defaultValue.description

  formElement.addEventListener('submit', (e) => {
    e.preventDefault()
  })
}
