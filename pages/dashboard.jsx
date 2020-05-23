import { makeStyles, Icon, Typography, Button } from '@material-ui/core';

import { Head, Link } from 'modules/app';
import { makeTranslations } from 'modules/i18n';
import { DashboardLayout, LayoutContainer } from 'modules/layouts';

const useStyles = makeStyles(({ palette, spacing }) => ({
  icon: {
    verticalAlign: 'middle',
  },
  notConnected: {
    color: palette.warning.dark,
    marginBottom: spacing(4),
  },
  title: {
    marginBottom: spacing(2),
  },
  ctaContainer: {
    textAlign: 'right',
    marginTop: spacing(3),
  },
  cta: {
    margin: spacing(2),
  },
}), { classNamePrefix: 'Dashboard' });

const useTranslations = makeTranslations('dashboard', {
  fr: {
    metaTitle: 'Tableau de bord - yath',
    not_connected: {
      title: 'Vous n\'êtes pas connecté.',
      content: 'Avec un compte, vous pouvez sauvegarder et partager vos histoires directement sur ce site.',
    },
    create: {
      cta: 'Accéder à l\'éditeur',
      not_conntected: 'Vous pouvez utiliser malgré tout l\'éditeur en mode anonyme : pensez simplement à sauvegarder votre histoire par vous-même !',
    },
    login: 'Se connecter',
  },
  en: {
    metaTitle: 'Dashboard - yath',
    not_connected: {
      title: 'Your are not connected.',
      content: 'With an account, you can save and share your stories directly on this site.',
    },
    create: {
      cta: 'Go to editor',
      not_conntected: 'You can still use the editor in anonymous mode : just think about save your story by yourself!',
    },
    login: 'Login',
  },
});

const Dashboard = () => {
  const t = useTranslations();
  const classes = useStyles();
  
  return (
    <>
      <Head title={t('metaTitle')} />
      
      <DashboardLayout>
        { (currentUserState) => (
            currentUserState.hasError && (
              <> 
                <LayoutContainer>
                  <div className={classes.notConnected}>
                    <Typography className={classes.title} variant="h5">
                      <Icon className={classes.icon} fontSize="inherit">warning</Icon>{ t('not_connected.title') }
                    </Typography>
                    <Typography variant="body1">{ t('not_connected.content') }</Typography>
                  </div>

                  <Typography variant="body1">{ t('create.not_conntected') }</Typography>

                  <div className={classes.ctaContainer}>
                    <Button
                      className={classes.cta}
                      color="secondary"
                      variant="outlined"
                      size="large"
                      component="a"
                      href={ process.env.NEXT_PUBLIC_EDITOR_URL }
                    >
                      { t('create.cta') }
                    </Button>
                    <Button
                      className={classes.cta}
                      color="primary"
                      variant="contained"
                      size="large"
                      component={Link}
                      href="/login"
                    >
                      { t('login') }
                    </Button>
                  </div>
                </LayoutContainer>
              </>
            )
        ) }
      </DashboardLayout>
    </>
  );
}

export default Dashboard;
