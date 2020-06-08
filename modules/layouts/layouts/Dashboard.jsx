import { useContext, useState } from 'react';

import {
    makeStyles, AppBar, Toolbar, Hidden, IconButton, Icon, Drawer,
    useTheme, useMediaQuery, Typography, Divider, List, ListItem,
    ListItemText, ListItemAvatar, ListItemIcon, Button,
} from '@material-ui/core';

import { useMutation } from 'react-query';

import { clientApi, useSnackMessage } from 'modules/app';
import { LocaleSwitcher, makeTranslations } from 'modules/i18n';
import { useCurrentUser, CurrentUserContext, Avatar } from 'modules/users';

import Overlay from '../components/Overlay';

const useStyles = makeStyles(({ palette, spacing, breakpoints, zIndex }) => {
    const drawerWidth = 240;

    return {
        root: {
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
            background: palette.background.default,
        },
        title: {
            marginLeft: spacing(2),
        },
        toRight: {
            marginLeft: 'auto',
        },
        drawer: {
            zIndex: zIndex.appBar - 1,
            width: drawerWidth,
        },
        main: {
            flexGrow: 1,
        },
        username: {
            overflow: 'hidden',
            textOverflow: 'ellipsis',
        },
        arrow: {
            position: 'absolute',
            left: 100,
            top: 170,
            width: '20%',
            fill: 'rgba(255,255,255,.8)',
            transform: 'rotate(-90deg)',
        },
        [breakpoints.up('md')]: {
            main: {
                marginLeft: ({ isDrawerHidden }) => isDrawerHidden ? 0 : drawerWidth,
            },
        },
        [breakpoints.up('lg')]: {
            arrow: {
                left: 160,
                top: 130,
                width: '25%',
                transform: 'rotate(-105deg)',
            },
        },
    };
}, { classNamePrefix: 'DashboardLayout' });

const useTranslations = makeTranslations('dashboardLayout', {
    fr: {
        logout: 'Se déconnecter',
        logoutSuccess: 'Vous êtes bien déconnecté : au revoir !',
        welcomeDialog: {
            title: 'Bienvenue sur yath !',
            content: 'Votre compte a bien été créé ! Une petite chose avant de continuer...',
            content2: 'Nous utilisons les services de Gravatar pour essayer de retrouver votre avatar habituel : si nous n\'y parvenons pas, un robot de Robohash vous représente à la place.',
            content3: 'De plus, nous vous avons généré un pseudonyme aléatoire, en espérant qu\'il vous plaise !',
            content4: 'Bien entendu, vous pouvez modifier ces informations depuis votre profil si vous le désirez.',
            ctaEdit: 'Modifier',
            ctaDashboard: 'Plus tard',
        },
    },
    en: {
        logout: 'Log out',
        logoutSuccess: 'You are logged out: see you soon!',
        welcomeDialog: {
            title: 'Welcome on yath!',
            content: 'Your account has been created! One small thing before going further...',
            content2: 'We use Gravatar services to fetch your usual avatar: if it does not work, a robot from Robohash will be displayed instead.',
            content3: 'It is also worth to note that a random username has been generated for you. We hope you like it!',
            content4: 'You can of course edit these data from your user account.',
            ctaEdit: 'Edit',
            ctaDashboard: 'Later',
        },
    },
});

export default function DashboardLayout({ children, isJustRegistered }) {
    const currentUserState = useCurrentUser(true);
    const { dispatch } = useContext(CurrentUserContext);
    const { breakpoints } = useTheme();
    const isDrawerPermanent = useMediaQuery(breakpoints.up('md'));
    const isDrawerHidden = !currentUserState.currentUser || currentUserState.hasError;
    const [openSnackbar] = useSnackMessage();
    const [userMenuItem, setUserMenuItem] = useState(null);

    const [isDrawerOpen, setIsDrawerOpen] = useState(!isDrawerHidden && isDrawerPermanent);

    const t = useTranslations();

    const handleDrawerToggle = () => {
        setIsDrawerOpen(prevState => !prevState);
    };

    const [logout] = useMutation(() => clientApi.delete('/token'), {
        async onSettled() {
            await clientApi.requestToken('client_credentials');
            dispatch({ type: 'logout' });
            clientApi.setOauth2Tokens();
            openSnackbar(t('logoutSuccess'), 'success');
        },
    });

    const classes = useStyles({ isDrawerHidden });

    return (
        <div className={classes.root}>
            <AppBar position="static">
                <Toolbar>
                    { !isDrawerHidden && (
                        <Hidden mdUp implementation="js">
                            <IconButton
                                color="inherit"
                                edge="start"
                                onClick={handleDrawerToggle}
                            >
                                <Icon>menu</Icon>
                            </IconButton>
                        </Hidden>
                    )}

                    <Typography className={classes.title} variant="h6" component="h1">yath</Typography>
                    
                    <span className={classes.toRight}>
                        <LocaleSwitcher />
                    </span>
                </Toolbar>
            </AppBar>

            { !isDrawerHidden && (
                 <nav className={classes.drawer}>
                    <Drawer
                        classes={{
                            paper: classes.drawer,
                        }}
                        variant={isDrawerPermanent ? 'permanent' : 'temporary'}
                        open={isDrawerOpen}
                        onClose={handleDrawerToggle}
                    >
                        <Hidden smDown implementation="js">
                            <Toolbar />
                        </Hidden>
                        
                        <Divider />

                        <List>
                            <ListItem ref={setUserMenuItem}>
                                <ListItemAvatar>
                                    <Avatar alt={currentUserState.currentUser.username} src={currentUserState.currentUser.avatarUrl} />
                                </ListItemAvatar>
                                <ListItemText
                                    primary={currentUserState.currentUser.username}
                                    classes={{ primary: classes.username }}
                                />
                            </ListItem>
                            <Divider />
                            <ListItem button onClick={logout}>
                                <ListItemIcon><Icon>exit_to_app</Icon></ListItemIcon>
                                <ListItemText primary={t('logout')} />
                            </ListItem>
                        </List>
                    </Drawer>
                </nav>
            )}

            <main className={classes.main}>
                { typeof children === 'function' ? children(currentUserState) : children }
            </main>

            { (isJustRegistered && !isDrawerHidden) && (
                <Overlay
                    holes={isDrawerPermanent ? [userMenuItem] : []}
                    dialogTitle={t('welcomeDialog.title')}
                    dialogContent={(
                        <>
                            <p>{ t('welcomeDialog.content') }</p>
                            <p>{ t('welcomeDialog.content2') }</p>
                            <p>{ t('welcomeDialog.content3') }</p>
                            <p>{ t('welcomeDialog.content4') }</p>
                        </>
                    )}
                    dialogActions={(
                        <>
                            <Button color="secondary" variant="outlined">
                                { t('welcomeDialog.ctaDashboard') }
                            </Button>
                            <Button color="primary" variant="contained">
                                { t('welcomeDialog.ctaEdit') }
                            </Button>
                        </>
                    )}
                >
                    { isDrawerPermanent && (
                        <svg viewBox="0 0 900 900" className={classes.arrow}>
                            <path d="M210.9,639.601C251.5,541,319.4,457.5,407.3,398.101c40.2-27.2,83.5-48.7,128.799-64.101v143.4L863.301,248L536.1,18.5 v138.3c-79.4,20.1-155.2,54-224,100.5c-115.7,78.2-205,188-258.4,317.6C18.1,661.201,0.1,752,0,844.701l170,0.1 C170.1,774.401,183.8,705.3,210.9,639.601z" />
                        </svg>
                    )}
                </Overlay>
            )}
        </div>
    );
}
