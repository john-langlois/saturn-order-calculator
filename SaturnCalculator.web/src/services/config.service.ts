import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { lastValueFrom, Observable } from "rxjs";
import { environment } from "../environments/environment";
import { Config } from "../models/Config";
import { Orders } from "../models/Orders";
import { OrderInfo } from "../models/OrderInfo";

@Injectable({
	providedIn: "root"
})
export class ConfigService {
	private readonly configFilePath: string;
	private config: Observable<Config>;

	public APIURL!: string;
	public order!: Orders;
	public orderInfo!:OrderInfo[];

	constructor(private http: HttpClient) {
		if (environment.production) {
			this.configFilePath = "assets/config.json";
		} else {
			this.configFilePath = "assets/config.dev.json";
		}

		this.config = this.http.get<Config>(this.configFilePath);
	}

	public init() {
		return (): Promise<void> => new Promise(async (resolve, reject) => {
			try {
				let data = await lastValueFrom(this.config);
				this.APIURL = data.APIURL;
				this.order =data.Order;
				this.orderInfo = data.OrderInfo;
				resolve();
			} catch {
				reject();
			}
		});
	}
}