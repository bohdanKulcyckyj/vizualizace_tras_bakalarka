import { Dispatch, FC, SetStateAction, useCallback } from 'react'
import Select from 'react-select'
import { INearbyPointType } from '../../../interfaces/NearbyPoint'
import { pointsOptions } from '../../../data/NearbyPointsOptions'
import { INearbyPOIsSelectOption } from '../../../interfaces/NearbyPoint'

type Props = {
  selectedOptions: INearbyPointType[]
  setSelectedOptions: Dispatch<SetStateAction<INearbyPointType[]>>
}

const NearbyPointsStepFirst: FC<Props> = ({
  selectedOptions,
  setSelectedOptions,
}) => {
  const toSelectOption = useCallback((opt: INearbyPointType) => {
    return {
      label: opt.label,
      value: opt,
    }
  }, [])

  const handleChange = useCallback(
    (e) => {
      setSelectedOptions(e.map((_item: INearbyPOIsSelectOption) => _item.value))
    },
    [setSelectedOptions],
  )

  return (
    <Select
      className='custom-react-select__container'
      classNamePrefix='custom-react-select'
      defaultValue={selectedOptions.map(toSelectOption)}
      options={pointsOptions.map(toSelectOption)}
      closeMenuOnSelect={false}
      placeholder={'Choose categories'}
      onChange={(e) => handleChange(e)}
      menuIsOpen={pointsOptions.length > selectedOptions.length}
      isMulti
    />
  )
}

export default NearbyPointsStepFirst
