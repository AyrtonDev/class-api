import { Router } from "express";
import multer from "multer";

import * as ApiController from "../controllers/apiController";

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "./tmp");
  },
  filename(req, file, cb) {
    let randomName = Math.floor(Math.random() * 9999999);
    cb(null, `${file.fieldname}${randomName}.jpg`);
  },
});

const upload = multer({
  storage,
  fileFilter(req, file, cb) {
    const allowed: string[] = ["image/jpg", "image/jpeg", "image/png"];

    cb(null, allowed.includes(file.mimetype));
  },
  limits: {
    fieldSize: 30000000,
  },
});

const router = Router();

router.get("/ping", ApiController.ping);
router.get("/random", ApiController.random);
router.get("/name/:name", ApiController.name);

router.post("/phrase", ApiController.createPhrase);
router.get("/phrases", ApiController.listPhrases);
router.get("/phrase/random", ApiController.randomPhrase);
router.get("/phrase/:id", ApiController.getPhrase);
router.put("/phrase/:id", ApiController.putPhrase);
router.delete("/phrase/:id", ApiController.deletePhrase);

router.post(
  "/upload",
  upload.single("avatar"),
  // .fields([
  //   { name: "avatar", maxCount: 1 },
  //   { name: "gallery", maxCount: 3 },
  // ]),
  ApiController.uploadFile
);

export default router;
