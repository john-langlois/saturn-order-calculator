import { Injectable } from "@angular/core";
import * as XLSX from 'xlsx'; 


@Injectable({
	providedIn: "root"
})
export class CSVService {
	constructor() { }

	exportToCSV(data: any[], filename: string) {
		const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
		const csvData: string = XLSX.utils.sheet_to_csv(ws);
		const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8' });
		const link = document.createElement('a');
    	link.href = URL.createObjectURL(blob);
    	link.download = filename + '.csv';
    	link.click();
	  }
}