import fs from "fs";
import path from "path";

export const home = (_, response) =>{
    response.render("pages/home", {
        title: "Home"
    });
};

export const about = (_, response) => {
    console.log("about");
    response.render("pages/about",{
        title: "About"
    });
}

export const viewImages = (_, response) => {
    const uploadsDir = path.join(__dirname, 'uploads'); // Assuming uploads directory is in the root of your project
    fs.readdir(uploadsDir, (err, files) => {
        if (err) {
            console.error('Error reading directory:', err);
            response.status(500).send('Error reading directory');
            return;
        }

        const imageFiles = files.filter(file => {
            const ext = path.extname(file).toLowerCase();
            return ext === '.png' || ext === '.jpg' || ext === '.jpeg' || ext === '.gif';
        });

        response.render("pages/viewImages", {
            title: "View Images",
            images: imageFiles
        });
    });
}