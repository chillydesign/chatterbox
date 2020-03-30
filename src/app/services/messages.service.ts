import { Message } from '../models/message.model';
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
export class MessagesService {
  private api_url = environment.api_url;

  constructor(private http: HttpClient, private authService: AuthService) { }



  addMessage(message: Message): Observable<Message> {
    const options = this.authService.setAPIOptions();
    const data = {
      attributes: {
        content: message.content,
        conversation_id: message.conversation_id,
        user_id: message.user_id,
      }

    };
    const endpoint = `${this.api_url}/?route=messages`;
    return this.http.post<Message>(endpoint, data, options).pipe(
      catchError(this.authService.handleError),
      map(res => new Message(res))
    );
  }


  deleteMessage(message: Message): Observable<Message> {
    const options = this.authService.setAPIOptions();
    const endpoint = `${this.api_url}/?route=messages&id=${message.id}`;
    return this.http.delete<Message>(endpoint, options).pipe(
      catchError(this.authService.handleError)
    );
  }


}
