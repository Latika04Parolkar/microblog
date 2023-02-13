const mongoose = require("mongoose")
const bcrypt = require("bcrypt")

const usersSchema = new mongoose.Schema({
    fullName : {
        type : String
    },
    email : {
        type : String
    },
    password : {
        type : String
    },
    profilePicture : {
        type : String
    },
    DOB : {
        type : Date
    },
    userName : String,
    followers : [String],
    following : [String]
},{
    timestamps : true
})

usersSchema.pre('save', async function (next) {
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})

usersSchema.index({ userName : 1})

const User = mongoose.model("users", usersSchema);

module.exports = User