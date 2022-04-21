import { Router } from "express";
import * as TranslationController from "../controllers/translation.js";

const router = Router();

router.get("/all", TranslationController.getAllTranslations);

router.get("/:key/all", TranslationController.getAll);
router.get("/:key/latest", TranslationController.getLatest);
router.get("/:key/version/:version", TranslationController.getByVersion);

router.post("/:key/add", TranslationController.addNewVersion);
router.post("/generate_new/:key", TranslationController.generateNewVersion);

router.delete("/:key/version/:version", TranslationController.deleteByVersion);

export default router;
