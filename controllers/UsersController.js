import User from "../models/User.js";
import fs from "fs";


async function findAndVerifyUsers(req){
    const user = await User.findById(req.params.id);

    if(!user){
        req.status = 404;
        throw new Error("User does not exist");
    }
    return user;
}

function getStrongParams(req){
    if(req.file){
        req.body.avatar = req.file;
    }

    const {id, firstName, lastName, nickName, email, avatar, password} = req.body;

    return {id , firstName, lastName, nickName, email, avatar, password};
}


export const index = async (_, res, next) => {
    try {
        // Retrieve a list of all users from the database
        const users = await User.find();

        // Render the user list page with the retrieved data
        res.render("users/index", {
            title: "List of Users",
            users,
        });
    } catch (error) {
        next(error);
    }
};

// Function to display a User's profile (admin access only)
export const show = async (req, res, next) => {
    try {
        // Find and verify a user based on the provided request parameters
        const user = await findAndVerifyUsers(req);

        // Render the user's profile page with the retrieved user data
        res.render("cards/show", {
            user,
            title: "User View",
        });
    } catch (error) {
        next(error);
    }
};

export const add = async (req, res, next) => {
    try{
        res.render("users/add",{
            formtype: "create",
            title: "New User"
        })
    } catch(error){
        next(error);
    }
};

export const edit = async (req, res, next) => {
    try{
        const user = await findAndVerifyUsers(req);

        res.render("users/edit",{
            user,
            formtype: "update",
            title: "New User"
        });
    } catch(error){
        next(error);
    }
};

export const create = async (req, res, next) => {
    try{
        const {firstName, lastName, nickName, email, password, avatar} = getStrongParams(req);
        const user  =  new User({firstName, lastName, nickName, email});

        const validationErrors = user.validateSync();

        if(validationErrors){
            if(avatar && fs.existsSync(avatar.path)){
                fs.unlinkSync(avatar.path)
            }
            const message = Object.values(validationErrors.errors).map(error => error.message);
            res.status(400);

            throw new Error(message.json("/n"));
        }

        if(avatar && fs.existsSync(avatar.path)){
            fs.copyFileSync(avatar.path, `avatars/${avatar.filename}`);
            fs.unlinkSync(avatar.path);
            user.avatar = avatar.filename;
        }

        await User.register(user, password);

        res.redirect("/users")

    } catch(error){
        next(error);
    }
};

export const update = async (req, res, next) => {
    try{
        const {firstName, lastName, nickName, email, password, avatar} = getStrongParams(req);

        const user = await findAndVerifyUsers(req);
        
        user.firstName = firstName;
        user.lastName = lastName;
        user.nickName = nickName;
        user.email = email;

        const validationErrors = user.validateSync();

        if(validationErrors){
            if(avatar && fs.existsSync(avatar.path)){
                fs.unlinkSync(avatar.path)
            }
            const message = Object.values(validationErrors.errors).map(error => error.message);
            res.status(400);

            throw new Error(message.json("/n"));
        }

        if(avatar && fs.existsSync(avatar.path)){
            fs.copyFileSync(avatar.path, `avatars/${avatar.filename}`);
            fs.unlinkSync(avatar.path);
            fs.unlinkSync(`avatars/${user.avatar}`);

            user.avatar = avatar.filename;
        }

        if(password){
            await user.setPassword(password);
        }

        user.save();

        res.redirect("/users")
    } catch(error){
        next(error);
    }
};

export const remove = async (req, res, next) => {
    try{
        const user = await findAndVerifyUsers(req);

        const filepath = `avatars/${user.avatar}`;

        if(fs.existsSync(filepath)){
            fs.unlinkSync(filepath);
        }

        await User.findByIdAndDelete(req.params.id);
    } catch(error){
        next(error);
    }
};