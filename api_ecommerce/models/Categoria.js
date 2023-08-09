import moongose, {Schema} from 'mongoose';

const CategoriaSchema = new Schema ({
    title:{type:String, maxlength:250, required:true},
    imagen:{type:String, maxlength:250,required:true},
    state: {type:Number, maxlength:2,default:1}
},{
    timestamps: true
});

const Categoria = moongose.model("categoria",CategoriaSchema);
export default Categoria;