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
  public limit = 20;
  public page_urls: { path: string[], page: number }[];
  public current_page = 1;
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
          this.subscribeToRoute();
        }

      }
    );
  }


  subscribeToRoute(): void {
    this.route_params_subscription = this.route.params.subscribe(
      (params: Params) => {

        if (params.page) {
          this.current_page = parseInt(params.page, 10);
        } else {
          this.current_page = 1;
        }
        this.getConversations();
      }
    ); // end of route_params_subscription
  }



  getConversations(): void {

    if (this.loading === false) {
      this.loading = true;
      const options = { offset: this.limit * (this.current_page - 1), limit: this.limit };
      this.conversations_sub = this.conversationsService.getConversations(options).subscribe(
        (conversations: Conversation[]) => {
          if (conversations) {
            this.setPageCount();

            this.conversations = conversations;

            this.loading = false;

          }
        }
      );
    }
  }


  setPageCount(): void {
    this.page_urls = [];
    const page_count = Math.ceil(this.conversationsService.total_conversation_count / this.limit);
    for (let i = 0; i < page_count; i++) {
      this.page_urls.push({ page: (i + 1), path: ['/page', `${(i + 1)}`] });

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
