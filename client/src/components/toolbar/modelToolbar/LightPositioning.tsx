import CustomRange from '../../CustomRange'
import { useModelContext } from '../../../context/ModelContext'

type TAxis = 'x' | 'y' | 'z'

const LightPositioning = () => {
  const { projectSettings, setProjectSettings } = useModelContext()

  const handleChange = (axis: TAxis, value: number) => {
    switch (axis) {
      case 'x':
        setProjectSettings((prevState) => ({
          ...prevState,
          mapModel: { ...prevState.mapModel, lightX: value },
        }))
        break
      case 'y':
        setProjectSettings((prevState) => ({
          ...prevState,
          mapModel: { ...prevState.mapModel, lightY: value },
        }))
        break
      case 'z':
        setProjectSettings((prevState) => ({
          ...prevState,
          mapModel: { ...prevState.mapModel, lightZ: value },
        }))
        break
      default:
        throw new Error('no axis named: ' + axis)
    }
  }

  const handleFinalChange = () => {
    console.log('Finalizing lights positioning')
  }

  return (
    <div>
      <p className='mb-2 subsection-title'>Position</p>
      <CustomRange
        label='x'
        min={0}
        max={1000}
        step={10}
        value={projectSettings.mapModel?.lightX ?? 0}
        handleChange={(val) => handleChange('x', val)}
        handleFinalChange={handleFinalChange}
      />
      <CustomRange
        label='y'
        min={0}
        max={1000}
        step={10}
        value={projectSettings.mapModel?.lightY ?? 0}
        handleChange={(val) => handleChange('y', val)}
        handleFinalChange={handleFinalChange}
      />
      <CustomRange
        label='z'
        min={0}
        max={1000}
        step={10}
        value={projectSettings.mapModel?.lightZ ?? 0}
        handleChange={(val) => handleChange('z', val)}
        handleFinalChange={handleFinalChange}
      />
    </div>
  )
}

export default LightPositioning
