import { useState } from 'react';

import {
    makeStyles, TextField,InputAdornment, IconButton, Icon,
    CircularProgress
} from '@material-ui/core';

const useStyles = makeStyles(({ spacing }) => ({
    loader: {
        margin: spacing(0, 2, 0, 2),
    },
}), { classNamePrefix: 'FormInput' });

function FormInput({ label, name, defaultValue, type = 'text', helperText = ' ', onSubmit = async () => {} }) {
    const [storedValue, setStoredValue] = useState(defaultValue);
    const [tempValue, setTempValue] = useState(defaultValue);
    const [isProcessing, setIsProcessing] = useState(false);

    const classes = useStyles();

    const canSubmit = !isProcessing && storedValue !== tempValue;

    let endAdornment = null;

    if (isProcessing) {
        endAdornment = <CircularProgress className={classes.loader} size={24} />;
    } else if (canSubmit) {
        endAdornment = (
            <InputAdornment position="end">
                <IconButton type="submit">
                    <Icon>save</Icon>
                </IconButton>
            </InputAdornment>
        );
    }

    const onChange = (e) => setTempValue(e.target.value);
    const onSubmitHandler = async (e) => {
        e.preventDefault();
        if (!canSubmit) {
            return;
        }

        setIsProcessing(true);

        try {
            await onSubmit(tempValue);
            setStoredValue(tempValue);
        } catch (e) {
            console.log('error', e);
        }
        
        setIsProcessing(false);
        
    };

    return (
        <form onSubmit={onSubmitHandler}>
            <TextField
                label={label}
                type={type}
                name={name}
                variant="filled"
                fullWidth
                margin="normal"
                value={tempValue}
                onChange={onChange}
                helperText={helperText}
                InputProps={{ endAdornment }}
            />
        </form>
    );
}

export default FormInput;
