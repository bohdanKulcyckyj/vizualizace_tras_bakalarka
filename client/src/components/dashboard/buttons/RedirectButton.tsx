import React, { FC } from 'react'
import { IRedirectButton } from '../../../interfaces/dashboard/Button'

const RedirectButton: FC<IRedirectButton> = ({ data, rowData }) => {
  const additionalProps = data.newWindow
    ? { target: '_blank', rel: 'noopener noreferrer' }
    : {}
  return (
    <a
      href={data.actionUrlConstantPart + rowData[data.actionUrlDynamicPartKey]}
      className='redirect-button'
      {...additionalProps}
    >
      {data.label}
    </a>
  )
}

export default RedirectButton
