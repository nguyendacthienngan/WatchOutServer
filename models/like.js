const mongoose = require('mongoose');
const Schema = mongoose.Schema
const schemaOptions = {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  };

const Like = new Schema ({
    authorId: { type: Schema.Types.ObjectId, ref: "User" },
    targetId: { type: Schema.Types.ObjectId, ref: "Video" }, //postId or commentId.
}, schemaOptions);

//Some points you need to consider:

// 1.Store likes of posts in post collection
// 2.Store likes of comments in comments collection
// 3.You need to build a mechanism to calculate likes and store in that collection

module.exports.likeSchema = Like
module.exports.Like = mongoose.model('Like', Like)