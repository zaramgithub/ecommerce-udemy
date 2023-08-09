import models from '../models'
import resource from '../resources'
import fs from 'fs'
import path from 'path'

export default {
    register: async (req, res) => {
        try {
            if (req.files) {
                var img_path = req.files.portada.path;
                // console.log(img_path)
                var name = img_path.split('\\');
                var portada_name = name[2];
                // console.log(portada_name)
                req.body.imagen = portada_name;
            }

            const categoria = await models.Categoria.create(req.body);
            res.status(200).json(categoria);
        } catch (error) {
            res.status(500).send({
                message: "OCURRIO UN PROBLEMA"
            });
            console.log(error)
        }
    },
    update: async (req, res) => {
        try {
            if (req.files && req.files.portada) {
                var img_path = req.files.portada.path;
                var name = img_path.split('\\');
                var portada_name = name[2];
                // console.log(portada_name)
                req.body.imagen = portada_name; //ACA.name tenia imagen
            }

            //tiene que coincidir con el nombre que esta en el index.js de la carpeta models
            await models.Categoria.findByIdAndUpdate({_id: req.body._id }, req.body); //espero a que lo actualice

            let CategoriaT = await models.Categoria.findOne({ _id: req.body._id }); //y ahora si lo busco

            res.status(200).json({
                message: "LA CATEGORIA SE HA MODIFICADO CORRECTAMENTE",
                categoria: resource.Categoria.categoria_list(CategoriaT)
            });
        } catch (error) {
            res.status(500).send({
                message: "OCURRIO UN PROBLEMA UPDATE"
            });
            console.log(error)
        }
    },
    list: async (req, res) => {
        try {
            var search = req.query.search;

            let Categorias = await models.Categoria.find({
                $or: [
                    { "title": new RegExp(search, "i") },
                ]
            }).sort({ 'createdAt': -1 }) //ordenar en base a la fecha de creacion, arriba los recientes y abajo los más viejos

            Categorias = Categorias.map((cat) => {
                return resource.Categoria.categoria_list(cat);
            })

            res.status(200).json({
                categorias: Categorias
            })

        } catch (error) {
            res.status(500).send({
                message: "OCURRIO UN PROBLEMA UPDATE"
            });
            console.log(error)
        }
    },
    remove: async (req, res) => {

        try {
            await models.Categoria.findByIdAndDelete({ _id: req.query._id });
            res.status(200).json({
                message: "LA CATEGORIA SE ELIMINO CORRECTAMENTE",
            });
        } catch (error) {
            console.log("error en el remove categoria" + error)

        }
    },

    //obtener imagen para poder visualizarla en el frontend
    obtenerImagen: async (req, res) => {
        try {
            var img = req.params['img'];

            fs.stat('./uploads/categorie/' + img, function (err) {
                if (!err) {
                    let path_img = './uploads/categorie/' + img;
                    res.status(200).sendFile(path.resolve(path_img));
                } else {
                    let path_img = './uploads/default.jpg';
                    res.status(200).sendFile(path.resolve(path_img));
                }
            })
        } catch (error) {
            console.log("error en el remove categoria" + error)

        }
    }
}