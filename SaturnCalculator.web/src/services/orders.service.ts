import { Injectable } from "@angular/core";
import { Orders } from "../models/Orders";
import { lastValueFrom } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ConfigService } from "./config.service";

@Injectable({
	providedIn: "root"
})
export class OrdersService {
	constructor(private http: HttpClient,private configService:ConfigService) { }

    public APIURL: string = "http://localhost:5253";
    public DocumentPath: string = "/Users/johnlanglois/Downloads/OrderTest.xlsx";

	public GetOrderInfoFromFile() {
		return lastValueFrom(this.http.get<Orders>(this.APIURL +`/Orders/GetOrdersFromFile?filePath=${this.DocumentPath}`));
	}
}