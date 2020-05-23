import { makeStyles, AppBar, Toolbar } from '@material-ui/core';

import { LocaleSwitcher } from 'modules/i18n';
import { useCurrentUser } from 'modules/users';

const useStyles = makeStyles(({ palette }) => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        background: palette.background.default,
    },
    toRight: {
        marginLeft: 'auto',
    },
    main: {
        flexGrow: 1,
    },
    footer: {
        height: 24,
    },
}), { classNamePrefix: 'DashboardLayout' });

export default function DashboardLayout({ children }) {
    const classes = useStyles();
    const currentUserState = useCurrentUser();

    return (
        <div className={classes.root}>
            <AppBar className={classes.header} position="static">
                <Toolbar>
                    <span className={classes.toRight}>
                        <LocaleSwitcher />
                    </span>
                </Toolbar>
            </AppBar>

            <main className={classes.main}>
                { typeof children === 'function' ? children(currentUserState) : children }
            </main>

            <AppBar component="footer" className={classes.footer} position="static" />
        </div>
    );
}
