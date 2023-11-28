import React, { FC } from 'react'
import { IUnpackButton } from '../../interfaces/IButton'

const UnpackButton: FC<IUnpackButton> = ({ data }) => {
  return (
    <button className='unpack-button'>{data.label}</button>
  )
}

export default UnpackButton