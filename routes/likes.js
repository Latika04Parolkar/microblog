const express = require("express");
const router = new express.Router();
const userCheck = require("../controller/userCheck");

const User = require("../models/user");
const Post = require("../models/post");
const app = express();

app.use(router);

/**
 * @swagger
 * /likes:
 *   post:
 *     tags:
 *       - Likes
 *     summary: Allows a user to like or dislike a post.
 *     description: This endpoint allows a user to like or dislike a post. If the user has not liked the post, it will be liked, and if the user has liked the post, it will be unliked.
 *     parameters:
 *       - in: body
 *         name: body
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             postId:
 *               type: string
 *               description: The ID of the post.
 *             userName:
 *               type: string
 *               description: The username of the user who wants to like or dislike the post.
 *     responses:
 *       200:
 *         description: The like/dislike operation was successful.
 *         schema:
 *           type: object
 *           properties:
 *             code:
 *               type: integer
 *               description: The HTTP status code.
 *             status:
 *               type: string
 *               description: The status of the request.
 *             message:
 *               type: string
 *               description: The message describing the outcome of the operation.
 *             likesCount:
 *               type: integer
 *               description: The number of likes the post has received.
 *       400:
 *         description: The request failed due to a problem with the request body.
 *         schema:
 *           type: object
 *           properties:
 *             code:
 *               type: integer
 *               description: The HTTP status code.
 *             status:
 *               type: string
 *               description: The status of the request.
 *             message:
 *               type: string
 *               description: The message describing the error.
 *     security:
 *       - APIKeyHeader: []
 */

router.post("/likes", userCheck, async(req,res) => {
    try{
        if (req.body.postId && req.body.userName) {
            const userName = req.body.userName;
            const userCheck = await User.exists({ userName });
            if (userCheck) {
              const post = await Post.findById({ _id: req.body.postId });
              let likesCount;
              const likeCheck = post.likes.includes(userName);
              if (!likeCheck) {
                post.likes.push(userName);
                likesCount = post.likes.length;
                await post.save();
                res.send({
                  code: 200,
                  status: "success",
                  message: "User liked the Post!",
                  likesCount,
                });
              } else {
                const index = post.likes.indexOf(userName);
                post.likes.splice(index, 1);
                likesCount = post.likes.length;
                await post.save();
                res.send({
                  code: 200,
                  status: "success",
                  message: "User disliked the Blog!",
                  likesCount,
                });
              }
            } else throw new Error("User doesn't exists!");
          } else throw new Error("Incomplete Information.");
    }catch(error){
        console.log("error", error);
        res.status(400).send({
            code: 400,
            status: "Failed",
            message: error.message,
        });
    }
})

module.exports = router;