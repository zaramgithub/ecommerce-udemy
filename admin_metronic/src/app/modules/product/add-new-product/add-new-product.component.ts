import { Component, OnInit } from '@angular/core';
import { Toaster } from 'ngx-toast-notifications';
import { NoticyAlertComponent } from 'src/app/componets/notifications/noticy-alert/noticy-alert.component';
import { ProductService } from '../_services/product.service';
import { CategoriesService } from '../../categories/_services/categories.service';

@Component({
  selector: 'app-add-new-product',
  templateUrl: './add-new-product.component.html',
  styleUrls: ['./add-new-product.component.scss']
})
export class AddNewProductComponent implements OnInit {
  title: any = null;
  sku: any = null;
  categorias: any = [];
  categorie: any = "";
  price_usd: any;
  price_ars: any;
  imagen_previsualizacion: any = null;
  imagen_file: any = null;
  description: any = null;
  resumen: any = null;
  tag: any = null;
  tags: any = [];
  search: any = "";
  isLoading$: any = null;

  constructor(
    public toaster: Toaster,
    public productService: ProductService,
    public categoryService: CategoriesService,
  ) { }

  ngOnInit(): void {
    this.isLoading$ = this.productService.isLoading$;

    this.categoryService.AllCategories().subscribe(
      (result: any) => {
        console.log(result)
        this.categorias = result.categorias;
        this.loadServices();
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
        console.log(result);

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
