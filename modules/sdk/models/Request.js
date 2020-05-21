import linkHeaderParser from 'linkheader-parser/dist/linkheader-parser-node';

import ajax from '../services/ajax';

import Pagination from './Pagination';

function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function serialized(jsObject) {
  return Object
    .keys(jsObject)
    .map((param) => `${param}=${encodeURIComponent(jsObject[param])}`)
    .join('&');
}

function isStatusOk(statusCode) {
  return statusCode >= 200 && statusCode <= 299;
}

function isPartialResponse(statusCode) {
  return statusCode === 206;
}

export function parseContentRangeResponseHeader(headers = {}) {
  let start = 0;
  let end = 0;
  let totalElements = 0;

  const header = headers['content-range'] || '';

  if (!header) {
    return {
      start,
      end,
      totalElements,
    };
  }

  // header is a string with this format: "items 0-5/8"
  const headerData = header.split(' ')[1].split('/');
  const paginationData = headerData[0].split('-');

  start = +paginationData[0];
  end = +paginationData[1];
  totalElements = +headerData[1];

  return {
    start,
    end,
    totalElements,
  };
}

function getPaginationFromHeaders(headers, request) {
  const headerRange = parseContentRangeResponseHeader(headers);
  const elementsByPage = (headerRange.end + 1) - headerRange.start;

  return new Pagination(headerRange.start, elementsByPage, headerRange.totalElements, request);
}

function getParsedResponseHeaders(stringifiedResponseHeaders) {
  const headerSeparator = ': ';

  return stringifiedResponseHeaders.split('\n').reduce((headers, stringHeader) => {
    const headerSegment = stringHeader.split(headerSeparator);

    if (headerSegment.length < 2) {
      return headers;
    }

    return {
      ...headers,
      [headerSegment[0].toLowerCase()]: headerSegment[1],
    };
  }, {});
}

class Request {
  constructor(url, method = 'GET', language = 'en') {
    this.url = url;
    this.method = '';
    this.setMethod(method);
    this.body = {};
    this.queryParams = {};
    this.routeParams = {};
    this.uploadOptions = {};
    this.requestInterceptors = [];
    this.responseInterceptors = [];
    this.currentXhr = null;
    this.headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Accept-Language': language,
      'X-Requested-With': 'XMLHttpRequest',
    };
  }

  setMethod(method) {
    this.method = method.toUpperCase();
    return this;
  }
  
  setBodyParam(paramName, paramValue) {
    this.body[paramName] = paramValue;
    return this;
  }

  setBodyParams(body) {
    Object.assign(this.body, body);
    return this;
  }

  setRawBody(body) {
    this.body = body;
    return this;
  }

  getSerializedBody() {
    return this.body instanceof window.FormData ? this.body : JSON.stringify(this.body);
  }

  setQueryParam(paramName, paramValue) {
    this.queryParams[paramName] = paramValue;
    return this;
  }

  setQueryParams(queryParams) {
    Object.assign(this.queryParams, queryParams);
    return this;
  }

  setUploadOption(optionName, optionValue) {
    this.uploadOptions[optionName] = optionValue;
    return this;
  }

  setUploadOptions(uploadOptions) {
    Object.assign(this.uploadOptions, uploadOptions);
    return this;
  }

  getSerializedQueryParams() {
    return serialized(this.queryParams);
  }

  setHeader(headerName, headerValue) {
    if (headerValue === undefined) {
      delete this.headers[headerName];
    } else {
      this.headers[headerName] = headerValue;
    }

    return this;
  }

  setHeaders(headers) {
    Object.assign(this.headers, headers);
    return this;
  }

  setRouteParam(paramName, paramValue) {
    this.routeParams[paramName] = paramValue;
    return this;
  }

  setRouteParams(routeParams) {
    Object.assign(this.routeParams, routeParams);
    return this;
  }

  paginate(start, end) {
    if (start === undefined || !end) {
      return this;
    }

    return this.setHeader('Range', `items=${start || 0}-${end}`);
  }

  addRequestInterceptor(interceptor) {
    this.requestInterceptors.push(interceptor);
    return this;
  }

  addResponseInterceptor(interceptor) {
    this.responseInterceptors.push(interceptor);
    return this;
  }

  getUrl() {
    let url = this.url.replace(/\/:([a-zA-Z0-9_]+)/gi, ($0, $1) => (
      this.routeParams[$1] ? `/${this.routeParams[$1]}` : ''
    ));

    const queryParams = this.getSerializedQueryParams();

    if (queryParams) {
      url += `?${queryParams}`;
    }

    return url;
  }

  abort() {
    if (!this.currentXhr) {
      return false;
    }

    this.currentXhr.abort();
    this.currentXhr = null;

    return true;
  }

  execute() {
    return new Promise((resolve, reject) => {
      const requestOptions = {
        url: this.getUrl(),
        method: this.method,
        headers: this.headers,
        body: this.getSerializedBody(),
      };

      const finalRequestDataPromise = this.applyRequestInterceptors({
        requestOptions,
        requestResponse: null,
      });

      finalRequestDataPromise.then((finalRequestData) => {
        if (finalRequestData.requestResponse) {
          this.resolve(finalRequestData.requestResponse, resolve, reject);
          return;
        }

        const stringifiedOptions = JSON.stringify(finalRequestData.requestOptions);
        const queuedRequest = { request: this, resolve, reject };

        if (Request.queuedRequests[stringifiedOptions]) {
          this.currentXhr = Request.queuedRequests[stringifiedOptions][0].request.currentXhr;
          Request.queuedRequests[stringifiedOptions].push(queuedRequest);
          return;
        }

        Request.queuedRequests[stringifiedOptions] = [queuedRequest];
        this.currentXhr = ajax(
          finalRequestData.requestOptions,
          (statusCode, response = '{}', xhr) => {
            const responseHeaders = getParsedResponseHeaders(xhr.getAllResponseHeaders());

            let body;

            try {
              body = JSON.parse(response);
            } catch (e) {
              body = response;
            }

            const finalResponse = { body, statusCode, responseHeaders };

            Request.resolveAllRequests(stringifiedOptions, finalResponse);
            this.currentXhr = null;
          },
          this.uploadOptions,
        );
      })
        .catch((error) => this.resolve(error, resolve, reject));
    });
  }

  resolve(response, resolve, reject) {
    if (isStatusOk(response.statusCode)) {
      const finalResponse = { ...response };

      if (isPartialResponse(response.statusCode)) {
        finalResponse.pagination = getPaginationFromHeaders(response.responseHeaders, this);
      }

      if (response.responseHeaders.link) {
        finalResponse.links = linkHeaderParser.parse(response.responseHeaders.link.trim());
      }

      this.applyResponseInterceptors(finalResponse).then(resolve);
    } else {
      reject(response);
    }
  }

  applyRequestInterceptors(requestData) {
    return this.requestInterceptors.reduce((promiseRequestData, interceptor) => (
      promiseRequestData
        .then((responsePromise) => interceptor(responsePromise) || responsePromise)
    ), Promise.resolve(requestData));
  }

  applyResponseInterceptors(response) {
    return this.responseInterceptors.reduce((promiseResponse, interceptor) => (
      promiseResponse
        .then((responsePromise) => interceptor(deepClone(responsePromise)) || responsePromise)
    ), Promise.resolve(response));
  }
}

Request.queuedRequests = {};
Request.resolveAllRequests = (stringifiedOptions, response) => {
  const allQueuedRequests = Request.queuedRequests[stringifiedOptions] || [];

  allQueuedRequests.forEach((queuedRequest) => {
    const { request, resolve, reject } = queuedRequest;
    request.resolve(response, resolve, reject);
  });

  delete Request.queuedRequests[stringifiedOptions];
};

export default Request;
