import { Component, Input, OnInit } from '@angular/core';
import { Orders } from '../../../models/Orders';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { OrdersService } from '../../../services/orders.service';
import { ExcelService } from '../../../services/excel.service';
import { ConfigService } from '../../../services/config.service';
import { EmailService } from '../../../services/email.service';

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
    private excelService:ExcelService,
    private configService:ConfigService,
    private emailService:EmailService
  ) { }

  public async ngOnInit(){
      //await this.subscribeToCurrentOrder();
      this.order = this.configService.order;

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

    let formData = new FormData();

  // Assuming this.configService.orderInfo and this.order.vendorItems are arrays
  let partInfo = this.configService.orderInfo;
  this.order.OrderInfo = partInfo; // Note the "Orders." prefix added here
  let vendorItems = this.order.vendorItems; // Note the "Orders." prefix added here
  let lineItems = this.order.lineItems; // Note the "Orders." prefix added here

  // Iterate over this.order keys and append to formData with "Orders." prefix
  Object.keys(this.order).forEach(key => {
    if (Array.isArray(this.order[key as keyof Orders])) {
      formData.append(`Orders.${key}`, JSON.stringify(this.order[key as keyof Orders]));
    } else {
      formData.append(`Orders.${key}`, this.order[key as keyof Orders] as string);
    }
  });

  formData.append('OrderInfoJson', JSON.stringify(this.order.OrderInfo));
  formData.append('VendorItemsJson', JSON.stringify(this.order.vendorItems));
  formData.append('LineItemsJson', JSON.stringify(this.order.lineItems));

  // Append the Excel file as binary data with appropriate metadata
  var file = this.excelService.convertToExcel(this.order, partInfo, vendorItems, 'calculatedOrders');
  formData.append('Attachment', file, 'calculatedOrders.xlsx');

  // Send email with formData
  await this.emailService.SendEmail(formData);
  this.toastr.success("Email Sent");
  this.router.navigate(['/home']);
  }

}
