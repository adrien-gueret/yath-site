export default function ajax(
  requestOptions,
  callback,
  uploadOptions = {},
) {
  const xhr = new window.XMLHttpRequest();

  Object.keys(uploadOptions).forEach((uploadOption) => {
    xhr.upload.addEventListener(uploadOption, uploadOptions[uploadOption]);
  });

  const { body, headers = {}, method, url } = requestOptions;

  xhr.open(method, url, true);

  Object.keys(headers).forEach(
    (headerName) => xhr.setRequestHeader(headerName, headers[headerName]),
  );

  let callbackCalled = false;

  const ajaxCallback = (responseStatus, responseText) => () => {
    if (callbackCalled) {
      return;
    }

    const statusCode = xhr.status === undefined ? responseStatus : xhr.status;
    const response = xhr.status === 0 ? 'Error' : (xhr.response || xhr.responseText || responseText);

    callback(statusCode, response, xhr);

    callbackCalled = true;
  };

  const success = ajaxCallback(200);
  xhr.onload = success;

  xhr.onreadystatechange = () => xhr.readyState === 4 && success();

  xhr.onabort = ajaxCallback(null, 'Abort');
  xhr.onerror = ajaxCallback(null, 'Error');
  xhr.ontimeout = ajaxCallback(null, 'Timeout');

  xhr.send(body);

  return xhr;
}