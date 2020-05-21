import { useEffect, useContext, useCallback } from 'react';

import { clientApi } from 'modules/app';

import CurrentUserContext from '../contexts/CurrentUser';

export default function useCurrentUser(forceRefetch = false) {
    const { state, dispatch } = useContext(CurrentUserContext);

    const fetchCurrentUser = useCallback(async () => {
        if (state.currentUser?.id && !forceRefetch) {
            return;
        }

        try {
            dispatch({ type: 'request' });
            const { body } = await clientApi.get('/me');
            dispatch({ type: 'request-success', payload: body });
        } catch (e) {
            dispatch({ type: 'request-failure', payload: null });
        }
    }, [forceRefetch]);

    useEffect(() => {
        fetchCurrentUser();
    }, [fetchCurrentUser]);

    return state;
}