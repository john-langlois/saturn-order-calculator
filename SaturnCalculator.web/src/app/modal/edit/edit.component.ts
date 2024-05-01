import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.css'
})
export class EditComponent implements OnInit {

  @Input() obj:any;

  @Output() objSaved = new EventEmitter<any>();

  public objProperties: { key: string, value: string }[] = [];
  public objPropretyTypes: {key:string, value:string}[] = [];

  selectedType!: string;
  value: any;

  constructor(public modal:NgbActiveModal){

  }

  ngOnInit() {
    this.objProperties = Object.keys(this.obj).map((key:any) => ({ key, value:this.obj[key] }));
    this.objPropretyTypes = Object.keys(this.obj).map((key:any) => ({ key, value: (typeof this.obj[key]) }));

  }

  onTypeChange(): void {
    this.value = null;
  }

  public saveObj(){
    let modifiedObj:any = {};
    this.objProperties.forEach(item=>{
      modifiedObj[item.key] = item.value;
    })
    this.objSaved.emit(modifiedObj);
    this.modal.close();
  }


}
