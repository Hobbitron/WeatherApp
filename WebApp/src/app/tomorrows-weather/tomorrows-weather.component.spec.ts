import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TomorrowsWeatherComponent } from './tomorrows-weather.component';

describe('TomorrowsWeatherComponent', () => {
  let component: TomorrowsWeatherComponent;
  let fixture: ComponentFixture<TomorrowsWeatherComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TomorrowsWeatherComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TomorrowsWeatherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
