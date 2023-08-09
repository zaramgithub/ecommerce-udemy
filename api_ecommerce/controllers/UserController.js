import models from '../models'
import bcrypt from 'bcryptjs'
import token from '../services/token'
import resource from '../resources'

export default {
    register: async(req,res)=>{
        try{
            req.body.password = await bcrypt.hash(req.body.password,10)
            const user = await models.User.create(req.body);
            res.status(200).json(user);
        }catch(error){
            res.status(500).send({
                message: "OCURRIO UN PROBLEMA"
            });
            console.log(error)
        }
    },
    register_admin: async(req,res)=>{
        try{
            //valido si existe algun usuario ya registrado con el email
            const userV = await models.User.findOne({email: req.body.email})

            if(userV){
                res.status(500).send({
                    message: "YA EXISTE UN USUARIO CON ESE EMAIL"
                });
            }

            req.body.rol = "admin"
            req.body.password = await bcrypt.hash(req.body.password,10)

            let user = await models.User.create(req.body); //si lo dejaba como const no iba a poder parsear la info, asi lo cambio a let
            res.status(200).json({
                user: resource.User.user_list(user)
            });

        }catch(error){
            res.status(500).send({
                message: "OCURRIO UN PROBLEMA",
                errors:error.message
            });
            console.log(error)
        }
    },
    login: async(req,res)=>{
        try {
            //busca al usuario por el email
            const user = await models.User.findOne({email: req.body.email, state:1})
            if(user){//si existe el usuario
                //compara la contraseña que dio con la almacenada
                let compare = await bcrypt.compare(req.body.password,user.password);
                if(compare){
                    //se lo llamo tokenT porque sino no reconocia la libreria porque tenia el mismo nombre la variable. Antes 'token' ahora 'tokenT'
                    let tokenT = await token.encode(user._id,user.rol,user.email)

                    const USER_FRONTEND = {
                        token: tokenT,
                        user: {
                            name: user.name,
                            email: user.email,
                            surname: user.surname,
                            avatar: user.avatar,
                        }
                    }

                    res.status(200).json({
                        USER_FRONTEND:USER_FRONTEND,
                    })
                }else{
                    res.status(500).send({
                        message: "EL USUARIO NO EXISTE"
                    });
                }
            }else{
                res.status(500).send({
                    message: "EL USUARIO NO EXISTE"
                });
            }
        } catch (error) {
            res.status(500).send({
                message: "OCURRIO UN PROBLEMA LOGIN"
            });
            console.log(error)
        }
    },
    login_admin: async(req,res)=>{
        try {
            //busca al usuario por el email
            const user = await models.User.findOne({email: req.body.email, state:1,rol:"admin"} )
            if(user){//si existe el usuario
                //compara la contraseña que dio con la almacenada
                let compare = await bcrypt.compare(req.body.password,user.password);
                if(compare){
                    //se lo llamo tokenT porque sino no reconocia la libreria porque tenia el mismo nombre la variable. Antes 'token' ahora 'tokenT'
                    let tokenT = await token.encode(user._id,user.rol,user.email)

                    const USER_FRONTEND = {
                        token: tokenT,
                        user: {
                            name: user.name,
                            email: user.email,
                            surname: user.surname,
                            avatar: user.avatar,
                            rol: user.rol
                        } 
                    }

                    res.status(200).json({
                        USER_FRONTEND:USER_FRONTEND,
                    })
                }else{
                    res.status(500).send({
                        message: "EL USUARIO NO EXISTE"
                    });
                }
            }else{
                res.status(500).send({
                    message: "EL USUARIO NO EXISTE"
                });
            }
        } catch (error) {
            res.status(500).send({
                message: "OCURRIO UN PROBLEMA LOGIN"
            });
            console.log(error)
        }
    },
    update: async(req,res)=>{
        try {
            if(req.files){
                var img_path = req.files.avatar.path;
                var name = img_path.split('\\');
                var avatar_name = name[2];
                console.log(avatar_name)
            }

            if(req.body.password){
                req.body.password = await bcrypt.hash(req.body.password,10)
            }

            //let UserT =  await models.User.findByIdAndUpdate({_id:req.body._id},req.body); como userT no me trae los datos actualizados mejor cambiar a lo siguiente

            await models.User.findByIdAndUpdate({_id:req.body._id},req.body); //espero a que lo actualice

            let UserT = await models.User.findOne({_id:req.body._id}); //y ahora si lo busco

            res.status(200).json({
                message: "EL USUARIO SE HA MODIFICADO CORRECTAMENTE",
                user: resource.User.user_list(UserT)
            });
        } catch (error) {
            res.status(500).send({
                message: "OCURRIO UN PROBLEMA UPDATE"
            });
            console.log(error)
        }
    },
    list: async(req,res)=>{
        try {
            var search = req.query.search;

            let Users = await models.User.find({
                $or:[
                    {"name": new RegExp(search, "i")},
                    {"surname": new RegExp(search, "i")},
                    {"email": new RegExp(search, "i")}
                ]
            }).sort({'createdAt':-1}) //ordenar en base a la fecha de creacion, arriba los recientes y abajo los más viejos

            Users = Users.map((user)=>{
                return resource.User.user_list(user);
            })

            res.status(200).json({
                users:Users
            })

        } catch (error) {
            res.status(500).send({
                message: "OCURRIO UN PROBLEMA UPDATE"
            });
            console.log(error)
        }
    },

    remove: async(req,res) =>{

        try {
            const User = await models.User.findByIdAndDelete({_id:req.query._id});
            res.status(200).json({
                message: "EL USUARIO SE ELIMINO CORRECTAMENTE",
            });
        } catch (error) {
            console.log("error en el remove usuario"+error)

        }
    }
}