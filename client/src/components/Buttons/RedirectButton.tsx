import React, { FC } from 'react'
import { IRedirectButton } from '../../interfaces/IButton'

const RedirectButton: FC<IRedirectButton> = ({data, rowData}) => {
  return (
    <a 
    href={data.actionUrlConstantPart + rowData[data.actionUrlDynamicPartKey]} 
    className="redirect-button"
    >{data.label}</a>
  )
}

export default RedirectButton