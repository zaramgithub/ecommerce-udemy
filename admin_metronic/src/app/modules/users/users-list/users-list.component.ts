import { Component, OnInit } from '@angular/core';
import { UsersService } from '../_services/users.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddUsersComponent } from '../components/add-users/add-users.component';
import { error } from 'console';
import { EditUsersComponent } from '../components/edit-users/edit-users.component';
import { DeleteUserComponent } from '../components/delete-user/delete-user.component';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit {
  isLoading$: any; //en cada componente del admin_metronic hay que ponerlo!
  users: any = [];
  search:any="";

  constructor(
    public _userService: UsersService,
    public modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.isLoading$ = this._userService.isLoading$;
    this.allUsers();
  }

  allUsers() {
    console.log(this.search)
    this._userService.AllUsers(this.search).subscribe(
      (result: any) => {
        console.log(result.users)
        this.users = result.users;
      },
      error => {

      }
    )
  }

  openCreate() {
    const modalRef = this.modalService.open(AddUsersComponent, { centered: true, size: 'md' })

    modalRef.result.then(
      () => {

      },
      () => {

      }
    );

    modalRef.componentInstance.UserC.subscribe( //accedo al valor de UserC que fue declarado en add-users
      (result: any) => {
        console.log(result)
        this.users.unshift(result)
      }
    )
  }

  editUser(user: any) {
    const modalRef = this.modalService.open(EditUsersComponent, { centered: true, size: 'md' })

    modalRef.componentInstance.user_selected = user;

    modalRef.result.then(
      () => {

      },
      () => {

      }
    );

    modalRef.componentInstance.UserE.subscribe( //accedo al valor de UserE que fue declarado en edit-users.component.ts
      (usuario: any) => {
        console.log("editar usuario : ", usuario)

        let INDEX = this.users.findIndex(item => item._id == usuario._id)

        if (INDEX = ! -1) {
          this.users[INDEX] = usuario
        }

      }
    )
  }

  delete(user: any) {
    const modalRef = this.modalService.open(DeleteUserComponent, { centered: true, size: 'md' })

    modalRef.componentInstance.user_selected = user;

    modalRef.result.then(
      () => {

      },
      () => {

      }
    );

    modalRef.componentInstance.UserD.subscribe( //accedo al valor de UserE que fue declarado en edit-users.component.ts
      (usuario: any) => {
        console.log("remove usuario : ", usuario)

        let INDEX = this.users.findIndex(item => item._id == user._id)

        if (INDEX = ! -1) {
          this.users.splice(INDEX,1)
        }

      }
    )
  }

  refresh(){
    this.search = ""
    this.allUsers()
  }
}
