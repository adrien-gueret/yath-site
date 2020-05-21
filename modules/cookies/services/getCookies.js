import Cookies from 'universal-cookie';

let cachedCookies = null;

export default function getCookies(cookieString) {
    if (cachedCookies && !cookieString) {
        return cachedCookies;
    }

    cachedCookies = new Cookies(cookieString);

    return cachedCookies;
}
