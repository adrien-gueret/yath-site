import { makeStyles, Container, Drawer, Hidden } from '@material-ui/core';

const useStyles = makeStyles(({ spacing, breakpoints }) => ({
    root: {},
    container: {
        padding: spacing(4, 2),
    },
    [breakpoints.up('md')]: {
        container: {
            padding: spacing(8, 4),
        },
    },
}), { classNamePrefix: 'LayoutContainer' });

function LayoutContainer({ classes: customClasses, ...otherProps }) {
    const classes = useStyles({ classes: customClasses });
    return (
        <div className={classes.root}>
            <Container
                maxWidth="lg"
                className={classes.container}
                {...otherProps}
            />
        </div>
    );
}

export default LayoutContainer;
