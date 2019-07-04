const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Post = mongoose.model(
    'Post',
    new Schema({
        author: { type: Schema.Types.ObjectId, ref: 'User' },
        content: { type: String, required: true },
        likes: [{ type: Schema.Types.ObjectId, ref: 'User' }]
    })
)

module.exports = Post