import { Router } from "express";
import * as TranslationController from "../controllers/translation.js";
import oidc from "express-openid-connect";

// TODO: refactor

const { claimCheck } = oidc;

const router = Router();
// claimCheck(({ isAdmin, roles }) => isAdmin || roles.includes('payroll'))
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

router.delete(
  "/:language_key/version/:version",
  TranslationController.deleteByVersion
);

export default router;
