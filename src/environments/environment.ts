// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  site_name: `Chatterbox`,
  api_url: 'http://localhost/chatterbox_api',
  front_url: 'http://localhost:1234/',
  cookie_domain: 'localhost',
  cookie_length_hours: 50,
  cookie_name: 'token_local_chat',
  cache_duration: 60000, // time to hold resources from API in cache in milliseconds
  upload_file_limit_bytes: 1024 * 1024 * 10, // 10 mb,
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
