import { FC } from 'react'
import ButtonLoading from '../ButtonLoading'
import { ISubmitButton } from '../../interfaces/SubmitButton'

const SubmitButton: FC<ISubmitButton> = (props) => {
  return (
    <button
      className='primary-button relative'
      type={props.buttonType}
      onClick={props.onClick ? props.onClick : null}
      disabled={props.isDisable}
    >
      {props.label}
      {props.isLoading && <ButtonLoading />}
    </button>
  )
}

export default SubmitButton
