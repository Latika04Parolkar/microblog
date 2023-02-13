const express = require("express");
const router = new express.Router();
const userCheck = require("../controller/userCheck");

const Post = require("../models/post");
const app = express();

app.use(router);

/**
 * @swagger
 * /addPost:
 *   post:
 *     tags:
 *       - Post
 *     summary: Add a new post to the blog
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - postContent
 *             properties:
 *               userId:
 *                 type: string
 *                 description: ID of the user who is adding the post
 *               postContent:
 *                 type: string
 *                 description: Content of the post
 *               imageUrl:
 *                 type: string
 *                 description: URL of the image for the post (optional)
 *     responses:
 *       200:
 *         description: Post added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   description: Response code
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *                 postId:
 *                   type: string
 *                   description: ID of the added post
 *       400:
 *         description: Failed to add post
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   description: Response code
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *     security:
 *       - bearerAuth: []
 */

router.post("/addPost", userCheck, async (req, res) => {
    try {
        if (
            req.body.userId &&
            req.body.postContent
        ) {
            const userId = req.body.userId;
            const postContent = req.body.postContent;
            let post;
            if(req.body.imageUrl){
                post = new Post({
                    user : userId,
                    postContent,
                    imageUrl
                })
            }else{
                post = new Post({
                    user : userId,
                    postContent
                })
            }
            await post.save();
            res.status(200).send({
                code: 200,
                status: "Success",
                message: "Post added successfully!",
                postId : post._id
            })
        }else throw new Error("Enter all deatils")
    } catch (error) {
        console.log("error", error);
        res.status(400).send({
            code: 400,
            status: "Failed",
            message: error.message,
        });
    }
})

module.exports = router;