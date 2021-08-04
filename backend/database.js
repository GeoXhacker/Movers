
// Dependencies
const mongoose = require('mongoose');

const database = {};
database.isConnectedToDb = false;

database.isConnected = function isConnected() {
  return database.isConnectedToDb;
};

mongoose.connection.on('error', (err) => {
  console.error(`Got error event ${err}`);
});

mongoose.connection.on('disconnected', () => {
  console.error('Got disconnected event from database');
  database.isConnectedToDb = false;
});

mongoose.connection.on('reconnected', () => {
  console.log('Got reconnected event from database');
  database.isConnectedToDb = true;
});

database.connect = function connect() {
  mongoose.set('debug', process.env.NODE_ENV !=='production')
  mongoose
    .connect(process.env.MONGO_DB || 'mongodb://localhost/movers', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      connectTimeoutMS: 3000,
      useFindAndModify: false,
    })
    .then(() => {
      console.log('Successfully connected to system database');
      database.isConnectedToDb = true;
    })
    .catch((err) => {
      console.error(`An error occurred while trying to connect to the system database, retrying in ${config.database.connectRetry}s. Err: ${err}`);
      setTimeout(database.connect, 5 * 1000);
    });
};

database.disconnect = function disconnect() {
  if (database.isConnected()) {
    mongoose
      .disconnect()
      .then(() => {
        database.isConnectedToDb = false;
      })
      .catch((err) => {
        console.error(`An error occurred while trying to disconnect from the system database. Err: ${err}`);
      });
  }
};

module.exports = database;
