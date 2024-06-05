import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss'
})
export class PaginationComponent {

  @Input() pageConfig:any;
  @Output() pageChange: EventEmitter<any> = new EventEmitter();
  @Output() pageSizeChange: EventEmitter<any> = new EventEmitter();

  public totalPages!:number;
  public pageNumbers!:any[];

  public currentPageNo = 1;
  public currentPageSize = 10;

  constructor(
    ){}

  async ngOnInit() {
    this.getPageNumbers();
  }

  getPageNumbers(){
    this.totalPages = Math.ceil(this.pageConfig.total / this.pageConfig.pageSize);
    const start = Math.max(Math.min(this.currentPageNo - Math.floor(this.pageConfig.pageSize / 2), this.totalPages - this.pageConfig.pageSize + 1), 1);
    const end = Math.min(start + this.pageConfig.pageSize - 1, this.totalPages);
    this.pageNumbers = Array.from({ length: end - start + 1 }, (_, index) => start + index);
  }

  goToPage(pageNumber: number): void {
    if(pageNumber == this.currentPageNo){
      return;
    }
    this.currentPageNo = pageNumber;
    this.pageChange.emit(pageNumber)
  }

  public changePageSize(){
    this.getPageNumbers();
    this.pageSizeChange.emit(this.pageConfig);
  }
}
