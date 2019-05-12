var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new UserSchema object
// This is similar to a Sequelize model
var NewsSchema = new Schema({
  // `title` is required and of type String
  title: {
    type: String,
    required: true
  },
  // `link` is required and of type String
  link: {
    type: String,
    required: true
  },
  // `comments` is an object that stores a comments id
  // The ref property links the ObjectId to the comments model
  // This allows us to populate the News with an associated comments
  comments: {
    type: Schema.Types.ObjectId,
    ref: "Comments"
  }
});

// This creates our model from the above schema, using mongoose's model method
var News = mongoose.model("News", NewsSchema);

// Export the News model
module.exports = News;
