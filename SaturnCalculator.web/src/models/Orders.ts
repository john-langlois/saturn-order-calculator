import { LineItems } from "./LineItems";
import { OrderInfo } from "./OrderInfo";
import { VendorItems } from "./VendorItems";

export interface Orders{
    id:number;
    tradingPartner:string;
    poNumber:string;
    trailerNumber:string;
    billLandingNo:string;
    trackingNo:string;
    shipToCode:string;
    carrierCode:string;
    shipDate:string;
    shipTime:string;
    weight:string;
    packageType:string;
    totalPackageCount:string;
    orderQuantity:string;
    orderCost:string;
    lineItems: LineItems[];
    vendorItems: VendorItems[];
    OrderInfo: OrderInfo[];
}