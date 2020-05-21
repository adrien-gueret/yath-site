import { getMainDomain } from 'modules/app';
import { getCookies } from 'modules/cookies';

import Request from './Request';

export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'sdk-access-token',
  REFRESH_TOKEN: 'sdk-refresh-token',
  ACCESS_TOKEN_EXPIRATION: 'sdk-access-token-expiration',
  ACCESS_TOKEN_REQUESTED_SCOPE: 'sdk-access-token-requested-scope',
  ACCESS_TOKEN_SCOPE: 'sdk-access-token-scope',
  REDIRECT_URI: 'sdk-redirect-uri',
};

class ClientApi {
  constructor(
    clientId,
    {
      clientSecret = '',
      language = 'en',
      rootUrl,
      version = '1.0',
      tokenPath = '/token',
    } = {},
  ) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.language = language;
    this.version = version;
    this.tokenPath = tokenPath;
    this.rootUrl = rootUrl;
    this.requestInterceptors = [];
    this.responseInterceptors = [];
    this.accessToken = this.getStorageItem(STORAGE_KEYS.ACCESS_TOKEN) || null;
    this.refreshToken = this.getStorageItem(STORAGE_KEYS.REFRESH_TOKEN) || null;
    this.accessTokenExpiration = this.getStorageItem(STORAGE_KEYS.ACCESS_TOKEN_EXPIRATION) || null;
    this.accessTokenScope = this.getStorageItem(STORAGE_KEYS.ACCESS_TOKEN_SCOPE) || null;
    this
      .addRequestInterceptor(this.injectApiVersion.bind(this))
      .addRequestInterceptor(this.checkAccessTokenExpiration.bind(this))
      .addRequestInterceptor(this.checkAuthorizationHeader.bind(this));
  }

  getBasicAuthorization() {
    return btoa(`${this.clientId}:${this.clientSecret}`);
  }

  getBasicAuthorizationHeader() {
    return `Basic ${this.getBasicAuthorization()}`;
  }

  getBearerAuthorizationHeader() {
    return `Bearer ${this.accessToken}`;
  }

  getCompleteUrl(path) {
    if (path.substring(0, 4) === 'http') {
        return path;
    }
    return this.rootUrl + path;
  }

  prependStringWithClientId(string) {
    return `${this.clientId}__${string}`;
  }

  getStorageItem(storageKey) {
    return getCookies().get(this.prependStringWithClientId(storageKey));
  }

  setStorageItem(storageKey, itemValue, expires) {
    return getCookies().set(this.prependStringWithClientId(storageKey), itemValue, {
      expires,
      domain: getMainDomain(),
    });
  }

  removeStorageItem(storageKey) {
    return getCookies().remove(this.prependStringWithClientId(storageKey), {
      domain: getMainDomain(),
    });
  }

  setOauth2Tokens({
    accessToken = null,
    refreshToken = null,
    expiresIn = 0,
    scope = 0,
  } = {}) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    this.accessTokenExpiration = Date.now() + (expiresIn * 1000);
    this.accessTokenScope = scope;

    const expirationDate = new Date(this.accessTokenExpiration);

    if (accessToken) {
      this.setStorageItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken, expirationDate);
    } else {
      this.removeStorageItem(STORAGE_KEYS.ACCESS_TOKEN);
    }

    if (refreshToken) {
      this.setStorageItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken, expirationDate);
    } else {
      this.removeStorageItem(STORAGE_KEYS.REFRESH_TOKEN);
    }

    if (expiresIn) {
      this.setStorageItem(STORAGE_KEYS.ACCESS_TOKEN_EXPIRATION, this.accessTokenExpiration, expirationDate);
    } else {
      this.removeStorageItem(STORAGE_KEYS.ACCESS_TOKEN_EXPIRATION);
    }

    if (scope) {
      this.setStorageItem(STORAGE_KEYS.ACCESS_TOKEN_SCOPE, scope,expirationDate);
    } else {
      this.removeStorageItem(STORAGE_KEYS.ACCESS_TOKEN_SCOPE);
    }

    return this;
  }

  async requestToken(grantType, params = {}) {
    this.setOauth2Tokens();

    const { body: tokenResponse } = await this.post(this.tokenPath, {
      grant_type: grantType,
      ...params,
    })

    this.setOauth2Tokens({
      accessToken: tokenResponse.access_token,
      refreshToken: tokenResponse.refresh_token,
      expiresIn: tokenResponse.expires_in,
    });
  }

  post(path, params = {}, directlyExecute = true) {
    const request = this.createRequest(path, 'POST').setBodyParams(params);
    return directlyExecute ? request.execute() : request;
  }

  get(path, directlyExecute = true) {
    const request = this.createRequest(path, 'GET');
    return directlyExecute ? request.execute() : request;
  }

  find(path, filters = {}, directlyExecute = true) {
    const { start, end, ...requestParams } = filters;

    const request = this.get(path, false)
        .setQueryParams(requestParams)
        .paginate(start, end);

    return directlyExecute ? request.execute() : request;
  }

  patch(path, params = {}, directlyExecute = true) {
    const request = this.createRequest(path, 'PATCH').setBodyParams(params);
    return directlyExecute ? request.execute() : request;
  }

  delete(path, directlyExecute = true) {
    const request = this.createRequest(path, 'DELETE');
    return directlyExecute ? request.execute() : request;
  }

  createRequest(path, method) {
    const request = new Request(this.getCompleteUrl(path), method, this.language);

    this.requestInterceptors.forEach((interceptor) => {
      request.addRequestInterceptor(interceptor);
    });

    this.responseInterceptors.forEach((interceptor) => {
      request.addResponseInterceptor(interceptor);
    });

    return request;
  }

  async checkAccessTokenExpiration(requestData) {
    const finalOptions = { headers: {}, ...requestData.requestOptions };
    const hasTokensData = !!this.accessToken && !!this.accessTokenExpiration;
    const isBasicAuthRequest = !!(finalOptions.headers.Authorization
      && finalOptions.headers.Authorization.indexOf('Basic ') > -1);

    // We check expiration 15mn before real expiration
    const fifteenMinutes = 1000 * 60 * 15;
    const isTokenExpired = Date.now() >= this.accessTokenExpiration - fifteenMinutes;

    if (isBasicAuthRequest || !hasTokensData || !isTokenExpired) {
      return requestData;
    }

    if (this.refreshToken) {
      await this.requestToken('refresh_token', { refresh_token: this.refreshToken });
    } else {
      await this.requestToken('client_credentials');
    }

    return {
      ...requestData,
      requestOptions: {
        ...requestData.requestOptions,
        headers: {
          ...requestData.requestOptions?.headers,
          Authorization: this.getBearerAuthorizationHeader(),
        },
      },
    };
  }

  checkAuthorizationHeader(requestData) {
    const finalOptions = { headers: {}, ...requestData.requestOptions };

    finalOptions.headers.Authorization = this.getAuthorizationHeader(finalOptions.headers);

    if (!finalOptions.headers.Authorization) {
      const error = `[Client API] try to call route ${finalOptions.url} without access token. Do you forget to create an oauth token?`;
      throw new Error(error);
    }

    return { ...requestData, requestOptions: finalOptions };
  }

  injectApiVersion(requestData) {
    const finalOptions = { headers: {}, ...requestData.requestOptions };
    const accept = finalOptions.headers.Accept ? `${finalOptions.headers.Accept};` : '';

    finalOptions.headers.Accept = `${accept}version=${this.version}`;

    return { ...requestData, requestOptions: finalOptions };
  }

  getAuthorizationHeader(headers = {}) {
    if (headers.Authorization) {
      return headers.Authorization;
    }

    return this.accessToken ? this.getBearerAuthorizationHeader() : this.getBasicAuthorizationHeader();
  }

  addRequestInterceptor(interceptor, prependInterceptor = false) {
    const addMethod = prependInterceptor ? 'unshift' : 'push';
    this.requestInterceptors[addMethod](interceptor);
    return this;
  }

  addResponseInterceptor(interceptor) {
    this.responseInterceptors.push(interceptor);
    return this;
  }
}

export default ClientApi;