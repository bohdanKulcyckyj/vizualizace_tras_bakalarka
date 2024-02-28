import { Color } from 'three';
import { IModelOptions } from '../../terainModel/model';

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
  pinType: PIN_TYPE;
  id: string;
  color?: Color | string;
  label?: string;
  images?: string[];
  x?: number;
  y?: number;
  z?: number;
  event?: MouseEvent;
}

export const pinTypeMapper: { [key: string]: PIN_TYPE } = {
  PIN_IMAGE: PIN_TYPE.PIN_IMAGE,
  PIN_SIGN: PIN_TYPE.PIN_SIGN,
  PIN_LABEL: PIN_TYPE.PIN_LABEL,
};

export interface IMapConfiguration {
  id?: string;
  name: string;
  mapModel: IModelOptions;
}

export interface MapPointDTO {
  type: string;
  id: number;
  lat: number;
  lon: number;
  name?: string;
  tags: {
    [key: string]: string;
  };
}
