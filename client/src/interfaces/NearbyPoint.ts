import { IMapPointDTO } from './dashboard/MapModel'

export interface INearbyPOIsSelectOption {
  label: string
  value: INearbyPointType | IMapPointDTO
}

export interface INearbyPointType {
  label: string
  node: string
  value: string
}

export interface INearbyPointTypeGroup {
  label: string
  options: INearbyPOIsSelectOption[] //IMapPointDTO[]
}
