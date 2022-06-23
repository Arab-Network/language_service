import { Router } from "express";
import * as TranslationController from "../controllers/translation.js";

const router = Router();

// TODO: Strict access by user roles (Admin, Contributor etc.)
router.get("/all", TranslationController.getAllTranslations);

router.get("/:language_key/all", TranslationController.getAllByLanguageKey);
router.get(
  "/:language_key/latest_full_translation",
  TranslationController.getApprovedTranslationsByLanguageKey
);
router.get("/:language_key/part_version", TranslationController.getByVersion);

router.post("/:language_key/add", TranslationController.addNewTranslation);
router.post(
  "/generate_new/:from/to/:to",
  TranslationController.generateNewVersion
);

router.put("/:language_key/update_status", TranslationController.updateStatus);

router.delete("/delete/:language_key/", TranslationController.deleteByVersion);

export default router;
