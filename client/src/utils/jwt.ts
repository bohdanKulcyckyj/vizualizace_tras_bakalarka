import Cookies from 'js-cookie';

export function saveTokenToCookie(token:string) : void {
    Cookies.set('jwtToken', token, { secure: true, sameSite: 'strict' });
}

export function getTokenFromCookie() : string {
    return Cookies.get('jwtToken');
}