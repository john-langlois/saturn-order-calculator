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

  public orders:Orders[] = [];

  public selectedItem!:number;

  public pageConfig:any = {
    pageNo:1,
    pageSize:15,
    total:0
  };

  public dataColumns:any[]=[
    {name:"PO Number",source:"poNumber", type:"text"},
    {name:"Trading Partner",source:"tradingPartner", type:"text"},
    {name:"Bill Landing No",source:"billLandingNo", type:"text"},
    {name:"Tracking No",source:"trackingNo", type:"text"},
    {name:"Ship Date",source:"shipDate", type:"text"},
    {name:"Ship Time",source:"shipTime", type:"text"},
    {name:"Package Type",source:"packageType", type:"text"},
    {name:"Total Package Count",source:"totalPackageCount", type:"text"},
    {name:"Order Quantity",source:"orderQuantity", type:"text"},
    {name:"Order Cost",source:"orderCost", type:"text"}
  ];

  constructor(
    private orderService:OrdersService
    ) { }

  public async ngOnInit() {
    await this.getOrders();
  }

  public async getOrders(){
    this.orders = await this.orderService.GetAllOrders();
    this.pageConfig.total = this.orders.length;
  }

  public toggleSelectedItem(id:number){
    this.selectedItem = id;
  }
  

}
