import { Grid, Typography, makeStyles, Icon, Paper, Button } from '@material-ui/core';

import { BigTitle, Head } from 'modules/app';
import { makeTranslations } from 'modules/i18n';
import { MainLayout, LayoutContainer } from 'modules/layouts';

const useStyles = makeStyles(({ palette, spacing, typography }) => ({
  titleContainer: {
    backgroundColor: palette.grey[200],
  },
  initial: {
    display: 'inline-block',
    '&:first-letter': {
      fontWeight: typography.fontWeightMedium,
    },
  },
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
  },
  gridItemTitle: {
    margin: spacing(1, 0, 3, 0)
  },
  icon: {
    ...{...typography.h3, fontFamily: undefined },
  },
  cta: {
    margin: [['auto', 0, spacing(1), 0]],
  },
}), { classNamePrefix: 'Home' });

const useTranslations = makeTranslations('home', {
  fr: {
    metaDescription: 'Avez yath, écrivez et partagez vos histoires dont vous êtes le héros.',
    play: {
      title: 'Jouez',
      content: 'Découvrez les histoires des autres créateurs.',
      cta: 'Lire',
    },
    create: {
      title: 'Créez',
      content: 'Écrivez votre propre histoire dont vous êtes le héros.',
      cta: 'Écrire',
    },
  },
  en: {
    metaDescription: 'With yath, write and share your own adventures in which you\'re the hero.',
    play: {
      title: 'Play',
      content: 'Discover other creators\' stories.',
      cta: 'Read',
    },
    create: {
      title: 'Create',
      content: 'Write your own adventure in which you\'re the hero.',
      cta: 'Write',
    },
  },
});

const Home = () => {
  const t = useTranslations();
  const classes = useStyles();
  
  return (
    <>
      <Head description={t('metaDescription')} />
      
      <MainLayout>

        <LayoutContainer classes={{ root: classes.titleContainer }}>
          <BigTitle>yath</BigTitle>
          <br />
          <BigTitle variant="h2">
            <span className={classes.initial}>you</span>
            { ' ' }
            <span className={classes.initial}>are</span>
            { ' ' }
            <span className={classes.initial}>the</span>
            { ' ' }
            <span className={classes.initial}>hero!</span>
          </BigTitle>
        </LayoutContainer>

        <LayoutContainer>
          <Grid container justify="center" spacing={0}>
            <Grid item xs={12} sm={4} className={classes.gridItem}>
              <Paper className={classes.gridItemWrapper}>
                <Icon className={classes.icon}>create</Icon>
                <Typography variant="h4" className={classes.gridItemTitle}>
                  { t('create.title') }
                </Typography>
                <Typography variant="body2">
                  { t('create.content') }
                </Typography>
                <Button
                  className={classes.cta}
                  color="primary"
                  variant="outlined"
                  size="large"
                >
                  { t('create.cta') }
                </Button>
              </Paper>
            </Grid>

            <Grid item xs={12} sm={4} className={classes.gridItem}>
              <Paper className={classes.gridItemWrapper}>
                <Icon className={classes.icon}>sports_esports</Icon>
                <Typography variant="h4" className={classes.gridItemTitle}>
                  { t('play.title') }
                </Typography>
                <Typography variant="body2">
                  { t('play.content') }
                </Typography>
                <Button
                  className={classes.cta}
                  color="primary"
                  variant="outlined"
                  size="large"
                >
                  { t('play.cta') }
                </Button>
              </Paper>
            </Grid>
          </Grid>
        </LayoutContainer>
        
      </MainLayout>
    </>
  );
}

export default Home
