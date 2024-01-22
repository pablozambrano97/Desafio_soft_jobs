import { Router } from "express";
import { reportarConsulta, verificarInput, verificarCredenciales} from "../middlewares/middleware.js"
import { softController } from "../controllers/soft_controller.js";

const router = Router();


// POST /usuarios
router.post("/usuarios", reportarConsulta, verificarInput, softController.register);

// POST /login
router.post("/login", reportarConsulta, softController.login);

// GET/users

router.get("/usuarios", reportarConsulta, verificarCredenciales, softController.users)

export default router;