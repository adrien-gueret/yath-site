import { useState } from 'react';
import { makeStyles, Icon, Typography, Button } from '@material-ui/core';
import { Alert } from '@material-ui/lab';

import { useMutation } from 'react-query';

import { Head, Link, ProcessingButton } from 'modules/app';
import { makeTranslations } from 'modules/i18n';
import { DashboardLayout, LayoutContainer } from 'modules/layouts';
import { NotConnectedAlert } from 'modules/users';

const useStyles = makeStyles(() => ({
  
}), { classNamePrefix: 'Dashboard' });

const useTranslations = makeTranslations('dashboard', {
  fr: {
    metaTitle: 'Tableau de bord - yath',
    notConnectedAdvice: 'Avec un compte, vous pouvez sauvegarder et partager vos histoires directement sur ce site.',
    create: {
      cta: 'Accéder à l\'éditeur',
      not_conntected: 'Vous pouvez utiliser malgré tout l\'éditeur en mode anonyme : pensez simplement à sauvegarder votre histoire par vous-même !',
    },
    verificationWarning: {
      content: 'Votre e-mail n\'est pas vérifié : vous ne pouvez pas accéder à toutes les fonctionalités de yath. Merci de bien vouloir valider votre compte depuis l\'e-mail envoyé lors de sa création.',
      cta: 'Renvoyer la confirmation',
      resent: 'Envoyé',
    },
  },
  en: {
    metaTitle: 'Dashboard - yath',
    notConnectedAdvice: 'With an account, you can save and share your stories directly on this site.',
    create: {
      cta: 'Go to editor',
      not_conntected: 'You can still use the editor in anonymous mode: just think about save your story by yourself!',
    },
    verificationWarning: {
      content: 'Your email is not verified: you cannot access all the features of yath. Please validate your account from the email sent when it was created.',
      cta: 'Resend confirmation',
      resent: 'Sent',
    },
  },
});

const Dashboard = () => {
  const t = useTranslations();
  const classes = useStyles();
  const [hasEmailBeenResent, setHasEmailBeenResent] = useState(false);

  const [resendEmailConfirmation, { status: requestStatus, error: requestError }] = useMutation(async () => {
    return clientApi.post('/me/resendConfirmation');
}, {
  onSuccess() {
    setHasEmailBeenResent(true);
  },
});
  
  return (
    <>
      <Head title={t('metaTitle')} />
      
      <DashboardLayout>
        { (currentUserState) => (
            (currentUserState.hasError || !currentUserState.currentUser) ? (
              <> 
                <LayoutContainer>
                  <NotConnectedAlert
                    details={t('create.not_conntected')}
                    secondaryAction={(
                      <Button
                        component="a"
                        href={process.env.NEXT_PUBLIC_EDITOR_URL}
                      >
                        { t('create.cta') }
                      </Button>
                    )}
                  >
                    { t('notConnectedAdvice' )}
                  </NotConnectedAlert>
                </LayoutContainer>
              </>
            ) : (
              <div>
                { !currentUserState.currentUser.isVerified && (
                  <Alert
                    severity="warning"
                    action={
                      <ProcessingButton
                        color="inherit"
                        size="small"
                        onClick={resendEmailConfirmation}
                        isProcessing={requestStatus === 'loading'}
                        disabled={hasEmailBeenResent}
                      >
                         { hasEmailBeenResent ? t('verificationWarning.resent') : t('verificationWarning.cta') }
                      </ProcessingButton>
                    }
                  >
                    { t('verificationWarning.content') }
                  </Alert>
                )}

                <LayoutContainer>
                  Connected!
                  { JSON.stringify(currentUserState.currentUser) }    
                </LayoutContainer>
              
              </div>
            )
        ) }
      </DashboardLayout>
    </>
  );
}

export default Dashboard;
