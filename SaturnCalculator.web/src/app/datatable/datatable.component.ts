import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Subject, debounceTime } from 'rxjs';
import { PaginationComponent } from './pagination/pagination.component';
import { formatDateyyyymmdd } from '../sharedUtils';

@Component({
  selector: 'app-datatable',
  templateUrl: './datatable.component.html',
  styleUrl: './datatable.component.scss'
})
export class DatatableComponent implements OnInit, OnChanges {
  @ViewChild(PaginationComponent) pagination!:PaginationComponent;

  @Input() dataArray:any[] = [];
  @Input() dataColumns:any[] = [];
  @Input() options:any = {};
  @Input() caption:string = '';

  public sortDir:string = 'asc';
  public sortedCol!:string | null;

  public selectedItem:any = null;

  @Output() selectedItemChange = new EventEmitter<any>();
  @Output() fetchPageData = new EventEmitter<any>();
  @Output() fetchPageSizeChange = new EventEmitter<any>();
  @Output() searchParamChange = new EventEmitter<any>();

  private searchSubject = new Subject<string>();
  private readonly debounceTimeMs = 300;

  constructor(){

  }

  ngOnInit(): void {
    this.searchSubject.pipe(debounceTime(this.debounceTimeMs)).subscribe(() => {
      this.applyFilter();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['dataArray'] && !changes['dataArray'].firstChange && changes['dataArray'].previousValue != changes['dataArray'].currentValue){
      this.pagination.getPageNumbers();
    }
  }

  public ngOnDestroy() {
    this.searchSubject.complete();
  }

  public getInputSearch(value:any, key:any){
    if(value == ""){
      this.options[key] = null;
    }
    this.searchSubject.next(this.options);
  }

  public applyFilter(){
    this.searchParamChange.emit(this.options);
  }

  public async pageChange(pageNo:number){
   this.fetchPageData.emit(pageNo);
  }

  public pageSizeChange(options:any){
    this.fetchPageSizeChange.emit(options);
  }

  toggleSelection(item: any) {
    if (!this.selectedItem || this.selectedItem !== item) {
      this.selectedItem = item;
      this.selectedItemChange.emit(item);
      return;
    }
    this.selectedItem = null;
    this.selectedItemChange.emit(this.selectedItem);
  }

   public formatDate(date:string | Date){
    return formatDateyyyymmdd(date)
   }

  isSelected(item: any): boolean {
    return this.selectedItem == item;
  }

  public sortColumns(col:string){
    if(this.sortedCol != col){
      this.sortDir = 'asc';
    }
    this.sortedCol = col;
    if(this.sortDir == 'asc'){
      this.sortDir = 'desc';
      this.dataArray.sort((a,b) => (typeof a[col] == 'number') ?  b[col] - a[col] : a[col].localeCompare(b[col]));
      return;
    }
    this.sortDir = 'asc';
    this.dataArray.sort((a,b)=>  (typeof a[col] == 'number') ?  a[col] - b[col] : b[col].localeCompare(a[col]));
  }

  public cancelSort(){
    this.sortedCol = null;
    this.sortDir = 'asc';
  }
}
