export enum PIN_TYPE {
    PIN_IMAGE,
    PIN_RED
}

export interface IMapObjectOptions {
    pinType: PIN_TYPE;
    label: string;
}