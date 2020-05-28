import { makeStyles, Button, CircularProgress } from '@material-ui/core';
import c from 'classnames';

const useStyles = makeStyles(({ palette }) => ({
  root: {
    position: 'relative',
    display: 'inline-block',
  },
  progress: {
    color: palette.primary.main,
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
}), { classNamePrefix: 'ProcessingButton' });

const ProcessingButton = ({ isProcessing, className, disabled, ...otherProps }) => {
  const classes = useStyles();

  return (
    <span className={c(classes.root, className)}>
      <Button
        disabled={disabled || isProcessing}
        {...otherProps}
      />
      { isProcessing && <CircularProgress size={24} className={classes.progress} /> }
    </span>
  );
};

export default ProcessingButton;
