import { Button } from '@material-ui/core';

import { Link, Alert } from 'modules/app';
import { makeTranslations } from 'modules/i18n';

const useTranslations = makeTranslations('notConnectedAlert', {
    fr: {
        title: 'Vous n\'êtes pas connecté.',
        login: 'Se connecter',
    },
    en: {
        title: 'Your are not connected.',
        login: 'Login',
    },
});

export default function NotConnectedAlert({ children, details, severity = 'warning', secondaryAction }) {
    const t = useTranslations();

    return (
        <Alert
            details={details}
            severity={severity}
            title={t('title')}
            secondaryAction={secondaryAction}
            primaryAction={(
                <Button
                    component={Link}
                    href="/login"
                >
                    { t('login') }
                </Button>
            )}
        >
            { children }
        </Alert>
    );
}