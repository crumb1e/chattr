const mongoose = require('mongoose')
const Schema = mongoose.Schema

const User = mongoose.model(
    'User',
    new Schema({
        username: { type: String, required: true },
        password: { type: String, required: true },
        posts: [{ type: Schema.Types.ObjectId, ref: 'Post' }]
    })
)

module.exports = User