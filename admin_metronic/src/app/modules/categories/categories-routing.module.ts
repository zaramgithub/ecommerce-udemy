import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CategoriesComponent } from './categories.component';
import { ListCategoriesComponent } from './list-categories/list-categories.component';

//localhost:4200/categorias/

const routes: Routes = [
  {
    path: '',
    component: CategoriesComponent,
    children: [
      {
        //localhost:4200/categorias/list
        path:'list',
        component:ListCategoriesComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CategoriesRoutingModule { }
