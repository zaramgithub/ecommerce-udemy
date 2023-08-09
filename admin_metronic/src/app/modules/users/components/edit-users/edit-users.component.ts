import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Toaster } from 'ngx-toast-notifications';
import { NoticyAlertComponent } from 'src/app/componets/notifications/noticy-alert/noticy-alert.component';
import { UsersService } from '../../_services/users.service';

@Component({
  selector: 'app-edit-users',
  templateUrl: './edit-users.component.html',
  styleUrls: ['./edit-users.component.scss']
})
export class EditUsersComponent implements OnInit {

  @Input() user_selected: any
  @Output() UserE: EventEmitter<any> = new EventEmitter(); //eventEmmiter de angular/core

  name: any = null;
  surname: any = null;
  email: any = null;
  password: any = null;
  repeat_password: any = null;

  constructor(
    public modal: NgbActiveModal, 
    public userService: UsersService,
    public toaster: Toaster
  ) { }

  ngOnInit(): void {
    this.name = this.user_selected.name;
    this.surname = this.user_selected.surname;
    this.email = this.user_selected.email;
  }

  save() {
    if (!this.name ||
      !this.surname ||
      !this.email) {
      this.toaster.open(NoticyAlertComponent, { text: `danger-'Upps! Necesita ingresar todos los campos'` })
      return; //return para que pare ahi la ejecucion y no siga con lo demas
    }

    if (this.password != this.repeat_password) {
      this.toaster.open(NoticyAlertComponent, { text: `danger-'Upps! Necesitas ingresar contraseñas iguales'` })
      return;
    }

    let data = {
      _id: this.user_selected._id,
      name: this.name,
      surname: this.surname,
      email: this.email,
      password: this.password,
      repeat_password: this.repeat_password,
    }

    this.userService.updateUser(data).subscribe(
      (result: any) => { //debo poner de tipo any porque sino cuando quiero acceder a la propiedad user no lo reconoce
        console.log(result)

        this.UserE.emit(result.user); //aqui saldria el error sino lo pongo result:any
        //lo que hace el emit es enviar el parametro en este caso result.user al padre users-list

        this.toaster.open(NoticyAlertComponent, { text: `success-Usuario modificado correctamente` })
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
