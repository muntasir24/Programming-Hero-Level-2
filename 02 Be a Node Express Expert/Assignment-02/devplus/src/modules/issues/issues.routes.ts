import { Router } from "express";
import { authenticate } from "../../middleware/auth";
import { issuController } from "./issues.controller";
import { requireMaintainer } from "../../middleware/requireRole";

const router = Router();

router.post("/issues", authenticate, issuController.createIssue);
router.get("/issues/:id", issuController.getSingleIssue); //public
router.patch('/issues/:id',  authenticate,issuController.updateIssue );    // both roles
router.delete("/issues/:id", authenticate, requireMaintainer,issuController.deleteIssue);
router.get("/issues",issuController.getAllIssues); 
export const issuesRoute = router;
