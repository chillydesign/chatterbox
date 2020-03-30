import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, tap, catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Conversation } from '../models/conversation.model';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';


@Injectable({
  providedIn: 'root'
})
export class ConversationsService {
  private api_url = environment.api_url;

  constructor(private http: HttpClient, private authService: AuthService) { }


  getConversations(opts = { limit: 10, offset: 0 }): Observable<Conversation[]> {


    const options = this.authService.setAPIOptions();
    const endpoint = `${this.api_url}/?route=conversations&offset=${opts.offset}&limit=${opts.limit}`;

    return this.http.get<Conversation[]>(endpoint, options).pipe(
      catchError(this.authService.handleError),
      map(res => res.map((p: Conversation) => new Conversation(p)))
    );

  }

  getConversation(conversationId: number): Observable<Conversation> {
    const options = this.authService.setAPIOptions();
    const endpoint = `${this.api_url}/?route=conversations&id=${conversationId}`;
    return this.http.get<Conversation>(endpoint, options).pipe(
      catchError(this.authService.handleError),
      map(res => new Conversation(res))
    );
  }

  addConversation(conversation: Conversation): Observable<Conversation> {
    const options = this.authService.setAPIOptions();
    const data = {
      attributes: {
        title: conversation.title
      }
    };

    const endpoint = `${this.api_url}/?route=conversations`;
    return this.http.post<Conversation>(endpoint, data, options).pipe(
      catchError(this.authService.handleError),
      map(res => new Conversation(res))
    );
  }


  updateConversation(conversation: Conversation): Observable<Conversation> {
    const options = this.authService.setAPIOptions();
    const endpoint = `${this.api_url}/?route=conversations&id=${conversation.id}`;
    const data = {
      attributes: {
        title: conversation.title,
      }

    };
    return this.http.patch<Conversation>(endpoint, data, options).pipe(
      catchError(this.authService.handleError),
      map(res => new Conversation(res))
    );
  }


  deleteConversation(conversation: Conversation): Observable<Conversation> {
    const options = this.authService.setAPIOptions();
    const endpoint = `${this.api_url}/?route=conversations&id=${conversation.id}`;
    return this.http.delete<Conversation>(endpoint, options).pipe(
      catchError(this.authService.handleError)
      // ,
      // tap(() => console.log('deleted conversation'))
    );
  }


}
