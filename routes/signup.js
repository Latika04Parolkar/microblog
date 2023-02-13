const express = require("express");
const validator = require("validator");
const router = new express.Router();

const User = require("../models/user");
const app = express();

app.use(router);

/**
 * @swagger
 * /signup:
 *  post:
 *   summary: "Sign up a new user"
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       properties:
 *        fullName:
 *         type: string
 *         description: Full name of the user.
 *        email:
 *         type: string
 *         format: email
 *         description: Email of the user.
 *        password:
 *         type: string
 *         description: Password of the user.
 *        userName:
 *         type: string
 *         description: User name of the user.
 *        DOB:
 *         type: string
 *         format: date
 *         description: Date of birth of the user.
 *        profilePicture:
 *         type: string
 *         description: Profile picture of the user.
 *   responses:
 *    200:
 *     description: Signup Successful
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         code:
 *          type: integer
 *          description: HTTP status code
 *         status:
 *          type: string
 *          description: Status of the request
 *         message:
 *          type: string
 *          description: Signup success message
 *         userId:
 *          type: string
 *          description: ID of the user
 *    400:
 *     description: Bad Request
 *     content:
 *      application/json:
 *      schema:
 *       type: object
 *       properties:
 *        code:
 *         type: integer
 *         description: HTTP status code
 *        status:
 *         type: string
 *         description: Status of the request
 *        message:
 *         type: string
 *         description: Error message
 */

router.post('/signup', async (req, res) => {
    try {
        if (
            req.body.fullName &&
            validator.isEmail(req.body.email) &&
            validator.isStrongPassword(req.body.password, {
                minLength: 6,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 1,
                returnScore: false,
            }) &&
            req.body.userName &&
            req.body.DOB &&
            req.body.profilePicture
        ) {
            const {fullName,email,password,userName, DOB, profilePicture} = req.body;
            const check = await User.exists({ email });
            if (check) {
                throw new Error("User already exists!");
            } else {
                const user = User({
                    fullName,
                    email,
                    password,
                    DOB,
                    userName,
                    profilePicture
                })
                await user.save();
                res.status(200).send({
                    code: 200,
                    status: "Success",
                    message: "User signed up successfully!",
                    userId : user._id
                })
            }
        }else throw new Error("Enter all details!")
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