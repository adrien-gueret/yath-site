import React, { useReducer } from 'react';

import CurrentUserContext from '../contexts/CurrentUser';

function reducer(state, action) {
    switch (action.type) {
        case 'request':
            return { ...state, hasError: false, isLoading: true };
        
        case 'request-failure':
            return { currentUser: null, hasError: true, isLoading: false };

        case 'request-success':
            return { currentUser: action.payload, hasError: false, isLoading: false };

        case 'logout': 
            return { currentUser: null, hasError: false, isLoading: false };

        default: return state;
    }
}

export default function CurrentUserProvider({ children }) {
    const [state, dispatch] = useReducer(reducer, {
        currentUser: null,
        isLoading: false,
        hasError: false,
    });

    return (
        <CurrentUserContext.Provider value={{ state, dispatch }}>
            { children }
        </CurrentUserContext.Provider>
    );
}

