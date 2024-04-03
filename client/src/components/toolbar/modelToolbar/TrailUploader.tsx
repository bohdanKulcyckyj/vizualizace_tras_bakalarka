import React from 'react'
import { IconContext } from 'react-icons'
import { MdOutlineFileUpload } from 'react-icons/md'

const TrailUploader = ({ gpxTrailName, handleDeleteTrail, fileChangeHandler }) => {
  return (
    <div className='mb-6'>
    <div className='flex justify-between flex-wrap gap-2 mb-2'>
      <label htmlFor='pgx'>GPX or FIT trail</label>
      {gpxTrailName && (
        <button
          className='secondary-button secondary-button--small'
          onClick={handleDeleteTrail}
        >
          delete
        </button>
      )}
    </div>
    <div className='form__input--file mb-2'>
      <label>
        {gpxTrailName ? (
          <div className='flex justify-start items-center overflow-hidden'>
            <span className='oveflow-hidden'>{gpxTrailName}</span>
          </div>
        ) : (
          <IconContext.Provider
            value={{
              color: '#2EEBC9',
              size: '30px',
              className: 'upload-icon',
            }}
          >
            <span>
              <MdOutlineFileUpload />
            </span>
          </IconContext.Provider>
        )}
        <input
          name='gpx'
          type='file'
          placeholder='gpx'
          onChange={(e) => fileChangeHandler(e)}
        />
      </label>
    </div>
  </div>
  )
}

export default TrailUploader