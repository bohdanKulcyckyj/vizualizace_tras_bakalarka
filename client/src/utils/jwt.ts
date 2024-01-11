import Cookies from 'js-cookie';

export function saveTokenToCookie(token: string): void {
    const expirationTimeInMinutes = 60;
    const expirationDate = new Date();
    expirationDate.setTime(expirationDate.getTime() + expirationTimeInMinutes * 60 * 1000);
  
    Cookies.set('jwtToken', token, {
      secure: true,
      sameSite: 'strict',
      expires: expirationDate,
    });
  }

export function getTokenFromCookie() : string | undefined {
    return Cookies.get('jwtToken');
}