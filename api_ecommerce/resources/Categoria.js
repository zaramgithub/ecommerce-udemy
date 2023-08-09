export default {
    categoria_list: (categoria) => {
        return {
            _id: categoria._id,
            title: categoria.title,
            imagen: categoria.imagen,
            state: categoria.state
        }
    }
}