export interface ISubmitButton {
  label: string
  isLoading: boolean
  isDisable: boolean
  buttonType: 'submit' | 'button'
  onClick?: (...args: any) => void
}
