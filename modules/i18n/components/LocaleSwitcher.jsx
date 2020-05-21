import { useState } from 'react';
import { Button, Icon, Menu, MenuItem } from '@material-ui/core';

import makeTranslations from '../services/makeTranslations';

const useTranslatations = makeTranslations();

export default function LocaleSwitcher() {
    const [languageMenuAnchorEl, setLanguageMenuAnchorEl] = useState(null);
    const t = useTranslatations();

    const handleLangugageButtonClick = (event) => {
        setLanguageMenuAnchorEl(event.currentTarget);
    };

    const handleLanguageMenuClose = () => {
        setLanguageMenuAnchorEl(null);
    };
   
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
        <>
            <Button
                aria-controls="language-selector"
                aria-haspopup="true"
                onClick={handleLangugageButtonClick}
                startIcon={<Icon>translate</Icon>}
                endIcon={<Icon>{ isLanguageMenuOpen ? 'expand_less' : 'expand_more' }</Icon>}
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
        </>
    );
}