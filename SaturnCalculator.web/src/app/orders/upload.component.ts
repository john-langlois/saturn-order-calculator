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
    let res = await this.orderService.UpsertOrders(this.order);
    let formData = new FormData();
    
    if(res > 0){
      this.toastr.success("Order Uploaded");
      this.router.navigate(['/home']);
      Object.keys(this.order).forEach(key =>{
        formData.append('Orders.' + key, this.order[key as keyof Orders] as string);
      });

      let partInfo = await this.orderService.GetAllOrderInfo();
  
      var file = this.excelService.convertToExcel(this.order, partInfo, this.order.vendorItems ,'calculatedOrders');
      
      formData.append('Attachment', file);
      

      await this.emailService.SendEmail(formData);
    }
  }

}
