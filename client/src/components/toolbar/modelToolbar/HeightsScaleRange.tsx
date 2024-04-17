import { Range } from 'react-range'
import { useModelContext } from '../../../context/ModelContext'
import { IMapDTO } from '../../../interfaces/dashboard/MapModel'

const HeightsScaleRange = ({ recreatedModel }) => {
  const { model, projectSettings, setProjectSettings } = useModelContext()

  return (
    <div className='mb-6'>
    <div className='flex justify-between items-center my-2'>
      <p>Heights scale</p>
      <p>{projectSettings.mapModel.heightCoefficient}</p>
    </div>
    <Range
      step={0.1}
      min={1}
      max={10}
      values={[projectSettings.mapModel.heightCoefficient ?? 1]}
      onChange={(values) => {
        if (model?.options) {
          setProjectSettings((_settings: IMapDTO) => {
            _settings.mapModel.heightCoefficient = values[0]
            return {..._settings}
          })
          model.options.heightCoefficient = values[0]
        }
      }}
      onFinalChange={() => {
        recreatedModel()
      }}
      renderTrack={({ props, children }) => (
        <div
          {...props}
          style={{
            ...props.style,
            height: '6px',
            width: '100%',
            backgroundColor: '#2EEBC9',
          }}
        >
          {children}
        </div>
      )}
      renderThumb={({ props }) => (
        <div
          {...props}
          style={{
            ...props.style,
            height: '22px',
            width: '22px',
            borderRadius: '50%',
            backgroundColor: '#fff',
            outline: 'none',
          }}
        />
      )}
    />
  </div>
  )
}

export default HeightsScaleRange