import postApi from './apis/postApi'
import { initPagination, initSearchInput, renderPagination, renderPostList, toast } from './utils'

async function handleFilterChange(filterName, filterValue) {
  try {
    const url = new URL(window.location)

    if (filterName) url.searchParams.set(filterName, filterValue)

    //reset page if needed

    if (filterName === 'title_like') url.searchParams.set('_page', 1)

    history.pushState({}, '', url)

    // fetch API
    //re-render post list
    const { data, pagination } = await postApi.getAll(url.searchParams)

    renderPostList('postsList', data)
    renderPagination('pagination', pagination)
  } catch (error) {
    console.log('failed to fetch post list', error)
  }
}

function registerPostDeleteEvent() {
  document.addEventListener('post-delete', async (event) => {
    try {
      const post = event.detail
      const message = `are you sure to remove post ${post.title}`
      if (window.confirm(message)) {
        // call Api to remove post by id
        await postApi.remove(post.id)
        await handleFilterChange()

        toast.success('remove post successfully !!')
      }
    } catch (error) {
      toast.error('failed to delete post', error)
    }
  })
}

// MAIN
;(async () => {
  try {
    // set default pagination (_page,_limit) on URL
    const url = new URL(window.location)

    // update search params
    if (!url.searchParams.get('_page')) url.searchParams.set('_page', 1)
    if (!url.searchParams.get('_limit')) url.searchParams.set('_limit', 6)

    history.pushState({}, '', url)
    const queryParams = url.searchParams

    // attach event for links
    initPagination({
      elementId: 'pagination',
      defaultParams: queryParams,
      onChange: (page) => handleFilterChange('_page', page),
    })

    initSearchInput({
      elementId: 'searchInput',
      defaultParams: queryParams,
      onChange: (value) => handleFilterChange('title_like', value),
    })

    handleFilterChange()
    registerPostDeleteEvent()
  } catch (error) {
    console.log(error)
  }
})()
