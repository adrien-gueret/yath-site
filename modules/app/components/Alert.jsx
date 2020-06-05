import { makeStyles, Icon, Typography } from '@material-ui/core';
import c from 'classnames';

const useStyles = makeStyles(({ palette, spacing }) => ({
    root: {
        marginBottom: spacing(4),
    },
    isWarning: {
        color: palette.warning.dark,
    },
    isError: {
        color: palette.error.dark,
    },
    isSuccess: {
        color: palette.success.dark,
    },
    icon: {
      verticalAlign: 'middle',
      marginRight: spacing(1),
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
}), { classNamePrefix: 'Alert' });


export default function Alert({ children, title, details, severity = 'warning', secondaryAction, primaryAction }) {
    const classes = useStyles();
    const severityIcons = {
        error: 'error',
        warning: 'warning',
        success: 'check_circle',
    }
    
    const rootClassName = c(classes.root, {
        [classes.isError]: severity === 'error',
        [classes.isSuccess]: severity === 'success',
        [classes.isWarning]: severity === 'warning',
    });

    return (
        <>
            <div className={rootClassName}>
                <Typography className={classes.title} variant="h5">
                    <Icon
                        className={classes.icon}
                        fontSize="inherit"
                    >
                        { severityIcons[severity] }
                    </Icon>
                    { title }
                </Typography>
                <Typography variant="body1">{ children }</Typography>
            </div>
            
            { details && <Typography variant="body1">{ details }</Typography> }
            
            { (secondaryAction || primaryAction) && (
                <div className={classes.ctaContainer}>
                    { secondaryAction && (
                        React.cloneElement(secondaryAction, {
                            className: classes.cta,
                            color: 'secondary',
                            variant: 'outlined',
                            size: 'large',
                        })
                    )}

                    { primaryAction && (
                        React.cloneElement(primaryAction, {
                            className: classes.cta,
                            color: 'primary',
                            variant: 'contained',
                            size: 'large',
                        })
                    )}
                </div>
            )}
        </>
    );
}
