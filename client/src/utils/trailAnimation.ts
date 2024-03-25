export const displayCurrentAnimationTime = () => {}

export const getCurrentTime = (
  timestampStart,
  timestampEnd,
  animationDuration,
) => {
  const startTime = new Date(timestampStart)
  const endTime = new Date(timestampEnd)

  const currentTime = new Date(
    startTime.getTime() +
      (endTime.getTime() - startTime.getTime()) * animationDuration,
  )
  const formattedTime = currentTime.toLocaleString('cs-CZ')

  return formattedTime
}

export const startAnimation = (
  timestampStart,
  timestampEnd,
  duration,
  selector,
) => {
  var startTime = Date.now()
  var animationInterval = setInterval(function () {
    var elapsedTime = Date.now() - startTime
    var animationProgress = elapsedTime / duration
    if (animationProgress >= 1) {
      clearInterval(animationInterval)
      animationProgress = 1
    }

    document.querySelector(selector).innerHTML = getCurrentTime(
      timestampStart,
      timestampEnd,
      animationProgress,
    )
  }, 1000)
}
