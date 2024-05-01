import { Component, OnInit } from '@angular/core';
import { OrderInfo } from '../../models/OrderInfo';
import { OrdersService } from '../../services/orders.service';
import { ToastrService } from 'ngx-toastr';
import { ConfigService } from '../../services/config.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { EditComponent } from '../modal/edit/edit.component';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit {

  public orderInfoArr!:OrderInfo[];
  public isEditing:boolean = false;

  public editObj!:OrderInfo;

  constructor(private ordersService:OrdersService, private toast:ToastrService, private configService:ConfigService, private modalService:NgbModal){

  }

  public async ngOnInit() {
   await this.getSettings();
  }

  public async getSettings(){
    this.orderInfoArr = await this.ordersService.GetAllOrderInfo();
   //this.orderInfoArr = this.configService.orderInfo;
  }

  public openEditSetting(item:OrderInfo, isNew:boolean){
    this.isEditing = true;
    if(isNew){
      this.editObj = {id:0,jobNo:"",poNo:"",ppu:0,vendorItemNo:""};
    }
    else{
      this.editObj = item;
    }

    const modalRef = this.modalService.open(EditComponent,{centered:true, size:'lg'});

    modalRef.componentInstance.obj = this.editObj;
    modalRef.componentInstance.objSaved.subscribe(async (obj:any)=>{
      await this.saveSettings(obj);
    })
  }

  public async saveSettings(item:any){
    console.log(item)
    let res = await this.ordersService.UpsertOrderInfo(item);
    if(res > 0){
      this.toast.success("Setting Saved");
      this.getSettings();
    }
   }

}
