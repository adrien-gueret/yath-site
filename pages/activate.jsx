
import { useEffect, useState, useContext } from 'react';
import { useMutation } from 'react-query';
import { makeStyles, Button, Typography, CircularProgress } from '@material-ui/core';
import { useRouter } from 'next/router';

import { Head, Alert, Link, clientApi } from 'modules/app';
import { makeTranslations } from 'modules/i18n';
import { AnonymousLayout, LayoutContainer } from 'modules/layouts';
import { useCurrentUser, NotConnectedAlert, CurrentUserContext } from 'modules/users';

const useStyles = makeStyles(({ spacing }) => ({
  progressContainer: {
    padding: spacing(7),
    textAlign: 'center',
  },
}), { classNamePrefix: 'Activate' });

const useTranslations = makeTranslations('activate', {
  fr: {
    metaTitle: 'yath - Confirmation du compte',
    title: 'Confirmation de votre compte en cours...',
    login: 'Se connecter',
    goToDashboard: 'Tableau de bord',
    error: {
      notConnected: 'Vous devez être connecté pour pouvoir activer votre compte.',
      email: {
        title: 'Impossible de confirmer l\'e-mail demandé.',
        content: 'L\'e-mail "%(email)s" n\'est pas celui lié à votre compte.',
      },
      activation: {
        title: 'Impossible de confirmer votre compte.',
        content: 'Une erreur générique est survenue. Utilisez-vous bien le lien provenant de l\'e-mail d\'activation ?',
      },
    },
    success: {
      title: 'Votre compte a bien été confirmé.',
      content: 'Vous pouvez désormais utiliser toutes les fonctionnalités de yath !',
    },
  },
  en: {
    metaTitle: 'yath - Confirm account',
    title: 'Confirming your account in progress...',
    login: 'Log In',
    goToDashboard: 'Dashboard',
    error: {
      notConnected: 'You must be connected in order to activate your account.',
      email: {
        title: 'Can not confirm the requested email.',
        content: 'The email "%(email)s" is not the one linked to your account.',
      },
      activation: {
        title: 'Can not confirm your account.',
        content: 'A generic error has occured. Are you using the link from the activation email?',
      },
    },
    success: {
      title: 'Your account is now confirmed.',
      content: 'You can now use all yath features!',
    },
  },
});

const Activate = () => {
  const [emailError, setEmailError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { dispatch } = useContext(CurrentUserContext);
  const t = useTranslations();
  const classes = useStyles();
  const router = useRouter();
 
  const { currentUser, hasError: currentUserError } = useCurrentUser();
  const [activateUser, { error: activateError }] = useMutation(async () => {
    const { body } = await clientApi.patch(`/me?code=${router.query.c}`, { email_verified: 1 });
    dispatch({ type: 'set', payload: body });
    setIsLoading(false);
    return body;
  });

  const hasError = currentUserError || activateError || emailError;

  useEffect(() => {
    if (!currentUser) {
      return;
    }

    if (currentUser.isVerified) {
      setIsLoading(false);
      return;
    }

    const emailValid = router.query.e === currentUser.email;
    
    if (!emailValid) {
      setEmailError(true);
      setIsLoading(false);
      return;
    }

    activateUser();
  }, [currentUser]);

  const goToDashboardButton = (
    <Button
      component={Link}
      href="/dashboard"
    >
      { t('goToDashboard') }
    </Button>
  );

  return (
    <>
      <Head title={t('metaTitle')} />
      
      <AnonymousLayout>

        <LayoutContainer classes={{ root: classes.root }}>
        { (isLoading && !hasError) ? (
            <>
              <Typography variant="h4">{ t('title') }</Typography>
              <div className={classes.progressContainer}>
                <CircularProgress size={128} thickness={2} />
              </div>
            </>
          ) : (
            <>
              { Boolean(currentUserError) && (
                <NotConnectedAlert severity="error">
                  { t('error.notConnected') }
                </NotConnectedAlert>
              )}

              { emailError && (
                <Alert
                  severity="error"
                  title={t('error.email.title')}
                  primaryAction={goToDashboardButton}
                >
                  { t('error.email.content', { email: router.query.e }) }
                </Alert>
              )}

              { Boolean(activateError) && (
                <Alert
                  severity="error"
                  title={t('error.activation.title')}
                  primaryAction={goToDashboardButton}
                >
                  { t('error.activation.content') }
                </Alert>
              )}

              { currentUser?.isVerified && (
                <Alert
                  severity="success"
                  title={t('success.title')}
                  primaryAction={goToDashboardButton}
                >
                  { t('success.content') }
                </Alert>
              )}
            </>
          )}
        </LayoutContainer>
        
      </AnonymousLayout>
    </>
  );
}

export default Activate;
