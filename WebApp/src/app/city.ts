import { HttpClient } from "@angular/common/http";
import { environment } from "../environments/environment"
import { Subject, Observable } from 'rxjs';
export class City {
    public id: number;
    public name: string;
    public country: string;
    public lat: number;
    public lon: number;
    public currentTemperature: number;
    public currentMaxTemperature: number;
    public currentMinTemperature: number;
    public currentHumidity: number;
    public currentDescription: string;
    public currentIcon: string;
    // public conditions: string;
    // public cloudy: boolean;
    public futureTemperature: Array<number> = [];
    public futureMaxTemperature: Array<number> = [];
    public futureMinTemperature: Array<number> = [];
    public futureHumidity: Array<number> = [];
    public futureIcon: Array<string> = [];

    public static GetCities(http: HttpClient, lat?: number, long?: number): Observable<Array<string>> {
        let sub = new Subject();     
        http.get(environment.localWeatherAPIURL + "cities").subscribe((cities: Array<string>) => {
            sub.next(cities);
            sub.complete();
        })
        return <Observable<Array<string>>>sub.asObservable();
    }

    public static GetCitiesByLatLong(http: HttpClient, lat: number, long: number): Observable<Array<City>>
    {
        let sub = new Subject();
        http.get(environment.localWeatherAPIURL + "cities?latitude="+lat+"&longitude="+long).subscribe((cities) => {
            let returnlist = new Array<City>();
            let citiesJSON = JSON.parse(cities[0]);
            for (var city in citiesJSON)
            {
                let c = new City();
                Object.assign(c,citiesJSON[city]);
                returnlist.push(c);
            }
            sub.next(returnlist);
            sub.complete();
        })  
        return <Observable<Array<City>>>sub.asObservable();
    }

    public load(http: HttpClient, cityname: string) : Observable<City>
    {        
        let sub = new Subject();
        if (!cityname)
        {
            sub.next(new City());
            sub.complete();
            return <Observable<City>>sub.asObservable();
        }
        http.get(environment.localWeatherAPIURL + "cities/"+cityname).subscribe((cities) => {            
            let c = new City();
            if (cities) {
                Object.assign(c,cities[0]);         
            }
            sub.next(c);
            sub.complete();
        })  
        return <Observable<City>>sub.asObservable();
    }
    public GetCurrentWeather(http: HttpClient)//: Observable<any>
    {
        //api.openweathermap.org/data/2.5/forecast?id=
        //api.openweathermap.org/data/2.5/weather?id=2172797
        return http.get(environment.localWeatherAPIURL+"cities/"+this.id+"/current").subscribe((resp: any) => {
            this.currentTemperature = resp.main.temp;
            this.currentMinTemperature = resp.main.temp_min;
            this.currentMaxTemperature = resp.main.temp_max;      
            this.currentDescription = resp.weather[0].description;
            this.currentHumidity = resp.main.humidity;   
            this.currentIcon = "http://openweathermap.org/img/w/"+resp.weather[0].icon+".png";   
          });
    }
    public GetFiveDayForecast(http: HttpClient)//: Observable<any>
    {
        //api.openweathermap.org/data/2.5/forecast?id=
        //api.openweathermap.org/data/2.5/weather?id=2172797
        return http.get(environment.localWeatherAPIURL+"cities/"+this.id+"/forecast").subscribe((resp: any) => {            
            this.futureTemperature = [];
            var ignoreFirst = false;
            var startDate = new Date();
            var curDate = new Date(resp.list[0].dt_txt);            
            var curTemp = 0;
            var minTemp = 200;
            var maxTemp = 0;
            var humidity = 0;
            var count = 0;
            for (var i in resp.list) {
                var row = resp.list[i];
                var rowdate = new Date(row.dt_txt);
                if (startDate.setHours(0,0,0,0) === rowdate.setHours(0,0,0,0)) {
                    curDate = rowdate;
                    ignoreFirst = true;
                    continue;
                }                                
                if (curDate.setHours(0,0,0,0) === rowdate.setHours(0,0,0,0) || ignoreFirst) {
                    curTemp += row.main.temp;
                    humidity += row.main.humidity;
                    maxTemp = Math.max(maxTemp,row.main.temp_max);
                    minTemp = Math.min(minTemp,row.main.temp_min);
                    count++;
                    if (ignoreFirst) {
                        curDate = rowdate;
                        ignoreFirst = false;
                    }
                } else {
                    this.futureTemperature.push(parseFloat((curTemp/count).toFixed(2)));
                    this.futureHumidity.push(parseFloat((humidity/count).toFixed(0)));
                    this.futureMaxTemperature.push(maxTemp);
                    this.futureMinTemperature.push(minTemp);
                    this.futureIcon.push("http://openweathermap.org/img/w/"+row.weather[0].icon+".png");
                    count = 1;
                    humidity = row.main.humidity;
                    curTemp = row.main.temp;
                    maxTemp = row.main.temp_max;
                    minTemp = row.main.temp_min;
                    curDate = rowdate;                 
                }
            }
            this.futureTemperature.push(parseFloat((curTemp/count).toFixed(2)));
            this.futureHumidity.push(parseFloat((humidity/count).toFixed(0)));
            this.futureMaxTemperature.push(maxTemp);
            this.futureMinTemperature.push(minTemp);
            this.futureIcon.push("http://openweathermap.org/img/w/"+row.weather[0].icon+".png");
        });
    }

    private getWeatherDescription(id: number, description: string): string
    {
        var desc = description;
        if (id < 300) {

        }
        return desc;
    }
}
