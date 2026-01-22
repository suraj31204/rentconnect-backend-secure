const bcrypt = require("bcryptjs");

const password = "Suraj@932167";

bcrypt.hash(password, 12).then(hash => {
  console.log("Generated Hash:");
  console.log(hash);
});
