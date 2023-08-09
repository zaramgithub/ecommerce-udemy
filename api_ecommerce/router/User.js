import routerx from 'express-promise-router'
import usercontroller from '../controllers/UserController'
import auth from '../middlewares/auth'

const router= routerx();

router.post("/login",usercontroller.login);
router.post("/login_admin",usercontroller.login_admin);
router.post("/register",usercontroller.register);
router.post("/register_admin",auth.verifyAdmin,usercontroller.register_admin);
router.put("/update",usercontroller.update);
router.get("/list",auth.verifyAdmin,usercontroller.list);
router.delete("/delete",usercontroller.remove);

export default router;