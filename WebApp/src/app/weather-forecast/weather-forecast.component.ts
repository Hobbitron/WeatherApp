import { Component, OnInit, Input } from '@angular/core';
import { City } from '../city';

@Component({
  selector: 'weather-forecast',
  templateUrl: './weather-forecast.component.html',
  styleUrls: ['./weather-forecast.component.css']
})
export class WeatherForecastComponent implements OnInit {
  @Input() public CurrentCity: City;
  public dates: Array<string>;
  constructor() {
    this.dates = [];
    var date = new Date();
    let dow = date.getDay() + 1;
    for (let i = 0;i < 5;i++) {      
      switch (dow % 7) {
        case 0:
          this.dates.push("Sunday");
          break;
        case 1:
          this.dates.push("Monday");
          break;
        case 2:
          this.dates.push("Tuesday");
          break;
        case 3:
          this.dates.push("Wednesday");
          break;
        case 4:
          this.dates.push("Thursday");
          break;
        case 5:
          this.dates.push("Friday");
          break;
        case 6:
          this.dates.push("Saturday");
          break;
      }
      dow ++;
    }
   }

   ngOnInit() {

   }

}
