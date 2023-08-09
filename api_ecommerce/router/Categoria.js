import routerx from 'express-promise-router'
import categoriacontroller from '../controllers/CategoriaController'
import auth from '../middlewares/auth'
import multiparty from 'connect-multiparty'

//donde se van a guardar las imagenes
var path = multiparty({uploadDir: './uploads/categorie'})

const router = routerx();
router.post("/register",[auth.verifyAdmin,path],categoriacontroller.register);
router.put("/update",[auth.verifyAdmin,path],categoriacontroller.update);
router.get("/list",auth.verifyAdmin,categoriacontroller.list);
router.delete("/delete",auth.verifyAdmin,categoriacontroller.remove);

//para poder visualizar la imagen
router.get("/uploads/categorie/:img",categoriacontroller.obtenerImagen);

export default router;