import { Injectable } from '@angular/core';
// we use this service to get access to the window property
// eg to use window.print()

function _window(): any {
  // return the global native browser window object
  return window;
}
@Injectable({
  providedIn: 'root'
})
export class WinrefService {
  get nativeWindow(): any {
    return _window();
  }



}
