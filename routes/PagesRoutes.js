import { Router } from "express";
import { about, home, viewImages } from "../controllers/PagesController.js";
import { isAuthenticated } from "../controllers/AuthenticationController.js";
import multer from "multer";

const storage = multer.diskStorage({
  destination: function (_, __, cb) {
    cb(null, 'public/uploads/');
  },
  filename: function (_, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });
const router = Router();
console.log("Router");
router.get("/",isAuthenticated, home);
router.get("/about", about);
router.get("/view", viewImages);


router.post('/upload', upload.single('myImage'), (req, res) => {
    console.log(req.file);
    return res.redirect("/view")
});

export default router;
