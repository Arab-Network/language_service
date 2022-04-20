import { Router } from "express";
import * as InformationController from "../controllers/information.js";

const router = Router();

router.get("/all", InformationController.getAll);

router.get("/:key", InformationController.get);
router.post("/add", InformationController.add);
router.put("/:key/update", InformationController.update);
router.delete("/:key/delete", InformationController.deleteOne);

export default router;
