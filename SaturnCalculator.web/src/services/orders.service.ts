import { Injectable } from "@angular/core";
import { Orders } from "../models/Orders";
import { lastValueFrom } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ConfigService } from "./config.service";
import { OrderInfo } from "../models/OrderInfo";

@Injectable({
	providedIn: "root"
})
export class OrdersService {
	constructor(private http: HttpClient,private configService:ConfigService) { }

	public GetOrderInfoFromFile(file:FormData) {
		return lastValueFrom(this.http.post<Orders>(this.configService.APIURL +`/Orders/GetOrdersFromFile`,file));
	}

	public GetAllOrderInfo() {
		return lastValueFrom(this.http.get<OrderInfo[]>(this.configService.APIURL +`/Orders/GetAllOrderInfo`));
	}

	public UpsertOrderInfo(ins:OrderInfo) {
		return lastValueFrom(this.http.post<any>(this.configService.APIURL +`/Orders/UpsertOrderInfo`,ins));
	}
}