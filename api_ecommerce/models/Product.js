import moongose, {Schema} from 'mongoose';
const Categorie = require('./Categoria');

const ProductSchema = new Schema ({
    title:{type:String, maxlength:250, required:true},
    slug:{type:String, maxlength:1000,required:true},
                                        //el ref: tiene que tener el mismo nombre que en el: [  const Categoria = moongose.model("categoria",CategoriaSchema) ] que está en models/Categoria.js
    categorie: {type: Schema.ObjectId,ref:'categoria', required:true},
    // espectador: { type: Schema.Types.ObjectId, ref: Espectador, required: true }
    price_ars:{type:Number,required:true},
    price_usd:{type:Number,required:true},
    portada: {type:String,required:true},
    galerias:[{type:Object,required:false}],
    state: {type:Number,default:1}, //1 es en prueba o desarrollo, 2 va a ser publico y 3 va a ser anulado
    stock:{type:Number,default:0},
    description:{type:String,required:true},
    resumen:{type:String, required:true},
    tags:{type:String,required:true},
    type_inventario:{type:Number, default:1},
    sku:{type:String,required:true}
},{
    timestamps: true
});

const Product = moongose.model('product',ProductSchema);
export default Product;