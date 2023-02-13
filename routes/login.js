const express = require("express");
const env = require("dotenv")
env.config()
const { compareSync } = require("bcrypt");
const jwt = require("jsonwebtoken")
const router = new express.Router();

const User = require("../models/user");
const app = express();

app.use(router);

const generateAuthToken = (id, userEmail) => {
    const token = jwt.sign({ id, userEmail }, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });
    return token;
  };

/**
 * @swagger
 * /login:
 *   post:
 *     summary: "Log in a user"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userName:
 *                 type: string
 *                 description: User name of the user.
 *               password:
 *                 type: string
 *                 description: Password of the user.
 *     responses:
 *       200:
 *         description: Login Successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   description: HTTP status code
 *                 status:
 *                   type: string
 *                   description: Status of the request
 *                 message:
 *                   type: string
 *                   description: Login success message
 *                 token:
 *                   type: string
 *                   description: JWT token generated for the user
 *                 userId:
 *                   type: string
 *                   description: ID of the user
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   description: HTTP status code
 *                 status:
 *                   type: string
 *                   description: Status of the request
 *                 message:
 *                   type: string
 *                   description: Error message
 */

router.post('/login', async (req, res) => {
    try {
        if (
            req.body.userName &&
            req.body.password
        ) {
            const { userName , password } = req.body;
            const user = await User.findOne({ userName });
            //no user found
            if(!user){
                throw new Error("User does not exists!")
            }

            //incorrect password
            if(!compareSync(password , user.password)){
                throw new Error("Incorrect Password!")
            }

            const token = generateAuthToken(user._id, user.userName)
            res.status(200).send({
                code: 200,
                status: "success",
                message: `${user.fullName} Login Successful!`,
                token,
                userId : user._id
              });
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