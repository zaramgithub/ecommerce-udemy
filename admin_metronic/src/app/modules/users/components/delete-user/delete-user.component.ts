import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Toaster } from 'ngx-toast-notifications';
import { UsersService } from '../../_services/users.service';
import { NoticyAlertComponent } from 'src/app/componets/notifications/noticy-alert/noticy-alert.component';

@Component({
  selector: 'app-delete-user',
  templateUrl: './delete-user.component.html',
  styleUrls: ['./delete-user.component.scss']
})
export class DeleteUserComponent implements OnInit {

  @Input() user_selected: any;
  @Output() UserD: EventEmitter<any> = new EventEmitter();

  constructor(public modal: NgbActiveModal,
    public userService: UsersService,
    public toaster: Toaster) { }

  ngOnInit(): void {
  }

  delete() {
    this.userService.deleteUser(this.user_selected._id).subscribe(
      (result: any) => { //debo poner de tipo any porque sino cuando quiero acceder a la propiedad user no lo reconoce
        console.log("delete-user components ts:"+result)

        this.UserD.emit(""); //aqui saldria el error sino lo pongo result:any
        //lo que hace el emit es enviar el parametro en este caso result.user al padre users-list

        this.toaster.open(NoticyAlertComponent, { text: `success-'Usuario se eliminó correctamente'` })
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
