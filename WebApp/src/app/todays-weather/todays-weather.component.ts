import { Component, OnInit, Input } from '@angular/core';
import { City } from '../city';

@Component({
  selector: 'todays-weather',
  templateUrl: './todays-weather.component.html',
  styleUrls: ['./todays-weather.component.css']
})
export class TodaysWeatherComponent implements OnInit {
  @Input() public CurrentCity: City;
  constructor() { }

  ngOnInit() {
  }

}
