import React, { useReducer } from 'react';

import { Snackbar, Slide } from '@material-ui/core';
import { Alert } from '@material-ui/lab';

import SnackMessageContext from '../contexts/SnackMessage';

const DEFAULT_STATE = {
    isOpen: false,
    severity: 'info',
    content: '',
};

function reducer(state = DEFAULT_STATE, action) {
    switch (action.type) {
        case 'open':
            return { isOpen: true, severity: action.payload.severity, content: action.payload.content };
        
        case 'close':
            return { ...state, isOpen: false };

        default: return state;
    }
}

function SlideTransition(props) {
    return <Slide {...props} direction="up" />;
  }

export default function SnackMessageProvider({ children }) {
    const [state, dispatch] = useReducer(reducer, DEFAULT_STATE);

    const open = (content, severity) => {
        dispatch({ type: 'open', payload: { content, severity }});
    };

    const close = () => {
        dispatch({ type: 'close' });
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
    
        close();
      };

    return (
        <SnackMessageContext.Provider value={{ open, close }}>
            { children }

            <Snackbar
                open={state.isOpen}
                autoHideDuration={5000}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                TransitionComponent={SlideTransition}
            >
                <Alert onClose={handleClose} severity={state.severity}>
                    { state.content }
                </Alert>
            </Snackbar>
        </SnackMessageContext.Provider>
    );
}
