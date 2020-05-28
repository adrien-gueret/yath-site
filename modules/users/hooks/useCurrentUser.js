import { useEffect, useContext, useCallback } from 'react';

import { clientApi } from 'modules/app';

import CurrentUserContext from '../contexts/CurrentUser';

export default function useCurrentUser(forceRefetch = false, deps = []) {
    const { state, dispatch } = useContext(CurrentUserContext);

    const fetchCurrentUser = useCallback(async () => {
        if (state.currentUser?.id && !forceRefetch) {
            return;
        }

        try {
            dispatch({ type: 'request' });

            if (!clientApi.accessToken || !clientApi.accessTokenExpiration) {
                await clientApi.requestToken('client_credentials');
            }

            const { body } = await clientApi.get('/me');
            dispatch({ type: 'request-success', payload: body });
        } catch (e) {
            dispatch({ type: 'request-failure', payload: null });
        }
    }, [forceRefetch, ...deps]);

    useEffect(() => {
        fetchCurrentUser();
    }, [fetchCurrentUser]);

    return state;
}