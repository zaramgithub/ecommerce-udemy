import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UsersService } from '../../_services/users.service';
import { Toaster } from 'ngx-toast-notifications';
import { NoticyAlertComponent } from 'src/app/componets/notifications/noticy-alert/noticy-alert.component';

@Component({
  selector: 'app-add-users',
  templateUrl: './add-users.component.html',
  styleUrls: ['./add-users.component.scss']
})
export class AddUsersComponent implements OnInit {

  @Output() UserC: EventEmitter<any>  = new EventEmitter(); //eventEmmiter de angular/core

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
  }

  save() {
    if (!this.name ||
      !this.surname ||
      !this.email ||
      !this.password ||
      !this.repeat_password) {
      this.toaster.open(NoticyAlertComponent, { text: `danger-'Upps! Necesita ingresar todos los campos'` })
      return; //return para que pare ahi la ejecucion y no siga con lo demas
    }

    if (this.password != this.repeat_password) {
      this.toaster.open(NoticyAlertComponent, { text: `danger-'Upps! Necesitas ingresar contraseñas iguales'` })
      return;
    }

    let data = {
      name: this.name,
      surname: this.surname,
      email: this.email,
      password: this.password,
      repeat_password: this.repeat_password,
    }

    this.userService.createUserAdmin(data).subscribe(
      (result:any) => { //debo poner de tipo any porque sino cuando quiero acceder a la propiedad user no lo reconoce
        console.log(result)

        this.UserC.emit(result.user); //aqui saldria el error sino lo pongo result:any
                                      //lo que hace el emit es enviar el parametro en este caso result.user al padre users-list

        this.toaster.open(NoticyAlertComponent, { text: `success-'Usuario registrado correctamente'` })
        this.modal.close()
      },
      errorRespuesta => {
        if(errorRespuesta.error){
          this.toaster.open(NoticyAlertComponent, { text: `danger-'${errorRespuesta.error.message}'` })
        }
      }
    )
  }

}
