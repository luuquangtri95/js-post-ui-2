import debounce from 'lodash.debounce'

export function initSearchInput({ elementId, defaultParams, onChange }) {
  const searchInput = document.getElementById(elementId)
  if (!searchInput) return

  // update value to searchInput
  if (defaultParams && defaultParams.get('title_like'))
    searchInput.value = defaultParams.get('title_like')

  // set default value form query params
  // title_like
  const debounceSearch = debounce(async (event) => await onChange?.(event.target.value), 500)

  searchInput.addEventListener('input', debounceSearch)
}
