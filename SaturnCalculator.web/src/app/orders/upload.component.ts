import { Component, OnInit } from '@angular/core';
import { Orders } from '../../models/Orders';
import { OrdersService } from '../../services/orders.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { EmailService } from '../../services/email.service';
import { ExcelService } from '../../services/excel.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrl: './upload.component.css'
})
export class UploadComponent implements OnInit {
  fileToUpload: File | null = null;

  public order!:Orders;

  constructor(
    private orderService:OrdersService,
    private toastr:ToastrService,
    private router:Router,
    private emailService:EmailService,
    private excelService:ExcelService,
    ) { }

  public async ngOnInit() {
  }

  handleFileInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    const files = target.files;
    if (files && files.length > 0) {
      this.fileToUpload = files.item(0);
    }
  }

  async getCalculatedOrders(){
    if(this.fileToUpload){
      let formData = new FormData();
      formData.append('file', this.fileToUpload);
      this.order = await this.orderService.GetOrderInfoFromFile(formData);
      console.log(this.order)
    }
  }
 
  public async uploadAndEmailOrder() {
    let formData = new FormData();

    // Assuming this.configService.orderInfo and this.order.vendorItems are arrays
    this.order.OrderInfo = await this.orderService.GetAllOrderInfo(); // Note the "Orders." prefix added here
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
    var file = this.excelService.convertToExcel(this.order, this.order.OrderInfo, vendorItems, 'calculatedOrders');
    formData.append('Attachment', file, 'calculatedOrders.xlsx');
  
    // Send email with formData
    await this.emailService.SendEmail(formData);
    this.toastr.success("Email Sent");
    this.router.navigate(['/home']);
    }

}
