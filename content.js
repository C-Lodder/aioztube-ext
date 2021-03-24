let started = false

const dom = new MutationObserver((mutations) => {
  mutations.forEach(mutation => {
    if (!mutation.addedNodes) {
      return
    }
    for (let i = 0; i < mutation.addedNodes.length; i++) {
      // If an added node with the class of `vjs-marker` is added
      // to the DOM, start observing the video player
      if (mutation.addedNodes[i].classList.contains('vjs-marker') && !started) {
        started = true
        observeVideo()
      }
    }
  })
})

dom.observe(document.body, {
  childList: true,
  subtree: true
})

function observeVideo() {
  const player = document.getElementById('player')
  let count = 0
  let currentState = ''
  let videoStarted = false

  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      const { target } = mutation

      if (mutation.attributeName === 'class') {
        const hasEnded = target.classList.contains('vjs-ended')
        // If the video has ended, reset the states back to their original values
        // This will allow the DOM observer to restart
        if (hasEnded) {
          videoStarted = false
          started = false
          currentState = ''
        }

        const isWaiting = target.classList.contains('vjs-waiting')
        const isPlaying = target.classList.contains('vjs-playing')
        if (!isWaiting && isPlaying && currentState !== 'playing' && !videoStarted) {
          videoStarted = true
          const markers = document.querySelectorAll('.vjs-marker')
          currentState = 'playing'
          // Click on the last advert marker, which will play all adverts in sequence
          markers[parseInt(markers.length - 1, 10)].click()
        }
      }
    })
  })

  observer.observe(player, {
    attributes: true,
    attributeOldValue: true,
    attributeFilter: ['class']
  })
}