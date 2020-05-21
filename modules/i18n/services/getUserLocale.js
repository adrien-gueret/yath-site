import { getCookies } from 'modules/cookies';

import { USER_LOCALE_STORAGE_KEY, DEFAULT_LOCALE } from '../constants';

export default function getUserLocale(allCookies) {
    const cookies = getCookies(allCookies);
    const locale = cookies.get(USER_LOCALE_STORAGE_KEY);
    return locale || DEFAULT_LOCALE;
}