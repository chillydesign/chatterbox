import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ConversationsService } from '../services/conversations.service';
import { Conversation } from '../models/conversation.model';
import { Params, ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { User } from '../models/user.model';

@Component({
  selector: 'app-conversations',
  templateUrl: './conversations.component.html',
  styleUrls: ['./conversations.component.scss']
})
export class ConversationsComponent implements OnInit, OnDestroy {
  public current_user: User;
  public conversations: Conversation[];
  public visible_conversations: Conversation[];
  public offset = 0;
  public limit = 20;
  public load_more = false;
  public loading = false;
  public search_term: string;
  private conversations_sub: Subscription;
  private route_params_subscription: Subscription;
  private current_user_subscription: Subscription;
  private update_conversation_sub: Subscription;
  constructor(
    private conversationsService: ConversationsService,
    private authService: AuthService,
    private route: ActivatedRoute
  ) { }




  ngOnInit() {
    this.getCurrentUser();
  }

  getCurrentUser(): void {
    this.current_user_subscription = this.authService.current_user.subscribe(
      (user: User) => {
        // set user to nil if necessary
        this.current_user = user;

        if (this.current_user) {

          this.refreshConversations();
        }

      }
    );
  }


  refreshConversations(): void {
    this.conversations = [];
    this.visible_conversations = null;
    this.load_more = false;
    this.offset = 0;
    this.getConversations();
  }



  getConversations(): void {

    if (this.loading === false) {
      this.loading = true;
      const options = { offset: this.offset, limit: this.limit };
      this.conversations_sub = this.conversationsService.getConversations(options).subscribe(
        (conversations: Conversation[]) => {
          if (conversations) {
            conversations.forEach(p => this.conversations.push(p));
            this.offset += this.limit;
            this.load_more = (conversations.length === this.limit);
            this.loading = false;
            this.onSearch();
          }
        }
      );
    }
  }

  onSearch(): void {
    if (this.search_term) {
      const s = this.search_term.toLowerCase();
      this.visible_conversations = this.conversations.filter((p) => {
        return p.title.toLowerCase().includes(s);
      });
    } else {
      this.visible_conversations = this.conversations;
    }

  }

  loadMore(): void {
    this.load_more = false;
    this.getConversations();
  }





  deleteConversation(conversation: Conversation): void {
    if (conversation.deleted !== 0) {
      conversation.deleted = 1;
      this.update_conversation_sub = this.conversationsService.updateConversation(conversation).subscribe(
        () => this.refreshConversations(),
        (error) => console.log(error)
      );
    }
  }

  ngOnDestroy() {

    const subs: Subscription[] = [
      this.conversations_sub,
      this.route_params_subscription,
      this.update_conversation_sub,
      this.current_user_subscription,
    ];

    subs.forEach((sub) => {
      if (sub) {
        sub.unsubscribe();
      }
    });

  }


}
