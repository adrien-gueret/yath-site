import { useContext } from 'react';

import {
    makeStyles, AppBar, Toolbar, Hidden, IconButton, Icon, Drawer,
    useTheme, useMediaQuery, Typography, Divider, List, ListItem,
    ListItemText, ListItemAvatar, ListItemIcon,
} from '@material-ui/core';

import { useMutation } from 'react-query';

import { clientApi } from 'modules/app';
import { LocaleSwitcher, makeTranslations } from 'modules/i18n';
import { useCurrentUser, CurrentUserContext, Avatar } from 'modules/users';

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
        footer: {
            height: 24,
        },
        username: {
            overflow: 'hidden',
            textOverflow: 'ellipsis',
        },
        [breakpoints.up('md')]: {
            main: {
                marginLeft: ({ isDrawerHidden }) => isDrawerHidden ? 0 : drawerWidth,
            },
        },
    };
}, { classNamePrefix: 'DashboardLayout' });

const useTranslations = makeTranslations('dashboardLayout', {
    fr: {
        logout: 'Se déconnecter',
    },
    en: {
        logout: 'Log out',
    },
});

export default function DashboardLayout({ children }) {
    const currentUserState = useCurrentUser(true);
    const { dispatch } = useContext(CurrentUserContext);
    const { breakpoints } = useTheme();
    const isDrawerPermanent = useMediaQuery(breakpoints.up('md'));
    const isDrawerHidden = !currentUserState.currentUser || currentUserState.hasError;

    const [isDrawerOpen, setIsDrawerOpen] = React.useState(!isDrawerHidden && isDrawerPermanent);

    const handleDrawerToggle = () => {
        setIsDrawerOpen(prevState => !prevState);
    };

    const [logout] = useMutation(() => clientApi.delete('/token'), {
        async onSettled() {
            await clientApi.requestToken('client_credentials');
            dispatch({ type: 'logout' });
            clientApi.setOauth2Tokens();
        },
    });

    const t = useTranslations();
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
                            <ListItem>
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

            <AppBar component="footer" className={classes.footer} position="static" />
        </div>
    );
}
