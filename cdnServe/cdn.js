async function monitoringStart(config) {
  const monitoring = {
    onError: async function (event) {

      const error = {};
      if (event instanceof ProgressEvent && event.target instanceof XMLHttpRequest) {
        error.error = {
          message: "XMLHttpRequest error",
          filename: window.location.href
        }
      } else if (event.type === 'error') {
        if (event instanceof ErrorEvent) {
          error.error = {
            colno: event.colno,
            filename: event.filename,
            lineno: event.lineno,
            message: event.message,
          };
        } else {
          error.error = {
            tagName: event?.srcElement?.tagName || event.target.tagName,
            currentSrc: event.target.currentSrc || event.target.src || event.target.href,
            message: 'resource not found'
          };
        }
      } else if (event.type === 'unhandledrejection') {
        try {
          if (event.promise instanceof Promise) {
            await event.promise;
          }
        } catch (err) {
          if (err?.stack) {
            error.error = {
              message: err.stack,
            }
          } else {
            error.error = {
              message: err.toString()
            }
          }
        }
      }

      error.navigator = {
        origin: window.location.origin,
        url: window.location.href,
        cookieEnabled: window.navigator.cookieEnabled,
        deviceMemory: window.navigator.deviceMemory,
        hardwareConcurrency: window.navigator.hardwareConcurrency,
        language: window.navigator.language,
        languages: window.navigator.languages,
        onLine: window.navigator.onLine,
        userAgent: window.navigator.userAgent,
        vendor: window.navigator.vendor,
        platform: window.navigator.platform,
        plugins: window.navigator.plugins,
        oscpu: window.navigator.oscpu,
        appName: window.navigator.appName,
        appVersion: window.navigator.appVersion,
        appCodeName: window.navigator.appCodeName,
      };
      monitoring.post(`http://localhost:3000/collect/${config.appID}`, error);
    },
    onPerformance: function (event) {
      setTimeout(() => {
        var resources = performance.getEntriesByType("resource");
        var total = 0;
        var items = [];
        for (let size of resources) {
          items.push({
            initiatorType: size.initiatorType,
            name: size.name.split("/").pop(),
            size: size.transferSize,
            url: size.name
          });
          total += size.transferSize;
        }
        const logs = {
          performanceJSON: window.performance,
          fileSize: {
            totalLoadTime: total,
            files: items,
            totalRequest: items.length
          },
          navigator: {
            origin: window.location.origin,
          },
        };
        monitoring.post(`http://localhost:3000/collect/p/${config.appID}`,
          logs
        );

      }, 1000);
    },
    post: function (url, logs) {
      const http = new XMLHttpRequest();
      http.open("POST", url, true);
      http.setRequestHeader("Content-type", "application/json;charset=UTF-8");

      http.onreadystatechange = function () {
        if (http.readyState == 4 && http.status == 200) {
          // console.log("Sent");
        }
      };
      http.send(JSON.stringify(logs));
    },
  };

  window.addEventListener("error", monitoring.onError, { capture: true });
  window.addEventListener('unhandledrejection', monitoring.onError, { capture: true });
  window.addEventListener('abort', monitoring.onError, { capture: true });
  window.addEventListener('invalid', monitoring.onError, { capture: true });
  window.addEventListener('securitypolicyviolation', monitoring.onError, { capture: true });
  window.addEventListener('rejectionhandled', monitoring.onError, { capture: true });
  window.addEventListener("load", monitoring.onPerformance, { capture: true });

  (function () {
    var originalSend = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.send = function () {
      this.addEventListener('error', function (event) {
        monitoring.onError(event);
      });

      this.addEventListener('load', function () {
        if (this.status >= 400) {
          monitoring.onError(new ErrorEvent("Http error in Ajax: From", this.responseURL, "got", this.status, " status code"));
        }
      });

      originalSend.apply(this, arguments);
    };
  })();
}
