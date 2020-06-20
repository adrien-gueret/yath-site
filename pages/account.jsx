import { useContext } from 'react';
import {
  makeStyles, Typography, CircularProgress,
} from '@material-ui/core';

import { useMutation } from 'react-query';

import { clientApi, useSnackMessage, Head, FormInput } from 'modules/app';
import { makeTranslations } from 'modules/i18n';
import { DashboardLayout, LayoutContainer } from 'modules/layouts';
import { NotConnectedAlert, CurrentUserContext } from 'modules/users';

const useStyles = makeStyles(({ spacing, breakpoints }) => ({
  progressContainer: {
    padding: spacing(7),
    textAlign: 'center',
  },
  formContainer: {
    marginTop: spacing(4),
    width: '50%',
  },
  [breakpoints.down('md')]: {
    formContainer: {
      width: '100%',
    },
  },
}), { classNamePrefix: 'Account' });

const useTranslations = makeTranslations('account', {
  fr: {
    metaTitle: 'Mon compte - yath',
    title: 'Mon compte',
    form: {
      username: {
        label: 'Nom d\'utilisateur',
        success: 'Votre nom d\'utilisateur a bien été modifié.',
      },
      email: {
        label: 'E-mail',
        helper: 'Votre compte devra être validé à nouveau via l\'e-mail de confirmation que vous recevrez.',
        success: 'Votre e-mail a bien été modifié : surveillez votre boîte de réception pour le confirmer !',
      },
    },
  },
  en: {
    metaTitle: 'My account - yath',
    title: 'My account',
    form: {
      username: {
        label: 'Username',
        success: 'Your user has been updated.',
      },
      email: {
        label: 'Email',
        helper: 'Your account will have to be confirmed again from the confirmation email you will receive.',
        success: 'Your email has been updated: check your inbox to confirm it!',
      },
    },
  },
});

const Account = () => {
  const t = useTranslations();
  const classes = useStyles();
  const [openSnackbar] = useSnackMessage();
  const { dispatch } = useContext(CurrentUserContext);

  const onRequestError = ({ body }) => openSnackbar(body.error, 'error');
  const getOnRequestSuccess = successMessage => ({ body }) => {
    dispatch({ type: 'set', payload: body });
    openSnackbar(successMessage, 'success');
  };

  const [updateUsername] = useMutation(async (newUsername) => clientApi.patch('/me',  { username: newUsername }), {
    onSuccess: getOnRequestSuccess(t('form.username.success')),
    onError: onRequestError,
  });

  const [updateEmail] = useMutation(async (newEmail) => clientApi.patch('/me',  { email: newEmail }), {
    onSuccess: getOnRequestSuccess(t('form.email.success')),
    onError: onRequestError,
  });
  
  return (
    <>
      <Head title={t('metaTitle')} />
        
      <DashboardLayout>
        { ({ hasError, isLoading, currentUser }) => {
          if (hasError || (!isLoading && !currentUser)) {
            return (
              <LayoutContainer>
                <NotConnectedAlert severity="error" />
              </LayoutContainer>
            );
          }
          
          if (isLoading || !currentUser) {
            return (
              <div className={classes.progressContainer}>
                <CircularProgress size={128} thickness={2} />
              </div>
            );
          }

          return (
            <div>
              <LayoutContainer>
                <Typography variant="h5">
                    { t('title') }
                </Typography>

                <div className={classes.formContainer}>
                  <FormInput
                    label={t('form.username.label')}
                    name="username"
                    defaultValue={currentUser.username}
                    onSubmit={updateUsername}
                  />

                  <FormInput
                    label={t('form.email.label')}
                    name="email"
                    helperText={t('form.email.helper')}
                    defaultValue={currentUser.email}
                    onSubmit={updateEmail}
                  />
                </div>

               
              </LayoutContainer>
            </div>
          );
        } }
      </DashboardLayout>
    </>
  );
}

export default Account;
