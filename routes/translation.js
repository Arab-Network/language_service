import { Router } from "express";
import * as TranslationController from "../controllers/translation.js";
import oidc from "express-openid-connect";

// TODO: refactor

const { claimCheck } = oidc;

const router = Router();
// claimCheck(({ isAdmin, roles }) => isAdmin || roles.includes('payroll'))
router.get("/all", TranslationController.getAllTranslations);

router.get("/:language_key/all", TranslationController.getAllByKey);
router.get(
  "/:language_key/latest",
  TranslationController.getApprovedTranslation
);
router.get(
  "/:language_key/version/:version",
  TranslationController.getByVersion
);

router.post("/:language_key/add", TranslationController.addNewTranslation);
router.post(
  "/generate_new/:language_key",
  TranslationController.generateNewVersion
);

router.delete(
  "/:language_key/version/:version",
  TranslationController.deleteByVersion
);

export default router;
