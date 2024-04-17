import { FC, useRef } from 'react'
import { axiosWithAuth } from '../../utils/axiosWithAuth'
import gsap from 'gsap'
import { toast } from 'sonner'

type DialogProps = {
  handleDelete: () => Promise<void>
  onSuccess?: () => void
}

const ConfirmDialog: FC<DialogProps> = ({ handleDelete, onSuccess }) => {
  const deleteBarRef = useRef()

  const hideTheBar = async (deleteItem) => {
    toast.dismiss()
    if (deleteItem) {
      try {
        await handleDelete()
        if(onSuccess) {
          onSuccess()
        }
      } catch(e) {
        console.error(e)
      }
    }
  }

  return (
    <div className='confirm-dialog' ref={deleteBarRef}>
      <div className='p-6 flex flex-col justify-center items-center'>
        <h2 className='confirm-dialog__title'>Are you sure about that?</h2>
        <div className='flex gap-5 justify-center items-center mt-5'>
          <button
            className='confirm-dialog__button confirm-dialog__button--primary'
            onClick={() => {
              hideTheBar(true)
            }}
          >
            Yes
          </button>
          <button
            className='confirm-dialog__button confirm-dialog__button--secondary'
            onClick={() => {
              hideTheBar(false)
            }}
          >
            No
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmDialog
