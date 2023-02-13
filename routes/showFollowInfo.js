const express = require("express");
const router = new express.Router();
const User = require("../models/user");
const userCheck = require("../controller/userCheck");
const app = express();

app.use(router);

/**
 * @swagger
 * /showfollowinfo/{id}:
 *   get:
 *     summary: Get the follow information for a specific user
 *     description: Get the number of followers and following for a specific user
 *     tags:
 *       - Follow Information
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The id of the user for whom the follow information is being retrieved
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 200
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: showing follow info of user
 *                 followersCount:
 *                   type: integer
 *                   description: The number of followers for the user
 *                 followers:
 *                   type: array
 *                   items:
 *                     type: string
 *                     description: The usernames of the followers for the user
 *                 followingCount:
 *                   type: integer
 *                   description: The number of people the user is following
 *                 following:
 *                   type: array
 *                   items:
 *                     type: string
 *                     description: The usernames of the people the user is following
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 400
 *                 status:
 *                   type: string
 *                   example: failed
 *                 message:
 *                   type: string
 *                   example: Enter id!
 */

router.get("/showfollowinfo/:id", userCheck, async (req, res) => {
  try {
    if (req.params.id) {
      const _id = req.params.id;
      const user = await User.findById({ _id });
      if (user) {
        const followersCount = user.followers.length;
        const followingCount = user.following.length;
        res.status(200).send({
          code: 200,
          status: "success",
          message: "showing follow info of user",
          followersCount,
          followers: user.followers,
          followingCount,
          following: user.following,
        });
      } else throw new Error("User does not exists!");
    } else throw new Error("Enter id!");
  } catch (error) {
    console.log(error);
    res.status(400).send({
      code: "400",
      status: "failed",
      message: error.message,
    });
  }
});

module.exports = router;