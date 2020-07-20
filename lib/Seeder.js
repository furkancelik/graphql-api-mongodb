module.exports = function Seeder(db) {
  this.db = db;
  this.data;
  this.data = (data) => {
    this.data = data;
    return this;
  };
  this.seed = async () => {
    return await this.db.create(this.data).save();
  };
  return this;
};
