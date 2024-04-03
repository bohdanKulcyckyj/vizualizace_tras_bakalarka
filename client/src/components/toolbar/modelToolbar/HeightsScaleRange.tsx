import { Range } from 'react-range'

const HeightsScaleRange = ({ heightCoefficientRangeValue, setHeightCoefficientRangeValue, model, recreatedModel }) => {
  return (
    <div className='mb-6'>
    <div className='flex justify-between items-center my-2'>
      <p>Heights scale</p>
      <p>{heightCoefficientRangeValue}</p>
    </div>
    <Range
      step={0.1}
      min={1}
      max={10}
      values={[heightCoefficientRangeValue]}
      onChange={(values) => {
        console.log(model.options)
        if (model?.options) {
          setHeightCoefficientRangeValue(values[0])
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