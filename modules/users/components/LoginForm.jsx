import { useState } from 'react';
import { useMutation } from 'react-query';
import Router from 'next/router';

import { Typography, makeStyles, Icon, Paper, Button, TextField, Collapse, useMediaQuery, useTheme } from '@material-ui/core';
import { Alert } from '@material-ui/lab';

import c from 'classnames';

import { Link, ProcessingButton, clientApi } from 'modules/app';
import { makeTranslations } from 'modules/i18n';

const useStyles = makeStyles(({ breakpoints, palette, spacing, typography }) => ({
    root: {},
    title: {},
    icon: {
      ...{...typography.h3, fontFamily: undefined },
    },
    submit: {
      margin: spacing('auto', 0, 1, 0),
      alignSelf: 'center',
    },
    alert: {
        marginTop: 'auto',
    },
    form: {
      padding: spacing(2, 0),
      width: '80%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      margin: 'auto',
    },
    collapseWrapper: {
      height: '100%',
    },
    collapseEntered: {
      height: ['100%', '!important'],
    },
    fieldContainer: {
      marginBottom: spacing(4),
    },
    field: {
      marginBottom: spacing(1),
    },
    forgottenPasswordContainer: {
      alignSelf: 'flex-start',
      marginTop: -spacing(3),
    },
    forgottenPassword: {
      color: palette.primary.main,
      textDecoration: 'none',
      '&:hover': {
        color: palette.secondary.main,
      },
    },
    [breakpoints.up('md')]: {
      expand: {
        display: 'none',
      },
    },
    [breakpoints.down('sm')]: {
      content: {
        display: 'none',
      },
    },
}), { classNamePrefix: 'LoginForm' });

const useTranslations = makeTranslations('loginForm', {
    fr: {
      signIn: {
        title: 'Déjà enregistré ?',
        content: 'Connectez-vous à votre compte.',
        expandContent: 'Connectez-vous',
        cta: 'Se connecter',
        error: {
            invalidGrant: 'Impossible de vous connecter. Veuillez vérifier vos identifiants.',
            global: 'Impossible de vous connecter. Ce n\'est pas vous, c\'est nous ! Une erreur générale est survenue, veuillez réssayer plus tard.',
        },
      },
      register: {
        title: 'Nouvel utilisateur ?',
        content: 'Inscrivez-vous gratuitement !',
        expandContent: 'Inscrivez-vous gratuitement',
        cta: 'S\'inscrire',
        error: {
            specific: 'Impossible de vous inscrire. %(errorMessage)s',
            confirmPassword: 'Le mot de passe et sa confirmation doivent être identiques.',
            global: 'Impossible de vous inscrire. Ce n\'est pas vous, c\'est nous ! Une erreur générale est survenue, veuillez réssayer plus tard.',
        },
      },
      form: {
        email: {
          label: 'E-mail',
          placeholder: 'votre@email.fr',
        },
        password: {
          label: 'Mot de passe',
        },
        confirmPassword: {
          label: 'Confirmation du mot de passe',
        },
        forgottenPassword: 'Mot de passe oublié ?',
      },
    },
    en: {
      signIn: {
        title: 'Already registered?',
        content: 'Sign in into your account.',
        expandContent: 'Sign in',
        cta: 'Sign in',
        error: {
            invalidGrant: 'Can\'t sign in. Please check your credentials.',
            global: 'Can\'t sign in. It isn\'t you, it\'s us! A global error has occured, please try again later.',
        },
      },
      register: {
        title: 'New user?',
        content: 'Register for free!',
        expandContent: 'Register for free',
        cta: 'Register',
        error: {
            specific: 'Can\'t register. %(errorMessage)s',
            confirmPassword: 'Password and its confirmation must be the same.',
            global: 'Can\'t register. It isn\'t you, it\'s us! A global error has occured, please try again later.',
        },
      },
      form: {
        email: {
          label: 'Email',
          placeholder: 'your@email.com',
        },
        password: {
          label: 'Password',
        },
        confirmPassword: {
          label: 'Confirm your password',
        },
        forgottenPassword: 'Forgotten password?',
      },
    },
});

function LoginForm({ isRegistration, classes: customClasses }) {
    const [isExpanded, toggleIsExpanded] = useState(false);
    const t = useTranslations();
    const theme = useTheme();
    const forceCollapseIn = useMediaQuery(theme.breakpoints.up('md'));
    const classes = useStyles({ classes: customClasses });

    const translationNamespace = isRegistration ? 'register' : 'signIn';

    const [requestApi, { status: requestStatus, error: requestError }] = useMutation(async ({ email, password, confirmPassword }) => {
        if (isRegistration) {
            if (password !== confirmPassword) {
                throw { body: { error: t('register.error.confirmPassword') } };
            }
            await clientApi.post('/users', { email, password });
        }

        return clientApi.requestToken('password', { username: email, password });
    }, {
        onSuccess() {
            Router.push('/dashboard');
        },
    });

    const onSubmit = (e) => {
        e.preventDefault();
        requestApi({
            email: e.target.elements.email.value,
            password: e.target.elements.password.value,
            confirmPassword: e.target.elements.confirmPassword?.value,
        });
    };

    let errorMessage = '';

    if (Boolean(requestError)) {
        const isClientError = !requestError.statusCode || requestError.statusCode < 500;
        
        let errorLabelKey = '';
        let errorMessageVars;

        if (!isClientError || !requestError.body?.error) {
            errorLabelKey = `${translationNamespace}.error.global`;
        } else {
            if (isRegistration) {
                errorLabelKey = 'register.error.specific';
                errorMessageVars = { errorMessage: requestError.body.error };
            } else {
                errorLabelKey = ['invalid_request', 'invalid_grant'].indexOf(requestError.body.error) >= 0
                    ? 'signIn.error.invalidGrant'
                    : 'signIn.error.global';
            }
        }

        errorMessage = t(errorLabelKey, errorMessageVars);
    }

    return (
        <Paper className={classes.root}>
            <Icon className={classes.icon}>{ isRegistration ? 'person_add' : 'person' }</Icon>
            <Typography variant="h4" className={classes.title}>
                { t(`${translationNamespace}.title`) }
            </Typography>
            <Typography className={classes.content} variant="body2">
                { t(`${translationNamespace}.content`) }
            </Typography>
            <Button
                color="primary"
                className={classes.expand}
                onClick={() => toggleIsExpanded(prevState => !prevState)}
                endIcon={<Icon>{isExpanded ? 'expand_less' : 'expand_more' }</Icon>}
            >
                { t(`${translationNamespace}.expandContent`) }
            </Button>
            
            <Collapse
                in={forceCollapseIn || isExpanded}
                component="form"
                classes={{ wrapperInner: classes.form, wrapper: classes.collapseWrapper, entered: classes.collapseEntered }}
                onSubmit={onSubmit}
            >
                <div className={classes.fieldContainer}>
                    <TextField
                        label={t('form.email.label')}
                        placeholder={t('form.email.placeholder')}
                        type="email"
                        name="email"
                        fullWidth
                        margin="normal"
                        className={classes.field}
                    />
                    <TextField
                        label={t('form.password.label')}
                        type="password"
                        fullWidth
                        margin="normal"
                        name="password"
                        className={classes.field}
                    />
                    { isRegistration && (
                      <TextField
                        label={t('form.confirmPassword.label')}
                        type="password"
                        name="confirmPassword"
                        fullWidth
                        margin="normal"
                        className={classes.field}
                    />  
                    )}
                </div>

                { !isRegistration && (
                    <Typography variant="caption" className={c(classes.field, classes.forgottenPasswordContainer)}>
                        <Link className={classes.forgottenPassword} href="/forgotten-password">{ t('form.forgottenPassword') }</Link>
                    </Typography>
                )}

                { errorMessage && (
                    <Alert severity="error" className={classes.alert}>
                      { errorMessage }
                    </Alert>
                )}

                <ProcessingButton
                    className={classes.submit}
                    color="primary"
                    variant="outlined"
                    size="large"
                    type="submit"
                    isProcessing={requestStatus === 'loading'}
                >
                    { t(`${translationNamespace}.cta`) }
                </ProcessingButton>
            </Collapse>
            </Paper>
    );
}

export default LoginForm;