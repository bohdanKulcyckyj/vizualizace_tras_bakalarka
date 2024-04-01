import { Dispatch, FC, SetStateAction, useCallback } from 'react'
import Select from 'react-select'
import { IMapPointDTO } from '../../../interfaces/dashboard/MapModel'
import { mappingPointsToSelectOptionsGroups } from '../../../utils/mappingPOIs'
import { INearbyPOIsSelectOption, INearbyPointTypeGroup } from '../../../interfaces/NearbyPoint'

type Props = {
  data: IMapPointDTO[]
  selectedOptions: IMapPointDTO[]
  setSelectedOptions: Dispatch<SetStateAction<IMapPointDTO[]>>
  excludedPointsIds: string[]
}

const NearbyPointsStepSecond: FC<Props> = ({
  data,
  selectedOptions,
  setSelectedOptions,
  excludedPointsIds
}) => {
  const toSelectOption = useCallback((opt: IMapPointDTO) => {
    return {
      label: opt.tags.name,
      value: opt,
    }
  }, [])

  const handleChange = useCallback(
    (e) => {
      console.log(e)
      setSelectedOptions(e.map((_item: INearbyPOIsSelectOption) => _item.value))
    },
    [setSelectedOptions],
  )

  return (
    <Select<INearbyPOIsSelectOption, true, INearbyPointTypeGroup>
      className='custom-react-select__container'
      classNamePrefix='custom-react-select'
      defaultValue={selectedOptions.map(toSelectOption)}
      options={mappingPointsToSelectOptionsGroups(data, excludedPointsIds)}
      closeMenuOnSelect={false}
      placeholder={'Choose POIs'}
      onChange={(e) => handleChange(e)}
      menuIsOpen={selectedOptions.length < data.length}
      isMulti
    />
  )
}

export default NearbyPointsStepSecond
