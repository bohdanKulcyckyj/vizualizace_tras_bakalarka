export enum PIN_TYPE {
    PIN_IMAGE = 'PIN_IMAGE',
    PIN_SIGN = 'PIN_SIGN',
}

export enum PIN_COLORS {
    RED = 0xfc0303,
    GREEN = 0x03fc14,
    BLUE = 0x0318fc
}

export interface IMapObjectOptions {
    pinType: PIN_TYPE;
    color?: number;
    label?: string;
    x?: number;
    y?: number;
    z?: number;
}

export const pinTypeMapper: { [key: string] : PIN_TYPE } = {
    'PIN_IMAGE': PIN_TYPE.PIN_IMAGE,
    'PIN_SIGN': PIN_TYPE.PIN_SIGN,
}