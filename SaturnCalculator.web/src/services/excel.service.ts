import { Injectable } from "@angular/core";
import * as XLSX from 'xlsx'; 


@Injectable({
	providedIn: "root"
})
export class ExcelService {
	constructor() { }

	convertToExcel(data: any, filename: string) {
		// Create workbook and worksheet
		const wb: XLSX.WorkBook = XLSX.utils.book_new();
		const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet([]);
	
		// Add non-array key-value pairs
		let rowIndex = 0;
		for (const key in data) {
		  if (!Array.isArray(data[key])) {
			ws[XLSX.utils.encode_cell({ r: rowIndex, c: 0 })] = { t: 's', v: key };
			ws[XLSX.utils.encode_cell({ r: rowIndex, c: 1 })] = { t: 's', v: data[key] };
			rowIndex++;
		  }
		}
	
		// Add line items
		const headers = ['Serial No', 'Vendor Item Number', 'Shipped Quantity', 'Item Cost', 'Total Cost'];
		const lineItemsData = [headers];
		data.lineItems.forEach((item:any) => {
		  lineItemsData.push([item.serialNo, item.vendorItemNumber, item.shippedQuantity, item.itemCost, item.totalCost]);
		});
	
		// Add line items to worksheet
		const lineItemsWs: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(lineItemsData);
		XLSX.utils.book_append_sheet(wb, lineItemsWs, 'LineItems');
	
		// Add worksheet to workbook
		XLSX.utils.book_append_sheet(wb, ws, 'MetaData');
	
		// Save the workbook as an Excel file
		XLSX.writeFile(wb, filename + '.xlsx');
	  }
	
	  exportToExcel(data: any[], filename: string) {

		this.convertToExcel(data, filename);
	  }
}