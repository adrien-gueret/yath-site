import React from 'react';
import { ThemeProvider, makeStyles } from '@material-ui/core';

import theme from 'modules/themes';

import { CurrentLocaleProvider, setCurrentLocale, getUserLocale } from 'modules/i18n';
import { CurrentUserProvider } from 'modules/users';

const useStyles = makeStyles(() => ({
    '@global': {
        'body,html': {
            padding: 0,
            margin: 0,
            minWidth: 320,
        },
    },
}));

if (typeof window !== 'undefined') {
    window.theme = theme;
}

function YathApp({ Component, pageProps, defaultCurrentLocale }) {
    useStyles();
    return (
        <ThemeProvider theme={theme}>
            <CurrentLocaleProvider defaultLocale={defaultCurrentLocale}>
                <CurrentUserProvider>
                    <Component {...pageProps} />
                </CurrentUserProvider>
            </CurrentLocaleProvider>
        </ThemeProvider>
    );
}

YathApp.getInitialProps = async function ({ ctx }) {
    const currentLocale = getUserLocale(ctx.req?.headers?.cookie);
    setCurrentLocale(currentLocale);

    return { defaultCurrentLocale: currentLocale };
};

export default YathApp;