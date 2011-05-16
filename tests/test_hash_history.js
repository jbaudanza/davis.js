module('Hash History Module');

test("binding and triggering the push state event", function () {
  var callbackCount = 0;

  Davis.hash_history.onChange(function (data) {
    callbackCount++
  });

  ok(!callbackCount, "callback shouldn't have been called yet");

  Davis.hash_history.pushState(factory('request'));
  ok(callbackCount, "callback should have been called");
});

test("parsing the hash string out of the document location", function() {
  var result = Davis.hash_history.parseLocationHash("/test.html#/test/path");
  ok(result == '/test/path', "result should be /test/path")

  result = Davis.hash_history.parseLocationHash("/test.html");
  ok(result == undefined, "result should be undefined");
});