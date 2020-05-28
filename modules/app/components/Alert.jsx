import { makeStyles, Icon, Typography } from '@material-ui/core';

const useStyles = makeStyles(({ palette, spacing }) => ({
    root: {
        color: ({ severity }) => {
            switch (severity) {
                case 'error': return palette.error.dark;
                case 'success': return palette.success.dark;
                default: return palette.warning.dark;
            }
        },
        marginBottom: spacing(4),
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
}), { classNamePrefix: 'NotConnectedAlert' });


export default function NotConnectedAlert({ children, title, details, severity = 'warning', secondaryAction, primaryAction }) {
    const classes = useStyles({ severity });
    const severityIcons = {
        error: 'error',
        warning: 'warning',
        success: 'check_circle',
    }

    return (
        <>
            <div className={classes.root}>
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
