import { Color } from "three";
import { IModelOptions } from "../../terainModel/model";

export enum PIN_TYPE {
    PIN_IMAGE = 'PIN_IMAGE',
    PIN_SIGN = 'PIN_SIGN',
}

export enum PIN_COLORS {
    RED = "#fc0303",
    GREEN = "#03fc14",
    BLUE = "#0318fc"
}

export interface IMapObjectOptions {
    pinType: PIN_TYPE;
    id: string;
    color?: Color;
    label?: string;
    imageUrl?: string;
    x?: number;
    y?: number;
    z?: number;
}

export const pinTypeMapper: { [key: string] : PIN_TYPE } = {
    'PIN_IMAGE': PIN_TYPE.PIN_IMAGE,
    'PIN_SIGN': PIN_TYPE.PIN_SIGN,
}

export interface IMapConfiguration  {
    id?: string;
    name: string;
    mapModel: IModelOptions;
}