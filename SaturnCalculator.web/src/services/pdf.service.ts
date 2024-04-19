import { Injectable } from "@angular/core";


@Injectable({
	providedIn: "root"
})
export class PDFService {
	constructor() { }

	exportToPDF(data: any, filename: string) {
		const header = Object.keys(data);
		const rows = data.map((obj:any) => header.map(key => obj[key]));
	
		const docDefinition = {
		  content: [
			{
			  table: {
				headerRows: 1,
				widths: Array(header.length).fill('*'),
				body: [header, ...rows]
			  }
			}
		  ]
		};
	
		// Convert the HTML to a Blob
		const blob = new Blob([document.documentElement.outerHTML], { type: 'application/pdf' });
	
		// Create a download link and trigger the download
		const link = document.createElement('a');
		link.href = URL.createObjectURL(blob);
		link.download = filename + '.pdf';
		link.click();
	  }
}