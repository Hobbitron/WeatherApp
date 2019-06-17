// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  weatherAPIKey: "75fe21aa692702e9054964d0c336bad7",
  weatherAPIBaseURL: "http://api.openweathermap.org/data/2.5/",
  localWeatherAPIURL: "http://10.0.0.181:5000/api/",
  googleMapsAPIKey: "AIzaSyBU-PSs6b6wCcY2SrhML_HtfD8jGUr1Z7g"
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
