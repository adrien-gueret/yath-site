import React, { useState, useEffect } from 'react';
import { ThemeProvider, CssBaseline } from '@material-ui/core';
import Router from 'next/router';

import { clientApi, SnackMessageProvider } from 'modules/app';
import theme from 'modules/themes';
import { CurrentLocaleProvider, setCurrentLocale, getUserLocale } from 'modules/i18n';
import { CurrentUserProvider } from 'modules/users';

if (typeof window !== 'undefined') {
    window.theme = theme;
}

function YathApp({ Component, pageProps, defaultCurrentLocale }) {
    const [isClientApiReady, setIsClientApiReady] = useState(clientApi.accessToken && clientApi.accessTokenExpiration);

    useEffect(() => {
        const jssStyles = document.querySelector('#jss-server-side');
        if (jssStyles) {
            jssStyles.parentElement.removeChild(jssStyles);
        }
        Router.events.on('routeChangeComplete', () => { window.scrollTo(0, 0); });
    }, []);

    useEffect(() => {
        if (isClientApiReady) {
            return;
        }

        clientApi.requestToken('client_credentials').then(() => setIsClientApiReady(true));
    }, [isClientApiReady]);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <CurrentLocaleProvider defaultLocale={defaultCurrentLocale}>
                <CurrentUserProvider>
                    <SnackMessageProvider>
                        <Component {...pageProps} />
                    </SnackMessageProvider>
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
