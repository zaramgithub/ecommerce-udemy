import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CategoriesService } from '../_services/categories.service';
import { Toaster } from 'ngx-toast-notifications';
import { NoticyAlertComponent } from 'src/app/componets/notifications/noticy-alert/noticy-alert.component';

@Component({
  selector: 'app-delete-new-categorie',
  templateUrl: './delete-new-categorie.component.html',
  styleUrls: ['./delete-new-categorie.component.scss']
})
export class DeleteNewCategorieComponent implements OnInit {
  @Input() category_selected: any;
  @Output() CategoryD: EventEmitter<any> = new EventEmitter();

  constructor(public modal: NgbActiveModal,
    public categoryService: CategoriesService,
    public toaster: Toaster) { }

  ngOnInit(): void {
  }

  delete() {
    this.categoryService.deleteCategory(this.category_selected._id).subscribe(
      (result: any) => { //debo poner de tipo any porque sino cuando quiero acceder a la propiedad user no lo reconoce
        console.log("delete-category components ts:"+result)

        this.CategoryD.emit(""); //aqui saldria el error sino lo pongo result:any
        //lo que hace el emit es enviar el parametro en este caso result.user al padre users-list

        this.toaster.open(NoticyAlertComponent, { text: `success-'Categoria se eliminó correctamente'` })
        this.modal.close()
      },
      errorRespuesta => {
        if (errorRespuesta.error) {
          this.toaster.open(NoticyAlertComponent, { text: `danger-'${errorRespuesta.error.message}'` })
        }
      }
    )
  }
}
