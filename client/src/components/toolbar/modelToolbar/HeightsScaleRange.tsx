import { useModelContext } from '../../../context/ModelContext'
import { IMapDTO } from '../../../interfaces/dashboard/MapModel'
import CustomRange from '../../CustomRange'

const HeightsScaleRange = ({ recreatedModel }) => {
  const { model, projectSettings, setProjectSettings } = useModelContext()

  const handleChange = (values) => {
    if (model?.options) {
      setProjectSettings((_settings: IMapDTO) => {
        _settings.mapModel.heightCoefficient = values[0]
        return { ..._settings }
      })
      model.options.heightCoefficient = values[0]
    }
  }

  const handleFinalChange = () => {
    recreatedModel()
  }

  return (
    <CustomRange
      label='Heights scale'
      value={projectSettings.mapModel.heightCoefficient}
      step={0.1}
      min={1}
      max={10}
      handleChange={handleChange}
      handleFinalChange={handleFinalChange}
    />
  )
}

export default HeightsScaleRange
