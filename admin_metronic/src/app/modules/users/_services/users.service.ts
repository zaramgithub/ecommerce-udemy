import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from '../../auth';
import { URL_SERVICIOS } from 'src/app/config/config';
import { finalize } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  //se pone en cualquier servicio que implementemos dentro de la plantilla admin_metronic
  isLoading$: Observable<boolean>;
  isLoadingSubject: BehaviorSubject<boolean>;
  
  constructor(
    private http: HttpClient,
    public authservice: AuthService,
  ) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.isLoading$ = this.isLoadingSubject.asObservable();
  }
  //se pone en cualquier servicio que implementemos dentro de la plantilla admin_metronic




  AllUsers(search:any){
    this.isLoadingSubject.next(true) //indica que recien se va a estar solicitando el proceso.  Tambien que hay que ponerlo en esta plantilla porque es propia de ella

    let headers = new HttpHeaders(
      {
        'token': this.authservice.token
      }
    )
    let URL = URL_SERVICIOS + "/users/list?search="+search;
    
    return this.http.get(URL,{headers:headers}).pipe(
      finalize(()=> this.isLoadingSubject.next(false))
    )
  }

  createUserAdmin (data:any){
    this.isLoadingSubject.next(true)

    let headers = new HttpHeaders(
      {
        'token': this.authservice.token
      }
    )

    let URL = URL_SERVICIOS + "/users/register_admin";
    
    return this.http.post(URL,data,{headers:headers}).pipe(
      finalize(()=> this.isLoadingSubject.next(false))
    )
  }

  updateUser (data:any){
    this.isLoadingSubject.next(true)

    let headers = new HttpHeaders(
      {
        'token': this.authservice.token
      }
    )

    let URL = URL_SERVICIOS + "/users/update";
    
    return this.http.put(URL,data,{headers:headers}).pipe(
      finalize(()=> this.isLoadingSubject.next(false))
    )
  }


  deleteUser(id:string){
    this.isLoadingSubject.next(true)

    let headers = new HttpHeaders(
      {
        'token': this.authservice.token
      }
    )

    let URL = URL_SERVICIOS + "/users/delete?_id="+id; //se esta mandando como parametro, so, en el backend seria req.query._id
    
    return this.http.delete(URL,{headers:headers}).pipe(
      finalize(()=> this.isLoadingSubject.next(false))
    )
  }
  

}
