import express from "express";
import * as InformationController from "../controllers/information.js";
import * as TranslationController from "../controllers/translation.js";

const router = express.Router();

// Languages Information
router.get("/information/all", InformationController.getAll);

router.get("/information/:key", InformationController.get);
router.post("/information/add", InformationController.add);
router.put("/information/:key/update", InformationController.update);
router.delete("/information/:key/delete", InformationController.deleteOne);

// Languages Translations
router.get("/translation/all", TranslationController.getAllTranslations);

router.get("/translation/:key/all", TranslationController.getAll);
router.get("/translation/:key/latest", TranslationController.getLatest);
router.get(
  "/translation/:key/version/:version",
  TranslationController.getByVersion
);
router.post("/translation/:key/add", TranslationController.addNewVersion);
router.delete(
  "/translation/:key/version/:version",
  TranslationController.deleteByVersion
);

export default router;
