import { Component, OnInit } from '@angular/core';
import { ProductService } from '../_services/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoriesService } from '../../categories/_services/categories.service';
import { Toaster } from 'ngx-toast-notifications';
import { NoticyAlertComponent } from 'src/app/componets/notifications/noticy-alert/noticy-alert.component';

@Component({
  selector: 'app-edit-new-product',
  templateUrl: './edit-new-product.component.html',
  styleUrls: ['./edit-new-product.component.scss']
})
export class EditNewProductComponent implements OnInit {
  isLoading$: any = null;
  product_id: any = null;
  product_selected: any = null;

  categories: any = [];
  title: any = null;
  sku: any = null;
  categorie: any = "";
  price_usd: any;
  price_ars: any;
  imagen_previsualizacion: any = null;
  imagen_file: any = null;
  description: any = null;
  resumen: any = null;
  tag: any = null;
  tags: any = [];

  constructor(
    public productService: ProductService,
    public router: Router,
    public categoryService: CategoriesService,
    public activeRouter: ActivatedRoute,
    public toaster: Toaster
  ) { }

  ngOnInit(): void {
    this.isLoading$ = this.productService.isLoading$;
    //guarda/tiene lo que se envio con el router.navigate en list-product
    this.activeRouter.params.subscribe(
      (resp: any) => {
        //console.log(resp)
        this.product_id = resp.id;
      }
    )

    this.categoryService.AllCategories().subscribe(
      (result: any) => {
        //console.log(result)
        this.categories = result.categorias;
        //console.log(this.categories)
        this.loadServices();
      }
    )
    this.productService.getProductById(this.product_id).subscribe(
      (result: any) => {
        //console.log(result)
        this.product_selected = result.product;

        this.title = this.product_selected.title;
        this.sku = this.product_selected.sku;
        this.categorie = this.product_selected.categorie._id;
        this.price_usd = this.product_selected.price_usd;
        this.price_ars = this.product_selected.price_ars;
        this.imagen_previsualizacion = this.product_selected.imagen;
        this.description = this.product_selected.description;
        this.resumen = this.product_selected.resumen;
        this.tags = this.product_selected.tags;
      }
    )
  }
  loadServices() {
    this.productService.isLoadingSubject.next(true);

    setTimeout(() => {
      this.productService.isLoadingSubject.next(false);

    }, 50)
  }

  

  processFile($event) {
    //validacion
    if ($event.target.files[0].type.indexOf("image") < 0) {
      this.imagen_previsualizacion = null;
      this.toaster.open(NoticyAlertComponent, { text: `danger-Upps! Necesitas ingresar un archivo de tipo imagen` })
      return;
    }

    //pasa a base64
    this.imagen_file = $event.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(this.imagen_file); //le paso el archivo que quiere que me pase a base 64
    reader.onloadend = () => {
      this.imagen_previsualizacion = reader.result;
    }

    this.loadServices(); //cada vez que se elija una imagen, la pantalla se renderize (como que se recargue) y muestre la imagen
  }

  addTag() {
    this.tags.push(this.tag);
    this.tag = "";
  }

  removeTag(i) {
    this.tags.splice(i, 1)
  }

  save() {
    if (!this.title || !this.imagen_file ||
      !this.sku || !this.categorie || !this.price_usd || !this.price_ars || !this.description || !this.resumen || this.tags.length == 0) {
      this.toaster.open(NoticyAlertComponent, { text: `danger-Upps! NECESITAS INGRESAR TODOS LOS CAMPOS DEL FORMULARIO` })
      return;
    }

    let formData = new FormData(); //se usualmente para enviar las img al servidor

    formData.append("title", this.title);
    formData.append("categorie", this.categorie);
    formData.append("sku", this.sku);
    formData.append("price_ars", this.price_ars);
    formData.append("price_usd", this.price_usd);
    formData.append("description", this.description);
    formData.append("resumen", this.resumen);
    formData.append("tags", JSON.stringify(this.tags));
    formData.append("imagen", this.imagen_file); //tiene que coincidir con el req.files.[imagen] 


    this.productService.createProduct(formData).subscribe(
      (result: any) => {
        //console.log(result);

        if (result.code == 403) {
          this.toaster.open(NoticyAlertComponent, { text: `danger-Upps! EL PRODUCTO YA EXISTE, INGRESAR OTRO NOMBRE` })
          return;
        } else {
          this.toaster.open(NoticyAlertComponent, { text: `success-Upps! EL PRODUCTO SE REGSITRÓ CON ÉXITO` })
          this.title = null;
          this.sku = null;
          this.categorie = "";
          this.price_usd = null;
          this.price_ars = null;
          this.imagen_file = null;
          this.imagen_previsualizacion = null;
          this.description = null;
          this.resumen = null;
          this.tag = null;
          this.tags = [];
        }
      }
    )
  }

}
