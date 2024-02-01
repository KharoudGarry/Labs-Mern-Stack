import PageRoutes from "../routes/PagesRoutes.js";
import CardRoutes from "../routes/CardRoutes.js";


export default (app) => {
    // Register your routes
app.use("/", PageRoutes);
app.use("/cards", CardRoutes);

}