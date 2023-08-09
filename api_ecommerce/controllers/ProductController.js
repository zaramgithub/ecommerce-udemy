import models from '../models'
import resource from '../resources';
import fs from 'fs'
import path from 'path'

export default {
    register: async (req, res) => {
        try {

            let data = req.body;

            let valid_Product = await models.Product.findOne({ title: data.title })

            if (valid_Product) {
                res.status(200).json({
                    message: "EL PRODUCTO YA EXISTE",
                    code: 403
                });
                return;
            }

            //el slug es el titulo solo que se reemplaza los espacios por guiones medios - y cualquier otro caracter por espacio vacio ''
            data.slug = data.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')


            if (req.files) {
                var img_path = req.files.imagen.path;
                var name = img_path.split('\\');
                var portada_name = name[2];
                data.portada = portada_name;
            }



            let product = await models.Product.create(data);

            res.status(200).json(
                {
                    message: "EL PRODUCTO SE REGISTRO CON EXISTO"
                }
            )
        } catch (error) {
            res.status(500).send(
                {
                    message: "OCURRIO UN PROBLEMA REGISTER PRODUCT"
                }
            )
        }
    },
    register_image: async (req, res) => {
        try {

            var img_path = req.files.imagen.path;
            var name = img_path.split('\\');
            var imagen_name = name[2];

            let product = await models.Product.findByIdAndUpdate({_id:req.body._id},{
                $push: {
                    galerias: {
                        imagen: imagen_name,
                        _id: req.body.__id,
                    }
                }
            })

            res.status(200).json({
                message: "LA IMAGEN SE SUBIO CORRECTAMENTE",
                imagen:{
                    imagen: imagen_name,
                    imagen_path: 'http://localhost:3000/uploads/product/'+imagen_name,
                    _id: req.body.__id,
                }
            })

        } catch (error) {
            res.status(500).send(
                {
                    message: "OCURRIO UN PROBLEMA REGISTER PRODUCT"
                }
            )
        }
    },
    remove_image: async (req, res) => {
        try {

            await models.Product.findByIdAndUpdate({_id:req.body._id},{
                $pull: {
                    galerias: {
                        _id: req.body.__id,
                    }
                }
            })

            res.status(200).json({
                message: "LA IMAGEN SE ELIMINO CORRECTAMENTE",
            })

        } catch (error) {
            res.status(500).send(
                {
                    message: "OCURRIO UN PROBLEMA REMOVE PRODUCT"
                }
            )
        }
    },
    update: async (req, res) => {
        try {

            let data = req.body;

            let valid_Product = await models.Product.findOne({ title: data.title, _id: { $ne: data._id } })

            if (valid_Product) {
                res.status(200).json({
                    message: "EL PRODUCTO YA EXISTE",
                    code: 403
                })
            }

            //el slug es el titulo solo que se reemplaza los espacios por guiones medios - y cualquier otro caracter por espacio vacio ''
            data.slug = data.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')


            if (req.files && req.files.imagen) {
                var img_path = req.files.portada.path;
                var name = img_path.split('\\');
                var portada_name = name[2];
                data.portada = portada_name;
            }



            await models.Product.findByIdAndUpdate({ _id: data._id }, data);

            res.status(200).json(
                {
                    message: "EL PRODUCTO SE REGISTRO CON EXITO"
                }
            )
        } catch (error) {
            res.status(500).send(
                {
                    message: "OCURRIO UN PROBLEMA REGISTER PRODUCT"
                }
            )
        }
    },
    list: async (req, res) => {
        try {
            var search = req.query.search;
            var categorie = req.query.categorie;

            console.log("entra al find")

            let products = await models.Product.find(
                {
                    //busca los productos que correspondan con alguna busqueda ya sea por titulo o categoria
                    $or: [
                        { "title": new RegExp(search, "i") }, //a opción "i" en la expresión regular significa que la búsqueda será insensible a mayúsculas y minúsculas, por lo que coincidirá con mayúsculas y minúsculas indistintamente.
                        { "categorie": categorie } //aca buscaria por id de la categoria no por expresion
                    ]
                }
            ).populate("categorie") //el populate tiene que tener el mismo nombre que tiene la propiedad en el modelo Producto =>>> categorie: {type: Schema.ObjectId,ref:'categoria', required:true},

            console.log("sale del find")
  
            products = products.map(
                prod => {
                    return resource.Product.product_list(prod);
                }
            )
            res.status(200).json(
                {
                    products: products
                }
            )
        } catch (error) {

            console.log("holaaaaaaaaaaaaaaa")

            res.status(500).send(
                {
                    message: "OCURRIO UN PROBLEMA LIST PRODUCT"
                }
            )
        }
    },
    remove: async (req, res) => {
        try {

            let _id = req.params._id;
            await models.Product.findByIdAndDelete({ _id: _id });

            res.status(200).json(
                {
                    message: "EL PRODUCTO SE ELIMINO CORRECTAMENTE"
                }
            )
        } catch (error) {
            res.status(500).send(
                {
                    message: "OCURRIO UN PROBLEMA REMOVE PRODUCT"
                }
            )
        }
    },
    obtenerImagen: async (req, res) => {
        try {
            var img = req.params['img'];

            fs.stat('./uploads/product/' + img, function (err) {
                if (!err) {
                    let path_img = './uploads/product/' + img;
                    res.status(200).sendFile(path.resolve(path_img));
                } else {
                    let path_img = './uploads/default.jpg';
                    res.status(200).sendFile(path.resolve(path_img));
                }
            })
        } catch (error) {
            console.log("error en el remove product" + error)

        }
    },
    getProductById:async (req, res) => {
        try {
           var product_id = req.params.id;

           //console.log(product_id)

           let product = await models.Product.findById({_id: product_id}).populate("categorie")

            res.status(200).json(
                {
                    product: resource.Product.product_list(product),
                }
            )

        } catch (error) {
            console.log("error en el GETPRODUCTBYID" , error)
        }
    },
}