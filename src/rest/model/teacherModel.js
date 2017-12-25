var mongoose = require('mongoose'); // This is ODM (Object Data Modeller) used to model and access mongodb
var Schema = mongoose.Schema;

// Define "keys" (attribute name : attribute type, ....). Below many option examples
var teacherModel = new Schema({
    teacherId: { type: String, index: true, unique: true }, // Will create an index in mongodb
    name: String,
    lastname: { type: String, trim: true, lowercase: true },
    title: { type: String, trim: true, lowercase: true, enum: ['adjunct', 'instructor', 'assistant', 'associate'] },
    age: { type: Number, required: true, min: 10, max: 1000 },
    isFullTime: { type: Boolean, default: true },
    updatedOn: { type: Date, default: Date.now } // By default will have value like "2017-12-03T11:11:16.152Z"
});

// Create model
module.exports = mongoose.model("Teacher", teacherModel); // This returns a mongoose "model" and a collection called "teachers" (by default collection name is plural of model name, like for model name "Teacher", default collection name will be "teachers") will be created in mongodb