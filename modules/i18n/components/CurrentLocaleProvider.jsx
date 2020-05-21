import React, { useEffect, useState } from 'react';
import counterpart from 'counterpart';

import getUserLocale from '../services/getUserLocale';
import i18nSetCurrentLocale from '../services/setCurrentLocale';
import CurrentLocaleContext from '../contexts/CurrentLocale';

counterpart.setLocale(getUserLocale());

export default function CurrentLocaleProvider({ children, defaultLocale }) {
    const [currentLocale, setCurrentLocale] = useState(defaultLocale);

    useEffect(() => {
        i18nSetCurrentLocale(currentLocale);
    }, []);

    const changeLocale = (newLocale) => {
        i18nSetCurrentLocale(newLocale);
        setCurrentLocale(newLocale);
    };

    return (
        <CurrentLocaleContext.Provider value={{ setCurrentLocale: changeLocale, currentLocale }}>
            { children }
        </CurrentLocaleContext.Provider>
    );
}

