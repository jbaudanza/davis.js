Davis.hash_history = (function() {
  var callbacks = {
    push: [], pop: []
  };

  var hasBeenInitialized = false;

  var initialize = function() {
    if("onhashchange" in window) {
      $(window).bind('hashchange', checkForLocationChange);
    } else {
      setTimeout(locationPoller, pollerInterval);
    }
    hasBeenInitialized = true;
  };

  var addCallback = function(type, handler) {
    if(!hasBeenInitialized)
      initialize();

    callbacks[type].push(handler);
  };

  var invokeCallback = function(type, request) {
    Davis.utils.forEach(callbacks[type], function (callback) {
      callback(request);
    });
  };

  var onPushState = function (handler) {
    addCallback('push', handler);
  };

  var onPopState = function (handler) {
    addCallback('pop', handler);
  };

  var onChange = function(handler) {
    onPushState(handler);
    onPopState(handler);
  };

  var parseLocationHash = function(string) {
    if(string == undefined)
      string = window.location.toString();

    var match = string.match(/#!(.*)$/);
    if(match)
      return match[1];
  };

  var onHashChange = function() {
    var path = parseLocationHash();

    if(path) {
      invokeCallback('pop', new Davis.Request({
          fullPath: path,
          method: "get"
        })
      );
    }
  };

  // On browsers that don't support the onhashchange event, we poll
  // window.location to detect a change
  var pollerInterval = 500;
  getLocation = function() {
    return window.location.toString();
  };
  var lastPolledLocation = getLocation();
  var checkForLocationChange = function() {
    if(lastPolledLocation != getLocation()) {
      lastPolledLocation = getLocation();
      onHashChange();
    }
  };

  var locationPoller = function() {
    checkForLocationChange();
    setTimeout(locationPoller, pollerInterval);
  };

  var pushState = function(request) {
    document.location.href = "#!" + request.location();
    lastPolledLocation = getLocation();
    invokeCallback('push', request);
  };

  return {
    replaceState: function() {}, // Not supported
    pushState: pushState,
    onChange: onChange,
    parseLocationHash: parseLocationHash
  };
})();