
var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var ThreadSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    },
    user: {
        type: String,
        required: true
    },
    replies: {
        type: Number,
        required: true
    },
    latest: {
        type: String,
        required: true
    },
    note: {
        type: Schema.Types.ObjectId,
        ref: "Note"
    }
});

var Thread = mongoose.model("Thread", ThreadSchema);

module.exports = Thread;

