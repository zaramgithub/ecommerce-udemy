import { Component, OnInit } from '@angular/core';
import { CategoriesService } from '../_services/categories.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddNewCategorieComponent } from '../add-new-categorie/add-new-categorie.component';
import { URL_BACKEND } from 'src/app/config/config';
import { EditNewCategorieComponent } from '../edit-new-categorie/edit-new-categorie.component';
import { DeleteNewCategorieComponent } from '../delete-new-categorie/delete-new-categorie.component';

@Component({
  selector: 'app-list-categories',
  templateUrl: './list-categories.component.html',
  styleUrls: ['./list-categories.component.scss']
})
export class ListCategoriesComponent implements OnInit {
  //categories: Array<any> = new Array<any>();
  categories: any = [];
  search:any="";
  isLoading$:any=null;

  URL_BACKEND:any = URL_BACKEND;

  constructor(
    public _serviceCategory:CategoriesService,
    public modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.isLoading$ = this._serviceCategory.isLoading$;
    this.allCategories();
  }

  openCreate(){
    const modalRef = this.modalService.open(AddNewCategorieComponent,{centered:true,size:'md'});

    modalRef.componentInstance.CategoriaC.subscribe((categoria:any)=>{
      this.categories.unshift(categoria);
    })
  }

  allCategories(){
    this._serviceCategory.AllCategories(this.search).subscribe(
      (result:any)=>{
        console.log(result)
        this.categories = result.categorias;
      },
      (error:any)=>{
        console.log("error en el el allCategoriessss :  ",error)
      }
    )
  }

  refresh(){
    this.search = "";
    this.allCategories();
  }

  editCategory(category:any){
    const modalRef = this.modalService.open(EditNewCategorieComponent,{centered:true,size:'md'});
    modalRef.componentInstance.category_selected = category;

    modalRef.componentInstance.CategoriaE.subscribe((categoria:any)=>{
      let index = this.categories.findIndex(item=>item._id == categoria._id)

      if(index != -1){
        this.categories[index] = categoria;
      }
    })
  }

  delete(category:any){
    const modalRef = this.modalService.open(DeleteNewCategorieComponent,{centered:true,size:'md'});
    modalRef.componentInstance.category_selected = category;

    modalRef.componentInstance.CategoryD.subscribe((resp:any)=>{
      let index = this.categories.findIndex(item=>item._id == category._id)

      if(index != -1){
        this.categories.splice(index,1)
      }
    })
  }
}
