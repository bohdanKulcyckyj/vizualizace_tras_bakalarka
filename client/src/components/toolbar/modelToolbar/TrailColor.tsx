import { useModelContext } from '../../../context/ModelContext'
import InputColor, { Color } from 'react-input-color'

const TrailColor = () => {
  const { model, projectSettings, setProjectSettings } = useModelContext()

  const handleColorChanged = (color: Color) => {
    if(!model) return
    setProjectSettings((prevState) => ({
      ...prevState,
      mapModel: { ...prevState.mapModel, trailColor: color.hex },
    }))
    model.options = projectSettings.mapModel
    model.drawTrail(projectSettings.mapModel.trailUrl)
  }

  return (
    <div>
      <p className='subsection-title mb-1'>Trail color</p>
      <InputColor
        initialValue={projectSettings?.mapModel?.trailColor ?? '#ff0000'}
        onChange={handleColorChanged}
        placement='bottom'
      />
    </div>
  )
}

export default TrailColor
