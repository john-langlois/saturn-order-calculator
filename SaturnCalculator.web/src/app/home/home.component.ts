import { Component } from '@angular/core';
import { OrdersService } from '../../services/orders.service';
import { Orders } from '../../models/Orders';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  fileToUpload: File | null = null;

  public order!:Orders;

  constructor(private orderService:OrdersService) { }

  handleFileInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    const files = target.files;
    if (files && files.length > 0) {
      this.fileToUpload = files.item(0);
    }
  }

  async getCalculatedOrders(){
    if(this.fileToUpload){

      this.order = await this.orderService.GetOrderInfoFromFile();
      console.log(this.order);
    }
  }

}
