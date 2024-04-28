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
	
		// INVOICE SHEET
		const invoiceHeaders = ['CNTBTCH','CNTITEM','IDCUST','IDINV','IDSHPT','SPECINST','TEXTTRX','IDTRX','ORDRNBR','CUSTPO','INVDESC','DATEINVC','CODECURN','EXCHRATEHC','TERMCODE','INVCTYPE'];
		const invoiceData = [invoiceHeaders];
		lineItems.forEach((item:any) => {
			invoiceData.push([item.serialNo, item.vendorItemNumber, item.shippedQuantity, item.itemCost, item.totalCost]);
		});

		// Add Vendor Items
		const invoiceDetailsHeader = ['CNTBTCH','CNTITEM','CNTLINE','IDITEM','IDDIST','TEXTDESC','UNITMEAS','QTYINVC','AMTCOST','AMTPRIC','AMTEXTN','AMTCOGS','COMMENT'];
		const invoiceDetailsData = [invoiceDetailsHeader];
		vendorItems.forEach((item:any) => {
			invoiceDetailsData.push([0,1,item.totalQuantity,item.vendorItemNumber, item.vendorItemNumber,'',0,(item.totalCost/item.totalQuantity)]);
		});

		// Add Vendor Items
		const invoicePaymentHeader = ['CNTBTCH','CNTITEM','IDITEM','IDDIST','TEXTDESC','UNITMEAS','QTYINVC','AMTCOST','AMTPRIC','AMTEXTN','AMTCOGS','COMMENT'];
		const invoicePaymentData = [invoiceDetailsHeader];
		vendorItems.forEach((item:any) => {
			invoicePaymentData.push([item.vendorItemNumber, item.totalQuantity, item.totalCost]);
		});

		
	
		// Add line items to worksheet
		const invoices: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(invoiceData);
		XLSX.utils.book_append_sheet(wb, invoices, 'Invoices');

		const invoiceDetails: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(invoiceDetailsData);
		XLSX.utils.book_append_sheet(wb, invoiceDetails, 'Invoice_Details');

		const invoicePaymentSchedules: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(invoicePaymentData);
		XLSX.utils.book_append_sheet(wb, invoicePaymentSchedules, 'Invoice_Payment_Schedules');
	
		// Save the workbook as an Excel file
		XLSX.writeFile(wb, filename + '.xlsx');
	  }
	
}