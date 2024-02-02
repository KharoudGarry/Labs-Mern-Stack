import passport from "passport";
import User from "../models/User.js";

export default (app) => {
    passport.use(User.createStrategy());
    passport.serializeUser(User.serializeUser());


    app.use(passport.initialize());
    app.use(passport.session());


    app.use((req, res, next) => {
        res.locals.isAdmin = req.user?.role === "ADMIN";
        res.locals.isUser = res.user?.role === "USER";
        next()
    })
};