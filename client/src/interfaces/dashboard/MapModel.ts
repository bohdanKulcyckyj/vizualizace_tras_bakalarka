import { Color } from 'three'

export enum PIN_TYPE {
  PIN_IMAGE = 'PIN_IMAGE',
  PIN_SIGN = 'PIN_SIGN',
  PIN_LABEL = 'PIN_LABEL',
}

export enum PIN_COLORS {
  RED = '#fc0303',
  GREEN = '#03fc14',
  BLUE = '#0318fc',
}

export interface IMapObjectOptions {
  pinType: PIN_TYPE
  id: string
  color?: Color | string
  label?: string
  images?: string[]
  x?: number
  y?: number
  z?: number
  event?: MouseEvent
}

export const pinTypeMapper: { [key: string]: PIN_TYPE } = {
  PIN_IMAGE: PIN_TYPE.PIN_IMAGE,
  PIN_SIGN: PIN_TYPE.PIN_SIGN,
  PIN_LABEL: PIN_TYPE.PIN_LABEL,
}

export interface IMapDTO {
  id?: string
  name: string
  createdAt?: string | Date
  mapModel: IMapModelConfig
}

export interface IMapPointDTO {
  type: string
  id: number
  lat: number
  lon: number
  name?: string
  tags: {
    [key: string]: string
  }
}

export interface IModelCoord {
  lat: number
  lng: number
}

export interface IBbox {
  northEast: IModelCoord
  southWest: IModelCoord
}

export interface IMapModelConfig {
  center: {
    lat: number
    lng: number
    alt: number
  }
  bbox: IBbox
  zoom: number
  trailGpxUrl: string | null
  mapObjects: IMapObjectOptions[]
  heightCoefficient: number | null
  //tilesetStyleIdentifier: string | null;
}

export interface ITilesetStyle {
  identifier: string
  label: string
  image: string
}
