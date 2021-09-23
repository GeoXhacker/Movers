const { GetLatLngByAddress } = require("@geocoder-free/google");

GetLatLngByAddress("makerere university").then(console.log);
