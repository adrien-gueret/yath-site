import { Button } from '@material-ui/core';
import { useRouter } from 'next/router';

import { Link, Alert } from 'modules/app';
import { makeTranslations } from 'modules/i18n';

const useTranslations = makeTranslations('notConnectedAlert', {
    fr: {
        title: 'Vous n\'êtes pas connecté.',
        login: 'Se connecter',
        forbiddenAccess: 'Vous devez être connecté pour accéder à cette page.',
    },
    en: {
        title: 'Your are not connected.',
        login: 'Login',
        forbiddenAccess: 'You must be connected to access this page.',
    },
});

export default function NotConnectedAlert({ children, details, severity = 'warning', secondaryAction }) {
    const t = useTranslations();
    const router = useRouter();

    return (
        <Alert
            details={details}
            severity={severity}
            title={t('title')}
            secondaryAction={secondaryAction}
            primaryAction={(
                <Button
                    component={Link}
                    href={`/login?r=${encodeURIComponent(router.pathname)}`}
                >
                    { t('login') }
                </Button>
            )}
        >
            { children || (
                severity === 'error' ? t('forbiddenAccess') : null
            ) }
        </Alert>
    );
}