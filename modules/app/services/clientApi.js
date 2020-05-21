import { ClientApi } from 'modules/sdk';

export default new ClientApi(process.env.NEXT_PUBLIC_API_CLIENT_ID, {
    rootUrl: process.env.NEXT_PUBLIC_API_ROOT_URL,
    clientSecret: process.env.NEXT_PUBLIC_API_CLIENT_NOT_SO_SECRET,
});
