import { Router } from "express";
import * as TranslationController from "../controllers/translation.js";
import oidc from "express-openid-connect";

// TODO: refactor

const { claimCheck } = oidc;

const router = Router();
// claimCheck(({ isAdmin, roles }) => isAdmin || roles.includes('payroll'))
router.get("/all", TranslationController.getAllTranslations);

router.get("/:key/all", TranslationController.getAllByKey);
router.get("/:key/latest", TranslationController.getApprovedTranslation);
router.get("/:key/version/:version", TranslationController.getByVersion);

router.post("/:key/add", TranslationController.addNewTranslation);
router.post("/generate_new/:key", TranslationController.generateNewVersion);

router.delete("/:key/version/:version", TranslationController.deleteByVersion);

export default router;
