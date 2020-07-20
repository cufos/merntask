const express = require("express");
const router = express.Router();
const proyectoController = require("../controllers/proyectoController");
const auth = require("../middleware/auth");
const { check } = require("express-validator");

//Crea Proyectos
//api/proyectos
router.post(
  "/",
  auth,
  [check("nombre", "El nombre del proyecto es obligatorio").not().isEmpty()],
  proyectoController.crearProyecto
);

//Obtener los proyectos creados
router.get("/", auth, proyectoController.obtenerProyectos);

//Actualizar los proyectos
router.put(
  "/:id",
  auth,
  [check("Nombre", "El nombre del proyecto es obligatorio").not().isEmpty()],
  proyectoController.actualizarProyecto
);

//eliminar un Proyecto
router.delete("/:id", auth, proyectoController.eliminarProyecto);

module.exports = router;
