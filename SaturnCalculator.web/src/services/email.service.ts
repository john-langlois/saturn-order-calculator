import { Injectable } from "@angular/core";
import { Orders } from "../models/Orders";
import { lastValueFrom } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ConfigService } from "./config.service";
import { OrderInfo } from "../models/OrderInfo";

@Injectable({
	providedIn: "root"
})
export class EmailService {
	constructor(private http: HttpClient,private configService:ConfigService) { }

	public SendEmail(file:FormData) {
		return lastValueFrom(this.http.post<Orders>(this.configService.APIURL +`/Email/SendEmail`,file));
	}


}