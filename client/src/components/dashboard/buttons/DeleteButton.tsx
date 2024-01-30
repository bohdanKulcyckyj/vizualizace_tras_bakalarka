import React, { FC } from 'react'
import { IDeleteButton } from '../../../interfaces/dashboard/Button'

const DeleteButton: FC<IDeleteButton> = ({ data, rowData, setShowTheDialog, setDeleteRoute }) => {
  const deleteRecord = () => {
    setDeleteRoute(data.actionUrlConstantPart + rowData[data.actionUrlDynamicPartKey])
    setShowTheDialog(true)
  }

  return (
    <button onClick={() => deleteRecord()} className='delete-button'>{data.label}</button>
  )
}

export default DeleteButton