import React, { useReducer } from 'react';

import CurrentUserContext from '../contexts/CurrentUser';

const DEFAULT_STATE = {
    currentUser: null, hasError: false, isLoading: false,
};

function reducer(state = DEFAULT_STATE, action) {
    switch (action.type) {
        case 'request':
            return { ...state, hasError: false, isLoading: true };
        
        case 'request-failure':
            return { currentUser: null, hasError: true, isLoading: false };

        case 'request-success':
            return { currentUser: action.payload, hasError: false, isLoading: false };

        case 'logout': 
            return DEFAULT_STATE;

        default: return state;
    }
}

export default function CurrentUserProvider({ children }) {
    const [state, dispatch] = useReducer(reducer, DEFAULT_STATE);

    return (
        <CurrentUserContext.Provider value={{ state, dispatch }}>
            { children }
        </CurrentUserContext.Provider>
    );
}

