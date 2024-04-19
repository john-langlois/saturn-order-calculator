import { Component, OnInit } from '@angular/core';
import { OrdersService } from '../../services/orders.service';
import { Orders } from '../../models/Orders';
import * as XLSX from 'xlsx'; 
import { PDFService } from '../../services/pdf.service';
import { ExcelService } from '../../services/excel.service';
import { CSVService } from '../../services/csv.service';

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
    private csvService:CSVService
    ) { }

  async ngOnInit() {
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

  exportToCSV() {
    this.csvService.exportToCSV(this.order as any, 'calculatedOrders');
  }
 
  exportToExcel() {
    this.excelService.exportToExcel(this.order as any, 'calculatedOrders');
  }

  exportToPDF() {
    this.pdfService.exportToPDF(this.order as any, 'calculatedOrders');
  }

}
