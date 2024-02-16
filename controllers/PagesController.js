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
export const contact = (_, response) => {
    response.render("pages/contact",{
        title: "Contact"
    });
}

export const viewImages = (_, response) => {
    fs.readdir("./public/uploads", (err, files) => {
        if (err) {
            console.error('Error reading directory:', err);
            response.status(500).send('Error reading directory');
            return;
        }

        const imageFiles = files.filter(file => {
            const ext = path.extname(file).toLowerCase();
            return ext === '.png' || ext === '.jpg' || ext === '.jpeg' || ext === '.gif';
        });

        // Map image filenames to their corresponding URLs
        const imageUrls = imageFiles.map(file => `/public/uploads/${file}`);

        response.render("pages/viewImages", {
            title: "View Images",
            images: imageUrls
        });
    });
}
