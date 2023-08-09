import routerx from 'express-promise-router';
import User from './User';
import Categoria from './Categoria'
import Product from './Product'

const router = routerx();
router.use('/users',User);
router.use('/categories',Categoria);
router.use('/products',Product);

export default router;