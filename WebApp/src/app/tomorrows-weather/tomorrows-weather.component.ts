import { Component, OnInit, Input } from '@angular/core';
import { City } from '../city';

@Component({
  selector: 'tomorrows-weather',
  templateUrl: './tomorrows-weather.component.html',
  styleUrls: ['./tomorrows-weather.component.css']
})
export class TomorrowsWeatherComponent implements OnInit {
  @Input() public CurrentCity: City;

  constructor() {
   
   }

  ngOnInit() {
  }

}
