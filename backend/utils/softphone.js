const clients = require("restify-clients");
// Creates a JSON client
var client = clients.createJsonClient({
  url: "http://192.168.0.100:5000/api/v1",
  appendPath: true,
  headers: {
    apiKey: "5pBMLkO3uYwnLcQD4yqBPS",
  },
});

module.exports = function (to, message, cb) {
  client.post(
    "sms",
    {
      to,
      message,
    },
    function (err, req, res, obj) {
      cb(obj);
    }
  );
};
// "http://192.168.0.100:5000/api/v1"
"http://softphone.koodeyo.com/api/v1"