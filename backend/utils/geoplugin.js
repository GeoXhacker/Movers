const clients = require("restify-clients");
// Creates a JSON client
var client = clients.createJsonClient({
  url: "http://geoplugin.net",
  appendPath: true,
});

module.exports = {
  latLonToPlace(lat, lon) {
    return new Promise((resolve, reject) => {
      client.get(
        `extras/location.gp?lat=${lat}&lon=${lon}&format=json`,
        function (err, req, res, obj) {
          if (err) return reject(err);
          resolve(obj);
        }
      );
    });
  },
};

// let { latLonToPlace } = module.exports;

// Promise.all([latLonToPlace(0.2924404, 32.571751)]).then(console.log);
