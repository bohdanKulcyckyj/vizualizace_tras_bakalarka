import React, { FC } from 'react'
import { IRedirectButton } from '../../../interfaces/dashboard/Button'
import { Link } from 'react-router-dom'

const RedirectButton: FC<IRedirectButton> = ({ data, rowData }) => {
  const additionalProps = data.newWindow
    ? { target: '_blank', rel: 'noopener noreferrer' }
    : {}
  return (
    <Link
      to={data.actionUrlConstantPart + rowData[data.actionUrlDynamicPartKey]}
      className='redirect-button'
      {...additionalProps}
    >
      {data.label}
    </Link>
  )
}

export default RedirectButton
