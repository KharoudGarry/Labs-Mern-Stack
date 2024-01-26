export const home = (_, response) =>{
    response.render("pages/home", {
        title: "Home"
    });
};

export const about = (_, response) => {
    response.render("pages/about",{
        title: "About"
    });
}

export const viewImages = (_, response) => {
    response.render("pages/viewImages",{
        title : "View Images"
    });
}