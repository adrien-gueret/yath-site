import { useState } from 'react';
import { makeStyles, AppBar, Toolbar, Button, Icon, Menu, MenuItem } from '@material-ui/core';

import { makeTranslations } from 'modules/i18n';

const useStyles = makeStyles(({ palette }) => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        background: palette.background.default,
    },
    toRight: {
        marginLeft: 'auto',
    },
    main: {
        flexGrow: 1,
    },
    footer: {
        height: 24,
    },
}), { classNamePrefix: 'MainLayout' });

const useTranslatations = makeTranslations();

export default function MainLayout({ children }) {
    const [languageMenuAnchorEl, setLanguageMenuAnchorEl] = useState(null);
    const t = useTranslatations();

    const handleLangugageButtonClick = (event) => {
        setLanguageMenuAnchorEl(event.currentTarget);
    };

    const handleLanguageMenuClose = () => {
        setLanguageMenuAnchorEl(null);
    };
    const classes = useStyles();
    const isLanguageMenuOpen = Boolean(languageMenuAnchorEl);

    const localesToLanguages = {
        fr: 'Français',
        en: 'English',
    };

    const getOnChangeLocale = locale => () => {
        t.setLocale(locale);
        handleLanguageMenuClose();
    };

    return (
        <div className={classes.root}>
            <AppBar className={classes.header} position="static">
                <Toolbar>
                    <Button
                        aria-controls="language-selector"
                        aria-haspopup="true"
                        onClick={handleLangugageButtonClick}
                        startIcon={<Icon>translate</Icon>}
                        endIcon={<Icon>{ isLanguageMenuOpen ? 'expand_less' : 'expand_more' }</Icon>}
                        className={classes.toRight}
                        color="inherit"
                    >
                        { localesToLanguages[t.currentLocale] }
                    </Button>
                    <Menu
                        id="language-selector"
                        anchorEl={languageMenuAnchorEl}
                        keepMounted
                        open={isLanguageMenuOpen}
                        onClose={handleLanguageMenuClose}
                    >
                        { Object.keys(localesToLanguages).map((locale) => (
                            <MenuItem
                                key={locale}
                                selected={locale === t.currentLocale}
                                onClick={getOnChangeLocale(locale)}
                            >
                                { localesToLanguages[locale] }
                            </MenuItem>
                        )) }
                    </Menu>
                </Toolbar>
            </AppBar>

            <main className={classes.main}>
                { children }
            </main>

            <AppBar component="footer" className={classes.footer} position="static" />
        </div>
    );
}
