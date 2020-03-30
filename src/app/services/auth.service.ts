import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { throwError, BehaviorSubject, Observable, } from 'rxjs';
import { User } from '../models/user.model';
import { map, catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public current_user: BehaviorSubject<User | null> = new BehaviorSubject(null);
  private api_url = environment.api_url;
  private token?: string;
  public logged_in = false;

  constructor(private http: HttpClient, private router: Router) {
    this.setCurrentUser();
  }


  setAPIOptions() {
    const httpOptions = {
      headers: new HttpHeaders({
        Accept: 'application/json;',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`

      })
    };
    return httpOptions;
  }





  // from an email and password get a token to use with the server
  login(email: string, password: string): Observable<boolean> {
    const options = this.setAPIOptions();
    const data = { attributes: { email: email, password: password } };
    const endpoint = `${this.api_url}/?route=user_tokens`;
    return this.http.post<{ jwt: string }>(endpoint, JSON.stringify(data), options).pipe(
      map(
        (response: { jwt: string }) => {
          const token: string = response && response.jwt;
          if (token) {
            this.saveTokenAsCookie(token);
            this.setCurrentUser();
            this.logged_in = true;
            return true;
          } else {
            return false;
          }
        }
      )
    );
  }



  register(email: string, username: string, password: string, password_confirmation: string): Observable<User> {
    const options = this.setAPIOptions();
    const data = {

      attributes: {
        email: email,
        username: username,
        password: password,
        password_confirmation: password_confirmation,
      }

    };
    const endpoint = `${this.api_url}/?route=users`;
    return this.http.post<User>(endpoint, data, options).pipe(
      map(res => new User(res))
    );
  }


  saveTokenAsCookie(token: string): void {
    this.token = token;
    this.setCookie(environment.cookie_name, token, environment.cookie_length_hours);
  }



  setTokenFromCookie(): void {
    this.token = this.getCookie(environment.cookie_name);
  }



  getUserFromToken(): Observable<User> {

    const options = this.setAPIOptions();
    const endpoint = `${this.api_url}/?route=users&id=me`;
    return this.http.get<User>(endpoint, options).pipe(
      catchError(this.handleError),
      map(res => new User(res))
    );

  }



  setCurrentUser(): void {
    if (typeof this.token !== 'string') {
      this.setTokenFromCookie();
    }

    if (typeof this.token === 'string') {
      this.getUserFromToken().subscribe(
        (user: User) => {
          if (user) {
            this.logged_in = true;
            this.current_user.next(user);
          }
        },
        (error) => console.log('error', (error))
      );
    }

  }




  logout(): void {
    // clear token remove admin from cookie to log admin out
    this.token = undefined;
    this.removeCookie(environment.cookie_name);
    this.current_user.next(null);
    this.logged_in = false;
    // go back to the homepage
    this.router.navigate(['/']);
  }




  updateUser(user: User): Observable<User> {
    const options = this.setAPIOptions();
    const data = {
      data: {
        attributes: {
          first_name: user.username,
          email: user.email
        }
      }
    };
    //  PATCH REQUEST TO SERVER WITH UPDATE USER DATA
    const endpoint = `${this.api_url}/users/${user.id}`;
    return this.http.patch<User>(endpoint, data, options).pipe(
      map(res => {
        const u = new User(res);
        this.current_user.next(u);
        return u;
      })
    );
  }


  updateUserPassword(user: User): Observable<User> {
    const options = this.setAPIOptions();
    const data = {
      data: {
        attributes: {
          password: user.password,
          password_confirmation: user.password_confirmation,
          current_password: user.current_password
        }
      }
    };
    //  PATCH REQUEST TO SERVER WITH UPDATE ADMIN DATA
    const endpoint = `${this.api_url}/users/me/update_password`;
    return this.http.patch<User>(endpoint, data, options).pipe(
      map(res => {
        const u = new User(res);
        this.current_user.next(u);
        return u;
      })

    );
  }


  resetPassword(email: string): Observable<boolean> {
    const options = this.setAPIOptions();
    const data = {
      data: {
        attributes: {
          email: email
        }
      }
    };
    const endpoint = `${this.api_url}/password/forgot`;
    return this.http.post(endpoint, data, options).pipe(
      map(() => true)
    );

  }




  set_new_password(password: string, password_confirmation: string, token: string): Observable<boolean> {
    const options = this.setAPIOptions();
    const data = {
      data: {
        attributes: {
          password: password,
          password_confirmation: password_confirmation,
          token: token
        }
      }
    };
    const endpoint = `${this.api_url}/password/reset`;
    return this.http.post(endpoint, JSON.stringify(data), options).pipe(
      map(() => true)
    );


  }



  setCookie(name: string, value: string, hours: number): void {
    let expires = '';
    if (hours) {
      const date = new Date();
      date.setTime(date.getTime() + (hours * 60 * 60 * 1000));
      expires = `; expires=` + date.toUTCString();
    }
    document.cookie = `${name}=${(value || '')}${expires};domain=${environment.cookie_domain};path=/`;
  }



  getCookie(name: string): string | undefined {
    const nameEQ = name + '=';
    const ca = document.cookie.split(';');

    for (let c of ca) {
      while (c.charAt(0) === ' ') {
        c = c.substring(1, c.length);
      }
      if (c.indexOf(nameEQ) === 0) {
        return c.substring(nameEQ.length, c.length);
      }
    }
    return undefined;
  }


  removeCookie(name: string): void {
    this.setCookie(name, '', -10000);
  }

  isLoggedIn(): boolean {
    this.setTokenFromCookie();
    return this.token !== undefined && this.token !== 'null';
  }



  public handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  }




}
