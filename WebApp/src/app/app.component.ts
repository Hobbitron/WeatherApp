import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment} from "../environments/environment"
import { FormControl } from "@angular/forms"
import { City } from "./city";
import { Observable } from "rxjs";
import {map, startWith} from 'rxjs/operators';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  cityCtrl = new FormControl();
  title = 'WeatherApp';
  public cities: Array<string> = new Array();
  public localCities: Array<City>;
  public filteredCities: Observable<Array<string>>;
  public currentCity: City;
  public mapsCityName: any;
  constructor(private http: HttpClient)
  {
    this.filteredCities = this.cityCtrl.valueChanges
      .pipe(
        startWith(''),
        map(city => city ? this._filterStates(city) : this.cities.slice(0,50))
      );
    this.cityCtrl.valueChanges.subscribe(cityname => {
      let city = new City();
      city.load(this.http, cityname).subscribe(newcity => {
        if (newcity.id) {
          this.SetCurrentCity(newcity);          
        }
      });
    })
  }
  // ngOnInit() {
  //   if(window.navigator.geolocation){
  //     window.navigator.geolocation.getCurrentPosition((a: Position) => {
  //       this.http.get("https://maps.googleapis.com/maps/api/geocode/json?latlng="+a.coords.latitude+","+a.coords.longitude+"&sensor=true&key="+environment.googleMapsAPIKey).subscribe((city) => {
  //         console.log(city);
  //       })                    
  //       });
  //     };    
  //   this.http.get(environment.localWeatherAPIURL + "cities").subscribe((cities: Array<string>) => {
  //     this.cities = cities;
  //   })
  // }
  ngOnInit() {
    if(window.navigator.geolocation) {
      window.navigator.geolocation.getCurrentPosition((a: Position) => {
        let dataLoaded = false;
        City.GetCitiesByLatLong(this.http, a.coords.latitude,a.coords.longitude).subscribe(localCities => {
          this.localCities = localCities;
          if (!dataLoaded) {
            dataLoaded = true;
          } else {
            this.SetCurrentCity();
          }
        })
        this.http.get("https://maps.googleapis.com/maps/api/geocode/json?latlng="+a.coords.latitude+","+a.coords.longitude+"&sensor=true&key="+environment.googleMapsAPIKey).subscribe((city: any) => {
           for (var key in city.results) {
             if (city.results[key].types.indexOf("locality") > -1)
             {
              this.mapsCityName = city.results[key].formatted_address.split(",")[0];
             }                          
           }
           console.log(city);
           if (!dataLoaded) {
             dataLoaded = true;             
           } else {
             this.SetCurrentCity();
           }
         })                           
      })
    }
    City.GetCities(this.http).subscribe((cities: Array<string>) => {
      this.cities = cities;
    })            
  }
  
  public SetCurrentCity(newCity?: City) {    
    if (!newCity) {
      for (var city in this.localCities) {
        let c = this.localCities[city];
        if (c.name.toLocaleLowerCase() === this.mapsCityName.toLocaleLowerCase()) {
          this.currentCity = c;
          this.cityCtrl.setValue(this.currentCity.name);
        }
      }
      if (!this.currentCity)
      {
        this.currentCity = this.localCities[0];
        this.cityCtrl.setValue(this.currentCity.name);
      }
    } else {
      this.currentCity = newCity;
    }
    this.currentCity.GetCurrentWeather(this.http);
    this.currentCity.GetFiveDayForecast(this.http);    
  }

  private _filterStates(value: string): string[] {
    if (!value)
      return this.cities;

    const filterValue = value.toLowerCase();
    let filteredlist = this.cities.filter(city => city.toLowerCase().indexOf(filterValue) === 0).slice(0,50);
    return filteredlist;
  }
}
