import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { User } from '../models/user.model';
import { UserIndexResponse } from '../models/user_index_response.model';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private api_url = environment.api_url;
  public total_users_count = 0;
  constructor(private http: HttpClient, private authService: AuthService) { }


  getUsers(opts = { limit: 10, offset: 0 }): Observable<User[]> {


    const options = this.authService.setAPIOptions();
    const endpoint = `${this.api_url}/?route=users&offset=${opts.offset}&limit=${opts.limit}`;
    return this.http.get<UserIndexResponse>(endpoint, options).pipe(
      catchError(this.authService.handleError),
      tap((res) => {
        this.total_users_count = res.total_count;
      }),
      map(res => res.users.map((p: User) => new User(p))),

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
