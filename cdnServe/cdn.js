function monitoringStart(config) {
  const monitoring = {
    onError: function (event) {
      const error = {};
      if (event instanceof ErrorEvent) {
        error.error = {
          colno: event.colno,
          filename: event.filename,
          lineno: event.lineno,
          message: event.message,
        };
      } else {
        error.error = {
          tagName: event.target.tagName,
          currentSrc: event.target.currentSrc,
        };
      }

      error.navigator = {
        origin: window.location.origin,
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
      monitoring.post(`https://errgle.elshadaghazade.com/collect/${config.appID}`, error);
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
        monitoring.post(`https://errgle.elshadaghazade.com/collect/${config.appID}`,
          logs
        );
        console.log(logs);

      }, 1000);
    },
    // get: function (url) {
    //   var xhttp = new XMLHttpRequest();
    //   xhttp.onreadystatechange = function () {
    //     if (this.readyState == 4 && this.status == 200) {
    //       return true;
    //     } else {
    //       return false;
    //     }
    //   };
    //   xhttp.open("GET", url, true);
    //   xhttp.send(null);
    // },
    post: function (url, logs) {
      const http = new XMLHttpRequest();
      http.open("POST", url, true);
      http.setRequestHeader("Content-type", "application/json;charset=UTF-8");

      http.onreadystatechange = function () {
        if (http.readyState == 4 && http.status == 200) {
          console.log("Sent");
        }
      };
      http.send(JSON.stringify(logs));
    },
  };

  window.addEventListener("error", monitoring.onError, { capture: true });
  window.addEventListener("load", monitoring.onPerformance, { capture: true });
}
