const express = require("express");
const env = require("dotenv");
env.config();
require("./config/db");

const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUI = require("swagger-ui-express");

const signup = require("./routes/signup");
const login = require("./routes/login")
const addpost = require("./routes/createPost");
const globalFeed = require("./routes/globalFeed");
const addFollowInfo = require("./routes/addFollowInfo");
const showFollowInfo = require("./routes/showFollowInfo");
const likes = require("./routes/likes");

const app = express();

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title : "Micrblog API",
            version : "1.0.0",
            description : "APIs for managing user & post",
            contact : {
                name : "Latika Parolkar",
                email : "latikaparolkar04@gmail.com"
            },
            servers : ["http://localhost:4000"]
        },
        components:{
            securitySchemes:{
                BearerAuthentication: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT"
                }
            }
        }
    },
    apis: ["./routes/*.js"]
}

const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));


const PORT = process.env.PORT;


/**
 * @swagger
 * definitions:
 *  User:
 *   type : object
 *   properties:
 *    fullName:
 *     type: string
 *     description : name of the user
 *     example : "Devaki Sinha"
 *    email:
 *     type: string
 *     description : email of the user
 *     example : "devaki13@gmail.com"
 *    password:
 *     type: string
 *     description : password of the user
 *     example : "Devaki@134"
 *    profilePicture:
 *     type: string
 *     description : url of the avatar of user
 *     example : "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/655.jpg"
 *    DOB:
 *     type: date
 *     description : DOB of the user
 *     example : "2001-10-04"
 *    userName:
 *     type: string
 *     description : userName of the user
 *     example : "Devaki@134"
 *    followers:
 *     type: array
 *     description : password of the user
 *     example : ["Devaki.134"]
 *    following:
 *     type: array
 *     description : password of the user
 *     example : [Devaki@134]
 *  Post:
 *   type : object
 *   properties:
 *    user:
 *     type: objectId
 *     description : _id of the user
 *     example : "63ea24c17bf6e9ddb9bdc57"
 *    postContent:
 *     type: string
 *     description : content of the post
 *     example : "If you’re struggling to come up with new and fresh social media content ideas, don’t panic — there are a number of ways you can refresh your posts.In this blog post, we’re sharing 25 social media content ideas to help level up your strategy."
 *    imageUrl:
 *     type: string
 *     description : image url in the post
 *     example : "https://loremflickr.com/640/480"
 *    likes:
 *     type: [string]
 *     description : who liked the post 
 *     example : ["Devaki@134"]
 */

app.use(express.json());
app.use(signup);
app.use(login);
app.use(addpost);
app.use(globalFeed);
app.use(addFollowInfo);
app.use(showFollowInfo);
app.use(likes);

app.listen(PORT, () => {
    console.log(`App running on port ${PORT}`);
});