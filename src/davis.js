Davis = function (routes) {
  var app = new Davis.App ();
  routes.call(Davis.Router, app);
  return app
};