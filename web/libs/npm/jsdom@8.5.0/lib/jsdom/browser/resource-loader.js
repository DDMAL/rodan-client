/* */ 
(function(Buffer, process) {
  "use strict";
  const resolveHref = require('../utils').resolveHref;
  const parseDataUrl = require('../utils').parseDataUrl;
  const parseContentType = require('../living/helpers/headers').parseContentType;
  const decodeString = require('../living/helpers/encoding').decodeString;
  const fs = require('fs');
  const request = require('request');
  const documentBaseURL = require('../living/helpers/document-base-url').documentBaseURL;
  const NODE_TYPE = require('../living/node-type');
  const URL = require('url');
  const IS_BROWSER = Object.prototype.toString.call(process) !== "[object process]";
  function createResourceLoadHandler(element, resourceUrl, document, loadCallback) {
    return (err, data, response) => {
      const ev = document.createEvent("HTMLEvents");
      if (!err) {
        try {
          loadCallback.call(element, data, resourceUrl, response);
          ev.initEvent("load", false, false);
        } catch (e) {
          err = e;
        }
      }
      if (err) {
        ev.initEvent("error", false, false);
        ev.error = err;
        const error = new Error(`Could not load ${element.localName}: "${resourceUrl}"`);
        error.detail = err;
        document._defaultView._virtualConsole.emit("jsdomError", error);
      }
      element.dispatchEvent(ev);
    };
  }
  exports.readFile = function(filePath, options, callback) {
    const readableStream = fs.createReadStream(filePath);
    let data = new Buffer(0);
    readableStream.on("error", callback);
    readableStream.on("data", (chunk) => {
      data = Buffer.concat([data, chunk]);
    });
    const defaultEncoding = options.defaultEncoding;
    const detectMetaCharset = options.detectMetaCharset;
    readableStream.on("end", () => {
      if (defaultEncoding) {
        const decoded = decodeString(data, {
          defaultEncoding,
          detectMetaCharset
        });
        callback(null, decoded.data, {headers: {"content-type": "text/plain;charset=" + decoded.encoding}});
      } else {
        callback(null, data);
      }
    });
    return {abort() {
        readableStream.destroy();
        callback(new Error("request canceled by user"));
      }};
  };
  function readDataUrl(dataUrl, options, callback) {
    try {
      const data = parseDataUrl(dataUrl);
      if (options.defaultEncoding) {
        const contentType = parseContentType(data.type) || parseContentType("text/plain");
        const decoded = decodeString(data.buffer, {
          contentType,
          defaultEncoding: options.defaultEncoding,
          detectMetaCharset: options.detectMetaCharset
        });
        contentType.set("charset", decoded.encoding);
        data.type = contentType.toString();
        callback(null, decoded.data, {headers: {"content-type": data.type}});
      } else {
        callback(null, data.buffer, {headers: {"content-type": data.type}});
      }
    } catch (err) {
      callback(err, null);
    }
    return null;
  }
  function wrapCookieJarForRequest(cookieJar) {
    const jarWrapper = request.jar();
    jarWrapper._jar = cookieJar;
    return jarWrapper;
  }
  function fetch(urlObj, options, callback) {
    if (urlObj.protocol === "data:") {
      return readDataUrl(urlObj.href, options, callback);
    } else if (urlObj.hostname) {
      return exports.download(urlObj, options, callback);
    }
    const filePath = urlObj.pathname.replace(/^file:\/\//, "").replace(/^\/([a-z]):\//i, "$1:/").replace(/%20/g, " ");
    return exports.readFile(filePath, options, callback);
  }
  exports.enqueue = function(element, resourceUrl, callback) {
    const document = element.nodeType === NODE_TYPE.DOCUMENT_NODE ? element : element._ownerDocument;
    if (document._queue) {
      const loadHandler = createResourceLoadHandler(element, resourceUrl || document.URL, document, callback);
      return document._queue.push(loadHandler);
    }
    return function() {};
  };
  exports.resolveResourceUrl = function(document, url) {
    if (url === null) {
      return "";
    }
    const baseUrl = documentBaseURL(document);
    return resolveHref(baseUrl, url);
  };
  exports.download = function(url, options, callback) {
    const requestOptions = {
      pool: options.pool,
      agentOptions: options.agentOptions,
      strictSSL: options.strictSSL,
      gzip: true,
      jar: wrapCookieJarForRequest(options.cookieJar),
      encoding: null,
      headers: {
        "User-Agent": options.userAgent,
        "Accept-Language": "en",
        Accept: options.accept || "*/*"
      }
    };
    if (options.referrer && !IS_BROWSER) {
      requestOptions.headers.referer = options.referrer;
    }
    if (options.proxy) {
      requestOptions.proxy = options.proxy;
    }
    Object.assign(requestOptions.headers, options.headers);
    const defaultEncoding = options.defaultEncoding;
    const detectMetaCharset = options.detectMetaCharset;
    const req = request(url, requestOptions, (error, response, bufferData) => {
      if (!error) {
        if (defaultEncoding) {
          const contentType = parseContentType(response.headers["content-type"]) || parseContentType("text/plain");
          const decoded = decodeString(bufferData, {
            contentType,
            defaultEncoding,
            detectMetaCharset
          });
          contentType.set("charset", decoded.encoding);
          response.headers["content-type"] = contentType.toString();
          callback(null, decoded.data, response);
        } else {
          callback(null, bufferData, response);
        }
      } else {
        callback(error, null, response);
      }
    });
    return {abort() {
        req.abort();
        callback(new Error("request canceled by user"));
      }};
  };
  exports.load = function(element, url, options, callback) {
    const document = element._ownerDocument;
    const documentImpl = document.implementation;
    if (!documentImpl._hasFeature("FetchExternalResources", element.tagName.toLowerCase())) {
      return;
    }
    const resourceUrl = exports.resolveResourceUrl(document, url);
    if (documentImpl._hasFeature("SkipExternalResources", resourceUrl)) {
      return;
    }
    const urlObj = URL.parse(resourceUrl);
    const baseUrl = documentBaseURL(document);
    const enqueued = exports.enqueue(element, resourceUrl, callback);
    const customLoader = document._customResourceLoader;
    const requestManager = document._requestManager;
    const cookieJar = document._cookieJar;
    options.accept = element._accept;
    options.cookieJar = cookieJar;
    options.referrer = baseUrl;
    options.pool = document._pool;
    options.agentOptions = document._agentOptions;
    options.strictSSL = document._strictSSL;
    options.userAgent = document._defaultView.navigator.userAgent;
    let req = null;
    function wrappedEnqueued() {
      if (req && requestManager) {
        requestManager.remove(req);
      }
      if (element._ownerDocument && element._ownerDocument.defaultView.document) {
        enqueued.apply(this, arguments);
      }
    }
    if (typeof customLoader === "function") {
      req = customLoader({
        element,
        url: urlObj,
        cookie: cookieJar.getCookieStringSync(urlObj, {http: true}),
        baseUrl,
        defaultFetch(fetchCallback) {
          return fetch(urlObj, options, fetchCallback);
        }
      }, wrappedEnqueued);
    } else {
      req = fetch(urlObj, options, wrappedEnqueued);
    }
    if (req && requestManager) {
      requestManager.add(req);
    }
  };
})(require('buffer').Buffer, require('process'));
