import { makeStyles, Typography } from '@material-ui/core';
import c from 'classnames';

const useStyles = makeStyles(({ palette, spacing, typography }) => ({
    root: {
        color: palette.primary.contrastText,
        backgroundColor: palette.primary.main,
        display: 'inline-block',
        transformOrigin: 'center',
    },
    h1: {
        padding: spacing(2),
        transform: 'rotate(355deg)',
    },
    h2: {
        padding: spacing(1),
        transform: 'rotate(1deg)',
        '& $textContent': {
            fontWeight: typography.fontWeightLight,
        },
    },
    textContent: {},
}), { classNamePrefix: 'BigTitle' });

export default function BigTitle({ variant = 'h1', ...otherProps }) {
    const classes = useStyles();

    return (
        <div className={c(classes.root, classes[variant])}>
            <Typography variant={variant} className={classes.textContent} {...otherProps} />
        </div>
    );
}
