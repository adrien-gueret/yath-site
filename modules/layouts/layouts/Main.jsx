import { makeStyles, AppBar } from '@material-ui/core';

const useStyles = makeStyles(({ palette }) => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        background: palette.background.default,
    },
    header: {
        height: 48,
    },
    main: {
        flexGrow: 1,
    },
    footer: {
        height: 24,
    },
}), { classNamePrefix: 'MainLayout' });

export default function MainLayout({ children }) {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <AppBar className={classes.header} position="static" />

            <main className={classes.main}>
                { children }
            </main>

            <AppBar component="footer" className={classes.footer} position="static" />
        </div>
    );
}
