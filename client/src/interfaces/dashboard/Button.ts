import { Dispatch, SetStateAction } from 'react'

export enum ButtonType {
  REDIRECT,
  DELETE,
  UNPACK,
}

export interface IButton {
  type: ButtonType
  label: string
  actionUrlConstantPart?: string
  actionUrlDynamicPartKey?: string | number
  newWindow?: boolean
}

export interface IDeleteButton {
  data: IButton
  rowData: any
  setShowTheDialog: Dispatch<SetStateAction<boolean>>
  setDeleteRoute: Dispatch<SetStateAction<string>>
}

export interface IRedirectButton {
  data: IButton
  rowData: any
}

export interface IUnpackButton {
  data: IButton
}
