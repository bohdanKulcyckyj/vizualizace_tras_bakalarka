import Cookies from 'js-cookie'
import { updateAuthHeaders } from './axiosWithAuth'

export function saveTokenToCookie(token: string): void {
  const expirationTimeInMinutes = 60
  const expirationDate = new Date()
  expirationDate.setTime(
    expirationDate.getTime() + expirationTimeInMinutes * 60 * 1000,
  )

  Cookies.set('jwtToken', token, {
    secure: true,
    sameSite: 'strict',
    expires: expirationDate,
  })
}

export function getTokenFromCookie(): string | undefined {
  const token = Cookies.get('jwtToken')
  if (token) {
    updateAuthHeaders(token)
  }
  return token
}
