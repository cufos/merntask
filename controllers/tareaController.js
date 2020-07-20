const Tarea = require("../models/Tarea");
const Proyecto = require("../models/Proyecto");
const { validationResult } = require("express-validator");

//Crear una tarea
exports.crearTarea = async (req, res) => {
  //Revisar errores
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }

  //extraer el proyecto
  const { proyecto} = req.body;

  try {
    const existeProyecto = await Proyecto.findById(proyecto);
    if (!existeProyecto) {
      return res.status(404).json({ msg: "Proyecto no encontrado" });
    }

    //Revisar si el proyecto pertenece al usuario autenticado
    if (existeProyecto.creador.toString() !== req.usuario.id) {
      return res.status(401).json({ msg: "No autorizado" });
    }

    //Creamos la tarea
    const tarea = new Tarea(req.body);

    await tarea.save();
    res.json({ tarea });
  } catch (error) {
    console.log(error);
    res.status(500).send("Hubo un error");
  }
};

//obtener tareas 
exports.obtenerTareas = (req,res) =>{
  const { proyecto } = req.query;

  try {
     const existeProyecto = await Proyecto.findById(proyecto);
    if (!existeProyecto) {
      return res.status(404).json({ msg: "Proyecto no encontrado" });
    }

    //Revisar si el proyecto pertenece al usuario autenticado
    if (existeProyecto.creador.toString() !== req.usuario.id) {
      return res.status(401).json({ msg: "No autorizado" });
    }

    //obtener las tareas por proyecto
    const tareas = await Tarea.find([proyecto]).sort({creado: -1})
    res.json({tareas})
  } catch (error) {
    console.log(error);
    res.status(500).send("Hubo un error");
  }
}

exports.actualizarTarea = async (req,res)=>{
  const { proyecto,nombre,estado } = req.body;

  try {
    //revisar si la tarea existe
    let tareaExiste = await Tarea.findById(req.params.id)

    if(!tareaExiste){
      return res.status(404).json({msg:'No existe esa Tarea'})
    }

    //extrayendo el proyecto
     const existeProyecto = await Proyecto.findById(proyecto);
    
      //Revisar si el proyecto pertenece al usuario autenticado
    if (existeProyecto.creador.toString() !== req.usuario.id) {
      return res.status(401).json({ msg: "No autorizado" });
    }

    //crear un objeto con la nueva informacion
    const nuevaTarea = {};

    
      nuevaTarea.nombre = nombre
    

    
      nuevaTarea.estado = estado
    


   //guardar la tarea
   tareaExiste = await Tarea.findOneAndUpdate({_id: req.params.id}, nuevaTarea, {new:true})

   res.json({tareaExiste})
    }



   
   catch (error) {
    console.log(error);
    res.status(500).send("Hubo un error");
  }
}

exports.eliminarTarea = async (req,res) =>{
  const { proyecto} = req.query;

  try {
    //revisar si la tarea existe
    let tareaExiste = await Tarea.findById(req.params.id)

    if(!tareaExiste){
      return res.status(404).json({msg:'No existe esa Tarea'})
    }

    //extrayendo el proyecto
     const existeProyecto = await Proyecto.findById(proyecto);
    
      //Revisar si el proyecto pertenece al usuario autenticado
    if (existeProyecto.creador.toString() !== req.usuario.id) {
      return res.status(401).json({ msg: "No autorizado" });
    }


    //eliminar una tarea
    await Tarea.findOneAndRemove({_id: req.params.id})

    res.json({msg: 'Tarea eliminada'})
  
    }



   
   catch (error) {
    console.log(error);
    res.status(500).send("Hubo un error");
  }
}