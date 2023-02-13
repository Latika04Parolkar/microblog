const express = require("express");
const router = new express.Router();
const userCheck = require("../controller/userCheck");

const User = require("../models/user");
const app = express();

app.use(router);

/**
 * @swagger
 * paths:
 *  /addFollowInfo:
 *   post:
 *    summary: "Add or remove a follow relationship between two users"
 *    parameters:
 *    - in: header
 *      name: authorization
 *      type: string
 *      required: true
 *      description: JWT authentication token
 *    requestBody:
 *      required: true
 *      content:
 *       application/json:
 *        schema:
 *         type: object
 *         properties:
 *          userIdOne:
 *           type: string
 *           example: "5f0b80c12f38a4064d2311c3"
 *           description: ID of the user being followed/unfollowed
 *          userIdTwo:
 *           type: string
 *           example: "5f0b80c12f38a4064d2311c4"
 *           description: ID of the user doing the following/unfollowing
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
 *         example: "user1 started following user2."
 *     400:
 *     description: Bad Request
 *     schema:
 *      type: object
 *      properties:
 *       code:
 *        type: integer
 *        example: 400
 *       status:
 *        type: string
 *        example: "Failed"
 *       message:
 *        type: string
 *        example: "Error message"
 */

router.post("/addFollowInfo", userCheck, async (req, res) => {
    try {
        if (
            req.body.userIdOne &&
            req.body.userIdTwo
        ) {
            const userIdOne = req.body.userIdOne;
            const userIdTwo = req.body.userIdTwo;
            const user1 = await User.findById({ _id: userIdOne })
            const user2 = await User.findById({ _id: userIdTwo })
            if (user1 && user2) {
                const userCheck = user1.followers.includes(user2.userName);
                if (!userCheck) {
                    user1.followers.push(user2.userName);
                    user2.following.push(user1.userName);
                    await user1.save();
                    await user2.save();
                    res.status(200).send({
                        code: 200,
                        status: "success",
                        message: `${user2.fullName} started following ${user1.fullName}.`,
                    });
                } else {
                    const index1 = user1.followers.indexOf(user2.userName);
                    const index2 = user2.following.indexOf(user1.userName);
                    user1.followers.splice(index1, 1);
                    user2.following.splice(index2, 1);
                    await user1.save();
                    await user2.save();
                    res.status(200).send({
                        code: 200,
                        status: "success",
                        message: `${user2.fullName} unfollowed ${user1.fullName}.`,
                    });
                }
            } else throw new Error("Either of the users do not exists")
        }
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