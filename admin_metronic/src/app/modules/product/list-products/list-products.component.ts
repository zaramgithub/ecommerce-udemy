import { Component, OnInit } from '@angular/core';
import { ProductService } from '../_services/product.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-products',
  templateUrl: './list-products.component.html',
  styleUrls: ['./list-products.component.scss']
})
export class ListProductsComponent implements OnInit {
  products: any = [];
  search: any = "";
  isLoading$: any = null;

  constructor(
    public productService: ProductService,
    public router: Router,

  ) { }

  ngOnInit(): void {
    this.isLoading$ = this.productService.isLoading$;

    this.productService.AllProducts(this.search).subscribe(
      (result: any) => {
        console.log(result)
        this.products = result.products
      }
    )
  }

  editProduct(product) {
    this.router.navigateByUrl("/productos/editar-producto/"+product._id)
  }
  delete(product) {

  }

}
