const Seeder = require("../lib/Seeder");
const User = require("../models/User");

module.exports = new Seeder(User).data([
  {
    fullName: "admin",
    email: "admin@admin.com",
    username: "admin",
    password: "123456",
  },
]);

// empty seed
// module.exports = { seed: () => null };
