import 'rxjs/Rx';
import { DomSanitizer } from '@angular/platform-browser';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AlertController } from 'ionic-angular';

@Injectable()
export class APIService
{
    public loggedInUser:any;
    
    public readonly API_SERVER  = 'https://artnest-umn.000webhostapp.com/API/';
    public readonly API_IONIC_SERVER  = 'https://artnest-umn.000webhostapp.com/API_IONIC/';

    public readonly USERS_REGISTER      = this.API_SERVER + 'RegisterUser/';
    public readonly USERS_LOGIN         = this.API_SERVER + 'LoginUser/';
    public readonly USERS_DATA          = this.API_SERVER + 'LoadSingleUserData/';
    public readonly USERS_UPDATE        = this.API_IONIC_SERVER + 'UpdateUserData/';

    public readonly ARTIST_REGISTER     = this.API_IONIC_SERVER + 'BecomeArtist/';
    public readonly ARTIST_DATA_ALL     = this.API_SERVER + 'ShowAllArtist/';
    public readonly ARTIST_DATA_SINGLE  = this.API_SERVER + 'LoadArtistData/';
    public readonly ARTIST_UPDATE       = this.API_IONIC_SERVER + 'UpdateArtistData/';

    public readonly CATEGORY_ALL        = this.API_SERVER + 'GetAllCategories/';
    public readonly CATEGORY_AVAILABLE  = this.API_SERVER + 'GetAvailableCategory/';
    public readonly CATEGORY_ADD        = this.API_SERVER + 'UpdateAddCategory/';
    public readonly CATEGORY_DELETE     = this.API_SERVER + 'UpdateDeleteCategory/';

    public readonly ARTWORK_DATA_ALL    = this.API_SERVER + 'ShowAllArtworks/';
    public readonly ARTWORK_DATA_SINGLE = this.API_SERVER + 'LoadArtworkData/';
    public readonly ARTWORK_ADD         = this.API_IONIC_SERVER + 'AddNewArtwork/';
    public readonly ARTWORK_DELETE      = this.API_SERVER + 'DeleteArtwork/';
    public readonly ARTWORK_UPDATE      = this.API_SERVER + 'UpdateArtworkData/';

    public readonly REQUEST_DATA_ALL    = this.API_SERVER + 'ShowAllRequest/';
    public readonly REQUEST_DATA_SINGLE = this.API_SERVER + 'LoadCommissionData/';
    public readonly REQUEST_ADD         = this.API_IONIC_SERVER + 'AddNewCommission/';
    public readonly REQUEST_RESPONSE    = this.API_SERVER + 'RespondToCommission/';

    public readonly UTIL_SEARCH         = this.API_SERVER + 'SeachData/';

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