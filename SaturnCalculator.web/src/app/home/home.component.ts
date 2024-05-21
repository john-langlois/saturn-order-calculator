import { Component, OnInit } from '@angular/core';
import { OrdersService } from '../../services/orders.service';
import { Orders } from '../../models/Orders';
import * as XLSX from 'xlsx'; 
import { PDFService } from '../../services/pdf.service';
import { ExcelService } from '../../services/excel.service';
import { CSVService } from '../../services/csv.service';
import { ConfigService } from '../../services/config.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  fileToUpload: File | null = null;

  public order!:Orders;

  constructor(
    private orderService:OrdersService,
    private pdfService:PDFService,
    private excelService:ExcelService,
    private csvService:CSVService,
    private configService:ConfigService
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
 
  public async exportToExcel() {

    let partInfo = await this.orderService.GetAllOrderInfo();
    
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
