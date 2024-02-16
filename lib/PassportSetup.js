// Import the necessary modules and dependencies (not shown in the provided code)
import passport from "passport";
import User from "../models/User.js"; // Assuming you import the User model from a separate file
import JwrStrategy from "passport-jwt/lib/strategy.js";
import  ExtractJwt  from "passport-jwt/lib/extract_jwt.js";
import Application from "../models/Application.js";

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.SECRET_KEY
}

// Middleware function to set up Passport for authentication
export default (app) => {
    // Setup Passport local strategy (for username/password authentication)
    passport.use(User.createStrategy()); // Use the User model's createStrategy method

    // Configure Passport to serialize and deserialize user data for session management
    passport.serializeUser(User.serializeUser()); // Serialize user data for session storage
    passport.deserializeUser(User.deserializeUser()); // Deserialize user data from session storage


    passport.use(new JwrStrategy(options, (jwtPayload, done)=>{
        Application.findById(jwtPayload.id, (error, application) => {
            if(error) return done(error, false);
            if(!application) return done(null, false);

            return done(null, application);
        });
    }));

    // Initialize Passport and enable session support
    app.use(passport.initialize());
    app.use(passport.session());
    
    // Custom middleware to set local variables for authentication status and user roles
    app.use((req, res, next) => {
        res.locals.isAuthenticated = req.isAuthenticated(); // Check if the user is authenticated
        res.locals.isAdmin = req.user?.role === "ADMIN"; // Check if the user has the "ADMIN" role
        res.locals.isUser = req.user?.role === "USER"; // Check if the user has the "USER" role
        next();
    });
};