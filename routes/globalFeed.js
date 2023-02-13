const express = require("express");
const router = new express.Router();

const Post = require("../models/post");
const app = express();

app.use(router);

/**
 * @swagger
 *  /globalFeed:
 *   get:
 *    summary: "Get the global feed of posts"
 *    parameters:
 *     - name: page
 *       in: query
 *       type: integer
 *       default: 1
 *       description: Page number for the feed
 *     - name: limit
 *       in: query
 *       type: integer
 *       default: 10
 *       description: Number of posts per page
 *    responses:
 *     200:
 *      description: Successful response
 *      schema:
 *       type: object
 *       properties:
 *        code:
 *         type: integer
 *         example: 200
 *        status:
 *         type: string
 *         example: "Success"
 *        message:
 *         type: string
 *         example: "Posts displaying successfully!"
 *        posts:
 *         type: array
 *         items:
 *          type: object
 *          properties : ....
 *     400:
 *      description: Bad Request
 *      schema:
 *       type: object
 *       properties:
 *        code:
 *         type: integer
 *         example: 400
 *        status:
 *         type: string
 *         example: "Failed"
 *        message:
 *         type: string
 *         example: "Error message"
 */

router.get("/globalFeed", async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    try {
        const posts = await Post.find()
        .sort({
            created_at: 1,
            likes: -1,
        })
        .limit(limit * 1)
        .skip((page - 1) * limit);

        res.status(200).send({
            code: 200,
            status: "Success",
            message: "Posts displaying successfully!",
            posts
        })
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