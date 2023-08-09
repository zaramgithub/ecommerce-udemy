import routerx from 'express-promise-router'
import productocontroller from '../controllers/ProductController'
import auth from '../middlewares/auth'
import multiparty from 'connect-multiparty'

//donde se van a guardar las imagenes
var path = multiparty({uploadDir: './uploads/product'})

const router = routerx();


router.get("/show/:id",auth.verifyAdmin,productocontroller.getProductById);//sino le pongo el show antes del /:id, toma el siguiente get o sea manda como id 'list'
router.post("/register",[auth.verifyAdmin,path],productocontroller.register);
router.put("/update",[auth.verifyAdmin,path],productocontroller.update);
router.get("/list",auth.verifyAdmin,productocontroller.list);
router.delete("/delete",auth.verifyAdmin,productocontroller.remove);
router.get("/uploads/product/:img",productocontroller.obtenerImagen);//para poder visualizar la imagen
router.post("/register_imagen",[auth.verifyAdmin,path],productocontroller.register_image);
router.delete("/remove_imagen",[auth.verifyAdmin,path],productocontroller.remove_image);



export default router;