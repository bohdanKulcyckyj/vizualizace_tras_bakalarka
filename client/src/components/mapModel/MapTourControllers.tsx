import { FaPause, FaStop, FaPlay } from 'react-icons/fa'
import { IconContext } from 'react-icons'
import { FC, useEffect, useState } from 'react'
import { startAnimation } from '../../utils/trailAnimation'

export enum MapTourController {
  TOUR_PLAY,
  TOUR_PAUSE,
  TOUR_STOP,
}

export type TimingConfig = {
  timestampStart: string
  timestampEnd: string
  animationDuration: number
}

const MapTourControllers: FC<{
  timingConfig: TimingConfig | null
  onStart: () => void
  onPause: () => void
  onStop: () => void
}> = ({ timingConfig, onStart, onPause, onStop }) => {
  const [isPanelOpened, setIsPanelOpened] = useState<boolean>(false)
  const [activeController, setActiveController] =
    useState<MapTourController | null>(null)

  const handleControllerClick = (
    controller: MapTourController,
    callback: () => void,
  ) => {
    if (activeController !== controller) {
      setActiveController(controller)
    }

    callback()
  }

  useEffect(() => {
    if (timingConfig && activeController === MapTourController.TOUR_PLAY) {
      const { timestampStart, timestampEnd, animationDuration } = timingConfig
      startAnimation(
        timestampStart,
        timestampEnd,
        animationDuration,
        '#trail-animation-time',
      )
    }
  }, [activeController, timingConfig])

  return (
    <div
      className={`map-tour__panel ${isPanelOpened ? 'map-tour__panel--active' : ''}`}
    >
      {isPanelOpened ? (
        <>
          <div
            className='map-tour__minimize'
            onClick={() => setIsPanelOpened(false)}
          ></div>
          {timingConfig && (
            <div className='map-tour__time mb-4'>
              <p id='trail-animation-time'>{timingConfig.timestampStart}</p>
            </div>
          )}
          <div className='map-tour__controls'>
            <IconContext.Provider
              value={{
                color: '#2EEBC9',
                size: '26px',
                className: `map-tour__icon ${activeController === MapTourController.TOUR_PLAY ? 'map-tour__icon--active' : ''}`,
              }}
            >
              <span
                onClick={() =>
                  handleControllerClick(MapTourController.TOUR_PLAY, onStart)
                }
              >
                <FaPlay />
              </span>
            </IconContext.Provider>
            <IconContext.Provider
              value={{
                color: '#2EEBC9',
                size: '26px',
                className: `map-tour__icon ${activeController === MapTourController.TOUR_PAUSE ? 'map-tour__icon--active' : ''}`,
              }}
            >
              <span
                onClick={() =>
                  handleControllerClick(MapTourController.TOUR_PAUSE, onPause)
                }
              >
                <FaPause />
              </span>
            </IconContext.Provider>
            <IconContext.Provider
              value={{
                color: '#2EEBC9',
                size: '26px',
                className: `map-tour__icon ${activeController === MapTourController.TOUR_STOP ? 'map-tour__icon--active' : ''}`,
              }}
            >
              <span
                onClick={() =>
                  handleControllerClick(MapTourController.TOUR_STOP, onStop)
                }
              >
                <FaStop />
              </span>
            </IconContext.Provider>
          </div>
        </>
      ) : (
        <button
          className='map-tour__trail-button'
          onClick={() => setIsPanelOpened(true)}
        >
          Animate trail
        </button>
      )}
    </div>
  )
}

export default MapTourControllers
