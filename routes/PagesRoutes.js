import { Router } from "express";
import { about, home, viewImages } from "../controllers/PagesController.js";
import multer from "multer";

const storage = multer.diskStorage({
  destination: function (_, __, cb) {
    cb(null, 'uploads/');
  },
  filename: function (_, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });
const router = Router();

router.get("/", home);
router.get("/about", about);
router.get("/view", viewImages);


router.post('/upload', upload.single('myImage'), (req, res) => {
    console.log(req.file);
    res.send('Image uploaded!');
});

export default router;
