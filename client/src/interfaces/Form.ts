export interface ILoginForm {
  email: string
  password: string
}

export interface IRegistrationForm {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export interface IResetPasswordForm {
  email: string
  newPassword: string
  confirmPassword: string
  token?: string
}

export interface IForgottenPasswordForm {
  email: string
}

export interface IProfileForm {
  name: string
  email: string
}
