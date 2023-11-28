import React, { Dispatch, SetStateAction } from 'react';

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

export interface IDeleteButton {
    data: IButton;
    rowData: any;
    setDeleteRoute: Dispatch<SetStateAction<string>>;
    setShowTheDialog: Dispatch<SetStateAction<boolean>>;
}

export interface IRedirectButton {
    data: IButton;
    rowData: any;
}

export interface IUnpackButton {
    data: IButton;
}