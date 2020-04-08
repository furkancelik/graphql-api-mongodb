const mongoose = require("mongoose");
const mongoose_delete = require("mongoose-delete");
mongoose.plugin(mongoose_delete, { deletedAt: true, overrideMethods: "all" });

module.exports = () => {
  mongoose.connect(process.env.DB_URI, { useNewUrlParser: true });
  mongoose.set("debug", true);
};
