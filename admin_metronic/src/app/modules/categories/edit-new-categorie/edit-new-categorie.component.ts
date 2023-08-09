import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Toaster } from 'ngx-toast-notifications';
import { NoticyAlertComponent } from 'src/app/componets/notifications/noticy-alert/noticy-alert.component';
import { CategoriesService } from '../_services/categories.service';
import { URL_BACKEND } from 'src/app/config/config';

@Component({
  selector: 'app-edit-new-categorie',
  templateUrl: './edit-new-categorie.component.html',
  styleUrls: ['./edit-new-categorie.component.scss']
})
export class EditNewCategorieComponent implements OnInit {
  @Output() CategoriaE: EventEmitter<any> = new EventEmitter(); //eventEmmiter de angular/core
  @Input() category_selected:any;

  isLoading$: any = null;
  name: any = null;
  imagen_file: any = null;
  imagen_previsualizacion: any = null; //va a  estar en base64

  URL_BACKEND = URL_BACKEND;
  state:any=null;

  constructor(
    public modal: NgbActiveModal,
    public toaster: Toaster,
    public categoriesService: CategoriesService
  ) { }

  ngOnInit(): void {
    // console.log(this.category_selected._id)
    this.state = this.category_selected.state;
    this.name = this.category_selected.title;
    this.imagen_previsualizacion = URL_BACKEND+'api/categories/uploads/categorie/'+this.category_selected.imagen;
  }

  processFile($event:any) {
    if ($event.target.files[0].type.indexOf("image") < 0) {
      this.imagen_previsualizacion = null;
      this.toaster.open(NoticyAlertComponent, { text: `danger-Upps! Necesitas ingresar un archivo de tipo imagen` })
      return;
    }

    this.imagen_file = $event.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(this.imagen_file); //le paso el archivo que quiere que me pase a base 64
    reader.onloadend = () => {
      this.imagen_previsualizacion = reader.result;
    }
  }

  save() {
    console.log("nombre:   ", this.name, "   imagen:", this.imagen_file, "state: ",this.state)
    if (!this.name) { //ya no va this.imagen_file porque la imagen ya esta cargada
      this.toaster.open(NoticyAlertComponent, { text: `danger-Upps! Necesitas ingresar todos los campos` })
      return;
    }

    let formData = new FormData();
    
    formData.append('title', this.name)
    formData.append('_id', this.category_selected._id)
    formData.append('state', this.state)
    if(this.imagen_file){
      formData.append('portada', this.imagen_file)
    }
    

    this.categoriesService.updateCategory(formData).subscribe(
      (result: any) => {
        //console.log(result.categoria);
        this.CategoriaE.emit(result.categoria)
        this.modal.close();
      }
    )
  }

}
