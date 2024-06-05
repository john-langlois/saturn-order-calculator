import { Component, Input, OnInit } from '@angular/core';
import { Orders } from '../../../models/Orders';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { OrdersService } from '../../../services/orders.service';
import { ExcelService } from '../../../services/excel.service';

@Component({
  selector: 'app-view-order',
  templateUrl: './view-order.component.html',
  styleUrl: './view-order.component.css'
})
export class ViewOrderComponent implements OnInit {

  public order!:Orders;
  public orderPromise!:Promise<Orders>;

  constructor(
    private route:ActivatedRoute,
    private router:Router,
    private toastr:ToastrService,
    private ordersService:OrdersService,
    private excelService:ExcelService
  ) { }

  public async ngOnInit(){
      await this.subscribeToCurrentOrder();
  }

  public async subscribeToCurrentOrder(){
    this.route.params.subscribe(async params => {
      if(params["id"] == null){
        this.router.navigate(['/home']);
      }
      this.orderPromise = this.ordersService.GetOrdersByID(params["id"]);
      this.order = await this.orderPromise;
    });
  }

  public async exportToExcel() {

    let partInfo = await this.ordersService.GetAllOrderInfo();
    
    const result = [];
    for (const key in this.order) {
        if (typeof (this.order as any)[key] !== 'object' && !Array.isArray((this.order as any)[key])) {
            const newObj:any = {};
            newObj[key] = (this.order as any)[key];
            result.push(newObj);
        }
  }  
    this.excelService.convertToExcel(this.order, partInfo, this.order.vendorItems ,'calculatedOrders');
  }

}
