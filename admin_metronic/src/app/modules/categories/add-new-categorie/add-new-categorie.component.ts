import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Toaster } from 'ngx-toast-notifications';
import { NoticyAlertComponent } from 'src/app/componets/notifications/noticy-alert/noticy-alert.component';
import { CategoriesService } from '../_services/categories.service';

@Component({
  selector: 'app-add-new-categorie',
  templateUrl: './add-new-categorie.component.html',
  styleUrls: ['./add-new-categorie.component.scss']
})
export class AddNewCategorieComponent implements OnInit {

  @Output() CategoriaC: EventEmitter<any>  = new EventEmitter(); //eventEmmiter de angular/core
  
  isLoading$: any = null;
  name: any = null;
  imagen_file: any = null;
  imagen_previsualizacion: any = null; //va a  estar en base64

  constructor(
    public modal: NgbActiveModal,
    public toaster: Toaster,
    public categoriesService: CategoriesService
  ) { }

  ngOnInit(): void {
  }

  processFile($event) {
    if ($event.target.files[0].type.indexOf("image") < 0) {
      this.imagen_previsualizacion  = null;
      this.toaster.open(NoticyAlertComponent, { text: `danger-Upps! Necesitas ingresar un archivo de tipo imagen` })
      return;
    }

    this.imagen_file = $event.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(this.imagen_file); //le paso el archivo que quiere que me pase a base 64
    reader.onloadend = ()=>{
      this.imagen_previsualizacion  = reader.result;
    }
  }

  save(){
    console.log("nombre:   ",this.name,"   imagen:",this.imagen_file)
    if(!this.name || !this.imagen_file){
      this.toaster.open(NoticyAlertComponent, { text: `danger-Upps! Necesitas ingresar todos los campos` })
      return
    }

    let formData = new FormData();
    formData.append('title',this.name)
    formData.append('portada',this.imagen_file)

    this.categoriesService.createCategory(formData).subscribe(
      (result:any)=>{
        console.log(result);
        this.CategoriaC.emit(result)
        this.modal.close();
      }
    )
  }

}
