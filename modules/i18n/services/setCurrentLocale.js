import counterpart from 'counterpart';

import { clientApi, getMainDomain } from 'modules/app';
import { getCookies } from 'modules/cookies';

import { USER_LOCALE_STORAGE_KEY } from '../constants';

counterpart.setMissingEntryGenerator(key => key);

export default function setCurrentLocale(currentLocale) {
    counterpart.setLocale(currentLocale);
    
    if (typeof window === 'undefined') {
        return;
    }

    window.clientApi = clientApi;

    document.documentElement.lang = currentLocale;

    const expires = new Date();
    expires.setFullYear(expires.getFullYear() + 1);

    getCookies().set(USER_LOCALE_STORAGE_KEY, currentLocale, {
        expires,
        domain: getMainDomain(),
    });

    clientApi.language = currentLocale;
}