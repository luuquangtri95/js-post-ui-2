function showModal(modalElement) {
  if (!window.bootstrap) return

  const myModal = new window.bootstrap.Modal(modalElement)
  if (!myModal) return

  myModal.show()
}

export function registerLightBox({ modalId, imageSelector, prevSelector, nextSelector }) {
  const modalElement = document.getElementById(modalId)
  if (!modalElement) return

  // check if this modal is data-registered or not
  if (!!modalElement.dataset.registered) return

  // selectors
  const imgElement = modalElement.querySelector(imageSelector)
  const prevButtonElement = modalElement.querySelector(prevSelector)
  const nextButtonElement = modalElement.querySelector(nextSelector)

  if (!imgElement || !prevButtonElement || !nextButtonElement) return

  // lightbox Vars
  let imgList = []
  let currentIndex = 0

  function showImageAtIndex(currentIndex) {
    imgElement.src = imgList[currentIndex].src
  }

  /**
   * handle click for all images - attach event delegation
   * img click => find all image with the same album / galary
   * determine index of selected img
   */

  document.addEventListener('click', (event) => {
    if (event.target.tagName !== 'IMG' || !event.target.dataset.album) return

    // img with data-album
    imgList = document.querySelectorAll(`img[data-album="${event.target.dataset.album}"]`)
    currentIndex = [...imgList].findIndex((x) => x === event.target)
    console.log('img', currentIndex)

    showImageAtIndex(currentIndex)
    showModal(modalElement)
  })

  prevButtonElement.addEventListener('click', () => {
    // show prev image of current album
    currentIndex = (currentIndex - 1 + imgList.length) % imgList.length
    showImageAtIndex(currentIndex)
  })

  nextButtonElement.addEventListener('click', () => {
    // show next image of current album
    currentIndex = (currentIndex + 1) % imgList.length
    showImageAtIndex(currentIndex)
  })

  modalElement.dataset.registered = 'true'
}

