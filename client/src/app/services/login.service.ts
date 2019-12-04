import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { of, pipe } from 'rxjs';
import { map } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import  { config } from '../config'; 
@Injectable({
	providedIn: 'root'
})
export class LoginService {
	isLoggedIn: EventEmitter<any> = new EventEmitter<any>();
	private currentUserSubject: BehaviorSubject<any>;
	public currentUser: Observable<any>;
	constructor(public _http: HttpClient) {
		this.currentUserSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('currentUser')));
		this.currentUser = this.currentUserSubject.asObservable();
	}
	public get currentUserValue(): any {
        return this.currentUserSubject.value;
    }
	loginUser(body , flag){
		body['flag'] = flag;
		return this._http.post(  config.baseApiUrl+"user/login" , body)
		.pipe(map(user => {
			console.log("login user=========>", user);
			if (user) {
				localStorage.setItem('currentUser', JSON.stringify(user));
				this.isLoggedIn.emit('loggedIn');
				this.currentUserSubject.next(user);
			}

			return user;
		}));
	}
	getIpCliente(){
		console.log("called this ==+>");
		return this._http.get('https://api.ipify.org') 
	}
	logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
     	this.currentUserSubject.next(null);
     	
    }
}
