const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PhotoSchema = new Schema({
  title: String,
  photo_id: String,
  description: String,
  url: String,
  category: String
})

const DominionServiceSchema = new Schema({
  title: String,
  service_id: String,
  price: String,
  description: String,
  picture_url: String,
  category: String,
  order: Number
});


exports.DominionPhoto = mongoose.model("dominionPhoto", PhotoSchema);
exports.DominionService = mongoose.model("dominionService", DominionServiceSchema);