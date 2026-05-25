import { Router } from "express";
import { issuController } from "./issues.controller";
import { authenticate } from "../../middleware/auth";

const router = Router();

router.post('/issues',authenticate, issuController.createIssue);
// router.get('/:id',);
export const issuesRoute = router;