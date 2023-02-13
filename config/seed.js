const { faker } = require('@faker-js/faker');
const sample = require("lodash.sample");
const User = require("../models/user");
const Post = require("../models/post");

const seedUsers = async () => {
    try{
        const userCollection = await User.find();
        if(userCollection.length > 1){
            return;
        }
        const quantity = 10;
        const users = [];
        for(let u = 0; u < quantity; u++){
            users.push(
                new User({
                    fullName : faker.name.fullName(),
                    email : faker.internet.email(),
                    password : faker.internet.password(),
                    profilePicture : faker.internet.avatar(),
                    DOB : faker.date.birthdate(),
                    userName : faker.internet.userName()
                })
            )
        }

        await User.remove();
       // await User.insertMany(users);
        users.forEach(user => {
            User.create(user)
        })
        console.log("User colletion has been populated!");
    }catch(error){
        console.log(error);
    }
}

const seedPosts = async () => {
    try{
        const postCollection = await Post.find();
        if(postCollection.length > 1){
            return;
        }

        const quantity = 76;
        let posts = [];
        for(let p = 0; p < quantity; p++){
            const user = await User.find();
            const randomUser = await sample(user);

            if(randomUser){
                posts.push(
                    new Post({
                        user : randomUser._id,
                        postContent : faker.lorem.paragraph,
                        imageUrl : faker.image.imageUrl(640, 480)
                    })
                )
            }
        }
        await Post.remove();
            posts.forEach(post => {
                Post.create(post)
            })
            console.log("Post collection has been Populated!");
    }catch(error){
        console.log(error);
    }
}

module.exports = {
    seedUsers,
    seedPosts
}