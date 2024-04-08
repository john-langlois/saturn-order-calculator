import { LineItems } from "./LineItems";

export interface Orders{
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
    lineItems: LineItems[]
}