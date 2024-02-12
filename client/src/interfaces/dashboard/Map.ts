import { Color } from "three";

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
    color?: Color;
    label?: string;
    x?: number;
    y?: number;
    z?: number;
}

export const pinTypeMapper: { [key: string] : PIN_TYPE } = {
    'PIN_IMAGE': PIN_TYPE.PIN_IMAGE,
    'PIN_SIGN': PIN_TYPE.PIN_SIGN,
}