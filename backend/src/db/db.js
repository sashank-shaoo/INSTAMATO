const mongoose = require("mongoose");


function connectDb() {
    mongoose
      .connect(process.env.MONGODB_URL)
      .then(() => {
        console.log("Data-base connected");
      })
      .catch((err) => {
        console.log(err);
      });
}

module.exports = connectDb;