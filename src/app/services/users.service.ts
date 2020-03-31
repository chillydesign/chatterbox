import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UsersService {


  private api_url = environment.api_url;

  constructor(private http: HttpClient, private authService: AuthService) { }


  getUsers(): Observable<User[]> {


    const options = this.authService.setAPIOptions();
    const endpoint = `${this.api_url}/?route=users`;

    return this.http.get<User[]>(endpoint, options).pipe(
      catchError(this.authService.handleError),
      map(res => res.map((p: User) => new User(p)))
    );

  }

  updateUserApproval(user: User): Observable<User> {
    const options = this.authService.setAPIOptions();
    const endpoint = `${this.api_url}/?route=users&id=${user.id}&setapproval=1`;
    const data = {
      attributes: {
        is_approved: user.is_approved,
      }
    };
    return this.http.patch<User>(endpoint, data, options).pipe(
      catchError(this.authService.handleError),
      map(res => new User(res))
    );
  }





}
