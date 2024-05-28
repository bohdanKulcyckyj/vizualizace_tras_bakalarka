import { Range } from 'react-range'

type Props = {
  label: string
  value: number
  step: number
  min: number
  max: number
  handleChange: (val: any) => void
  handleFinalChange: () => void
}

const CustomRange = ({
  label,
  value,
  step,
  min,
  max,
  handleChange,
  handleFinalChange,
}: Props) => {
  return (
    <div className='mb-4'>
      <div className='flex justify-between items-center my-2'>
        <p className='subsection-title'>{label}</p>
        <p className='subsection-title'>{value ?? 1}</p>
      </div>
      <div className='mx-3'>
        <Range
          step={step}
          min={min}
          max={max}
          values={[value ?? 1]}
          onChange={handleChange}
          onFinalChange={handleFinalChange}
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
    </div>
  )
}

export default CustomRange
