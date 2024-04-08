import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ConfigService } from "./config.service";

const PostRequestOptions = { headers: new HttpHeaders({ "Content-Type": "application/json" }) };
const GetRequestOptions = { withCredentials: true };

@Injectable({
	providedIn: "root"
})
export class SharedService {
	constructor(private http: HttpClient, private configService: ConfigService) { }

	public get<T>(endpoint: string): Observable<T> {
		return this.http.get<T>(this.configService.APIURL + endpoint, GetRequestOptions);
	}

	public upsert<T>(endpoint: string, insert: T) {
		return this.http.post<any>(this.configService.APIURL + endpoint, insert, PostRequestOptions);
	}
}