import { OrderInfo } from "./OrderInfo";
import { Orders } from "./Orders";

export interface Config {
	APIURL: string;
	Order:Orders;
	OrderInfo:OrderInfo[];
}