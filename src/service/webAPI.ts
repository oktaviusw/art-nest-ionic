import 'rxjs/Rx';
import { DomSanitizer } from '@angular/platform-browser';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AlertController } from 'ionic-angular';

@Injectable()
export class APIService
{
    public readonly API_SERVER  = 'https://artnest-umn.000webhostapp.com/API/'

    public readonly USERS_REGISTER  = this.API_SERVER + 'RegisterUser/';
    public readonly USERS_LOGIN     = this.API_SERVER + 'LoginUser/';

    constructor(private _sanitizer: DomSanitizer, private http: HttpClient, private alertCtrl: AlertController){

    }

    public postAPI(api, data): Observable<any>
    {
        let body:any = new FormData();
        let headers:any = new Headers({ 'Content-Type': 'multipart/form-data' });
        for(let key in data) { 
            body.append(key, data[key]); 
        }
        return this.http.post(api, body, headers).map(
            response => { return response; }
        );
    }

    public getAPI(api): Observable<any>
    {
        return this.http.get(api).map(
            response => { return response; }
        );
    }

    public saveAccount(data)
    {
        let credentials = localStorage.getItem('artnest');
        if (!credentials)
        {
            localStorage.setItem('artnest', JSON.stringify({'accounts' : data}));
        }
        else
        {
            credentials = JSON.parse(credentials);
            credentials['accounts'] = data;
            localStorage.setItem('artnest', JSON.stringify(credentials));
        }
    }

    public display500Error()
    {
        let alert = this.alertCtrl.create({
            title: 'Internal Server Error',
            subTitle: 'It seems that we\'ve encountered a problem. Please try again later.',
            buttons: ['Dismiss']
        });
        alert.present();
    }

    public sanitize(image) { return this._sanitizer.bypassSecurityTrustStyle(`url(${image})`); }
}