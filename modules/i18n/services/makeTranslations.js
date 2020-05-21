import { useContext, useMemo } from 'react';
import counterpart from 'counterpart';

import CurrentLocaleContext from '../contexts/CurrentLocale';

export default function makeTranslations(namespace, translations) {
    for (let locale in translations) {
        counterpart.registerTranslations(locale, {
            [namespace]: translations[locale],
        });
    }

    return function useTranslations() {
        const { currentLocale, setCurrentLocale } = useContext(CurrentLocaleContext);

        return useMemo(() => {
            function translate(key, vars) {
                let [namespaceToUse, path] = key.split(':');

                if (!path) {
                    [path, namespaceToUse] = [namespaceToUse, namespace];
                }

                return counterpart(`${namespaceToUse}.${path}`, vars);
            }

            translate.currentLocale = currentLocale;
            translate.setLocale = setCurrentLocale;

            return translate;
        }, [currentLocale]);
    };
}
