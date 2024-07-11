import { Injectable } from "@angular/core";
import { findIndex } from "rxjs";
import * as XLSX from 'xlsx'; 
import { Orders } from "../models/Orders";
import { OrderInfo } from "../models/OrderInfo";


@Injectable({
	providedIn: "root"
})
export class ExcelService {
	constructor() { }

	convertToExcel(properties: Orders, orderInfo: OrderInfo[], vendorItems: any, filename: string): Blob {
		// Create workbook and worksheet
		const wb: XLSX.WorkBook = XLSX.utils.book_new();

		// INVOICE SHEET
		const invoiceHeaders = ["CNTBTCH", "CNTITEM", "IDCUST", "IDINVC", "IDSHPT", "SPECINST", "TEXTTRX", "IDTRX", "ORDRNBR", "CUSTPO", "INVCDESC", "DATEINVC", "CODECURN", "EXCHRATEHC", "TERMCODE", "INVCTYPE"];
		const invoiceData = [invoiceHeaders];
		invoiceData.push(["0", "1", "", properties.billLandingNo.replace("SH", "IN"), properties.billLandingNo.replace("SH", "IN"), `BOL #: ${properties.billLandingNo}`, "1", "14", "", `PO # ${properties.poNumber}`, "", `${properties.shipDate}`, "", "0", "", "0"]);

		// Invoice Details
		const invoiceDetailsHeader = ["CNTBTCH", "CNTITEM", "CNTLINE", "IDITEM", "IDDIST", "TEXTDESC", "UNITMEAS", "QTYINVC", "AMTCOST", "AMTPRIC", "AMTEXTN", "AMTCOGS", "COMMENT"];
		const invoiceDetailsData = [invoiceDetailsHeader];
		orderInfo.forEach((orderInfo: OrderInfo) => {
			vendorItems.forEach((item: any) => {
				if (item.vendorItemNumber.includes(orderInfo.partNo)) {
					invoiceDetailsData.push([0, 1, item.totalQuantity, "", "", `${item.vendorItemNumber}, ${item.totalQuantity} Pcs, Part Name${orderInfo.partName}`, `${item.vendorItemNumber}, ${item.totalQuantity} Pcs, Part Name: ${orderInfo.partName}`, 0, 0, 0, item.totalCost, 0, `Job #: ${orderInfo.jobNo}, U/P: ${orderInfo.ppu}`]);
				}
			});
		});

		// Invoice Payment Schedules
		const invoicePaymentHeader = ["CNTBTCH", "CNTITEM", "CNTPAYM", "DATEDUE", "AMTDUE", "DATEDISC", "AMTDISC", "AMTDUEHC", "AMTDISCHC"];
		const invoicePaymentData = [invoicePaymentHeader];
		invoicePaymentData.push(["0", "1", "1", "", properties.orderCost, "", properties.orderCost, "", properties.orderCost]);

		// Add line items to worksheet
		const invoices: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(invoiceData);
		XLSX.utils.book_append_sheet(wb, invoices, 'Invoices');

		const invoiceDetails: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(invoiceDetailsData);
		XLSX.utils.book_append_sheet(wb, invoiceDetails, 'Invoice_Details');

		const invoicePaymentSchedules: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(invoicePaymentData);
		XLSX.utils.book_append_sheet(wb, invoicePaymentSchedules, 'Invoice_Payment_Schedules');

		// Define named ranges
		const namedRanges = [
			{ name: 'Invoices', sheet: 'Invoices', ref: XLSX.utils.encode_range({ s: { c: 0, r: 0 }, e: { c: invoiceHeaders.length - 1, r: invoiceData.length - 1 } }) },
			{ name: 'Invoice_Details', sheet: 'Invoice_Details', ref: XLSX.utils.encode_range({ s: { c: 0, r: 0 }, e: { c: invoiceDetailsHeader.length - 1, r: invoiceDetailsData.length - 1 } }) },
			{ name: 'Invoice_Payment_Schedules', sheet: 'Invoice_Payment_Schedules', ref: XLSX.utils.encode_range({ s: { c: 0, r: 0 }, e: { c: invoicePaymentHeader.length - 1, r: invoicePaymentData.length - 1 } }) }
		];

		// Add named ranges to the workbook
		if (!wb.Workbook) wb.Workbook = { Names: [] };
		wb.Workbook.Names = namedRanges.map(range => ({
			Name: range.name,
			Ref: `'${range.sheet}'!${range.ref}`
		}));

		// Save the workbook as an Excel file
		const fileBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
		const fileBlob = new Blob([fileBuffer], { type: 'application/octet-stream' });

		return fileBlob;
	}
}