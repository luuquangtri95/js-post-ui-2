export function renderPagination(elementId, pagination) {
  const ulPagination = document.getElementById(elementId)
  if (!pagination || !ulPagination) return

  const { _page, _limit, _totalRows } = pagination
  // calc totalPages
  const totalPages = Math.ceil(_totalRows / _limit)

  // save page and totalPages to ulPagination
  ulPagination.dataset.page = _page
  ulPagination.dataset.totalPages = totalPages

  // check disable or enabled prev/next link
  if (_page <= 1) ulPagination.firstElementChild?.classList.add('disabled')
  else ulPagination.firstElementChild?.classList.remove('disabled')

  if (_page >= totalPages) ulPagination.lastElementChild?.classList.add('disabled')
  else ulPagination.lastElementChild?.classList.remove('disabled')
}

export function initPagination({ elementId, defaultParams, onChange }) {
  const ulPagination = document.getElementById(elementId)
  if (!ulPagination) return

  // add click event
  const prevLink = ulPagination.firstElementChild?.firstElementChild
  if (prevLink) {
    prevLink.addEventListener('click', async (event) => {
      event.preventDefault()

      const page = Number.parseInt(ulPagination.dataset.page) || 1
      if (page >= 2) await onChange?.(page - 1)
    })
  }

  const nextLink = ulPagination.lastElementChild?.lastElementChild
  if (nextLink) {
    nextLink.addEventListener('click', async (event) => {
      event.preventDefault()

      const page = Number.parseInt(ulPagination.dataset.page) || 1
      const totalPages = Number.parseInt(ulPagination.dataset.totalPages)
      if (page < totalPages) await onChange?.(page + 1)
    })
  }
}
