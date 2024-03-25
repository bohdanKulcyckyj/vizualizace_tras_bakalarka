import { useRef } from 'react'
import { axiosWithAuth } from '../../utils/axiosWithAuth'
import gsap from 'gsap'
import { toast } from 'sonner'

const ConfirmDialog = (props) => {
  const deleteBarRef = useRef()

  const hideTheBar = (deleteItem) => {
    toast.dismiss()
    props.setShowTheDialog(false)
    if (deleteItem) {
      axiosWithAuth.delete(props.deleteRoute).then((res) => {
        props.update()
      })
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
