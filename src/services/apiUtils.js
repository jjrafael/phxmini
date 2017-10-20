'use strict';
import httpMethods from 'phxConstants/httpMethods';
import api from 'phxServices/api';
import _ from 'underscore';

export function performHttpCall(xhrObjReference, httpMethod, urlString, bodyContentObj, headers) {
    return new Promise((resolve, reject) => {
        if (xhrObjReference) {
            xhrObjReference.abort();
        }

        function successCallback(response) {
            if(typeof response === 'undefined') {
                response = { success: true }; // for succeeded calls with no content as a response
            }
            resolve(response);
        }

        function errorCallback(xhr, status, error) {
            reject(xhr);
        }

        switch(httpMethod) {
            case httpMethods.HTTP_GET:
                xhrObjReference = api.get(urlString, { successCallback , errorCallback, headers });
            break;

            case httpMethods.HTTP_POST:
                xhrObjReference = api.post(urlString, { body: JSON.stringify(bodyContentObj), successCallback, errorCallback, headers });
            break;

            case httpMethods.HTTP_PUT:
                xhrObjReference = api.put(urlString, { body: JSON.stringify(bodyContentObj), successCallback, errorCallback, headers });
            break;

            case httpMethods.HTTP_DELETE:
                if (bodyContentObj === null) {
                    xhrObjReference = api.delete(urlString, { successCallback, errorCallback, headers });
                } else {
                    xhrObjReference = api.delete(urlString, { body: JSON.stringify(bodyContentObj), successCallback, errorCallback, headers });
                }
            break;
        }
    });
}

export const parseJSON = (str) => {
    let result = null;
    try {
        result = JSON.parse(str);
    } catch (e) {}
    return result;
};

// Note, chain the following on the function consumer
// .then((response) => ({ response }))
// .catch((xhr) => ({ xhr }));

export function parseErrorMessageInXhr( httpMethod, xhr ) {

  // TODO handle different possible response status code per http methods

  function parseGetResponse() {
    const {
      status
    } = xhr;

    switch ( xhr.status ) {
      case 0:
        return "Server Timeout!";

      // case 200: // OK
      // case 302: // FOUND
      // case 304: // NOT FOUND
      // case 401: // UNAUTHORIZED
      // case 404: // NOT FOUND

      case 500: // INTERNAL SERVER ERROR
        return extract500Error();
    }

  }

  function parsePutOrPostResponse() {
    const {
      status
    } = xhr;

    switch ( xhr.status ) {
      case 0:
        return "Server Timeout!";

      // case 200: // OK
      // case 201: // CREATED
      // case 202: // ACCEPTED
      // case 204: // NO CONTENT

      case 400: // BAD REQUEST
        return extract400Error();

        // case 401: // UNAUTHORIZED
        // case 404: // NOT FOUND

      case 500: // INTERNAL SERVER ERROR
        return extract500Error();

        // case 520: // VALIDATION ERROR
    }
  }

  function parseDeleteResponse() {
    const {
      status
    } = xhr;

    switch ( status ) {
      case 0:
        return "Server Timeout!";
        
      case 200: // OK
      case 401: // UNAUTHORIZED
      case 404: // NOT FOUND

      case 500: // INTERNAL SERVER ERROR
        return extract500Error();
    }
  }

  function extract400Error() {
    const {
      response
    } = xhr;

    const respObj = JSON.parse( response );
    let msg = '';

    let messages = _.pluck( respObj.errors, 'message' );
    let messagesWithoutLast = _.initial( messages );
    _.each( messagesWithoutLast, ( message ) => {
      msg += message + ', ';
    } );
    msg += _.last( messages );

    return msg;

  }

  function extract500Error() {
    const {
      response
    } = xhr;
    const result = parseJSON(response);
    if (result) {
      return result.exception.message;
    } else {
      return 'An unexpected error has occured.';
    }
  }

  switch ( httpMethod ) {
    case httpMethods.HTTP_GET:
      return parseGetResponse();
      break;

    case httpMethods.HTTP_POST:
      return parsePutOrPostResponse();
      break;

    case httpMethods.HTTP_PUT:
      return parsePutOrPostResponse();
      break;

    case httpMethods.HTTP_DELETE:
      return parseDeleteResponse();
      break;
  }

}
