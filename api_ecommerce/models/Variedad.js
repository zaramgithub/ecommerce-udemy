import moongose,{Schema} from "mongoose";

const VariedadSchema = new Schema ({
    product: {type: Schema.ObjectId,ref:'product', required:true},
    valor: {type:String,required:true},
    stock:{type:Number,required:true}
},{
    timestamps: true,

});

const Variedad = moongose.model("variedad",VariedadSchema);
export default Variedad;