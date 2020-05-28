
import { useEffect } from 'react';
import { Grid, makeStyles } from '@material-ui/core';
import Router from 'next/router';

import { Head } from 'modules/app';
import { makeTranslations } from 'modules/i18n';
import { AnonymousLayout, LayoutContainer } from 'modules/layouts';
import { LoginForm, useCurrentUser } from 'modules/users';

const useStyles = makeStyles(({ spacing }) => ({
  gridItem: {
    textAlign: 'center',
    margin: spacing(4),
  },
  gridItemWrapper: {
    padding: spacing(3, 1),
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    boxSizing: 'border-box',
    position: 'relative',
  },
  gridItemTitle: {
    margin: spacing(1, 0, 3, 0)
  },
}), { classNamePrefix: 'Login' });

const useTranslations = makeTranslations('login', {
  fr: {
    metaTitle: 'yath - Inscription / Connection',
  },
  en: {
    metaTitle: 'yath - Register / Sign in',
  },
});

const Login = () => {
  const t = useTranslations();
  const classes = useStyles();
  const { currentUser, hasError } = useCurrentUser(true);

  const formClasses = {
    root: classes.gridItemWrapper,
    title: classes.gridItemTitle,
  };

  useEffect(() => {
    if (!hasError && Boolean(currentUser)) {
      Router.push('/dashboard');
    }
  }, [currentUser, hasError]);
  
  return (
    <>
      <Head title={t('metaTitle')} />
      
      <AnonymousLayout>

        <LayoutContainer>
          <Grid container justify="center" spacing={0}>
            <Grid item xs={12} md={4} className={classes.gridItem}>
              <LoginForm classes={formClasses} />
            </Grid>

            <Grid item xs={12} md={4} className={classes.gridItem}>
                <LoginForm isRegistration classes={formClasses} />
            </Grid>
          </Grid>
        </LayoutContainer>
        
      </AnonymousLayout>
    </>
  );
}

export default Login;
