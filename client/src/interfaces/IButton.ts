export enum ButtonType {
    REDIRECT,
    DELETE,
    UNPACK
};

export interface IButton {
    type: ButtonType;
    label: string;
    actionUrlConstantPart?: string;
    actionUrlDynamicPartKey?: string | number;
};
