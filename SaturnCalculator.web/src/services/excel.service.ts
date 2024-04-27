import { Injectable } from "@angular/core";
import * as XLSX from 'xlsx'; 


@Injectable({
	providedIn: "root"
})
export class ExcelService {
	constructor() { }

	convertToExcel(properties:any, lineItems:any, vendorItems:any, filename: string) {
		// Create workbook and worksheet
		const wb: XLSX.WorkBook = XLSX.utils.book_new();

		// Add Properties
		const propertiesData:any = [];
		properties.forEach((item:any) => {
		  propertiesData.push([item.key, item.value]);
		});
	
		// Add line items
		const headers = ['Serial No', 'Vendor Item Number', 'Shipped Quantity', 'Item Cost', 'Total Cost'];
		const lineItemsData = [headers];
		lineItems.forEach((item:any) => {
		  lineItemsData.push([item.serialNo, item.vendorItemNumber, item.shippedQuantity, item.itemCost, item.totalCost]);
		});

		// Add Vendor Items
		const vendorItemHeaders = ['Vendor Item Number', 'Total Quantity','Total Cost'];
		const vendorItemsData = [vendorItemHeaders];
		vendorItems.forEach((item:any) => {
		  vendorItemsData.push([item.vendorItemNumber, item.totalQuantity, item.totalCost]);
		});

		let appendedProperties = propertiesData.concat(lineItemsData);
		let allData = appendedProperties.concat(vendorItemsData);
	
		// Add line items to worksheet
		const allDataWs: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(allData);
		XLSX.utils.book_append_sheet(wb, allDataWs, 'All Data');
	
		// Save the workbook as an Excel file
		XLSX.writeFile(wb, filename + '.xlsx');
	  }
	
}