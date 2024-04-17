import { setHeadersConfig } from '../../../utils/axiosWithAuth'
import apiEndpoints from '../../../constants/apiEndpoints'
import axios from 'axios'
import { IconContext } from 'react-icons'
import { MdOutlineFileUpload } from 'react-icons/md'
import { useModelContext } from '../../../context/ModelContext'

const TrailUploader = ({ handleDeleteTrail }) => {
  const { model, trailName, setTrailName } = useModelContext()

  const fileChangeHandler = async (event): Promise<void> => {
    const uploadedFile = event.target.files[0]
    if (uploadedFile) {
      const requestConfig = setHeadersConfig({
        'Content-Type': 'multipart/form-data',
      })
      const formData = new FormData()
      formData.append('file', uploadedFile)

      try {
        const res = await axios.post(
          apiEndpoints.uploadMedia,
          formData,
          requestConfig,
        )

        setTrailName(uploadedFile.name)
        model.drawTrail(res.data.file)
      } catch (e) {
        console.error(e)
      }
    }
  }

  return (
    <div className='mb-6'>
    <div className='flex justify-between flex-wrap gap-2 mb-2'>
      <label htmlFor='pgx'>GPX or FIT trail</label>
      {trailName && (
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
        {trailName ? (
          <div className='flex justify-start items-center overflow-hidden'>
            <span className='oveflow-hidden'>{trailName}</span>
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