import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Params, Router, UrlSegment } from '@angular/router';
import { ConversationsService } from 'src/app/services/conversations.service';
import { Conversation } from 'src/app/models/conversation.model';
import { Title } from '@angular/platform-browser';
import { environment } from '../../../environments/environment';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { Message } from 'src/app/models/message.model';

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.scss']
})
export class ConversationComponent implements OnInit, OnDestroy {
  public current_user: User;
  public conversation: Conversation;
  private route_params_subscription: Subscription;
  private current_user_subscription: Subscription;
  private delete_conversation_sub: Subscription;
  private conversation_sub: Subscription;
  public title = environment.site_name;
  public canAdministrate = false;

  constructor(
    private titleService: Title,
    private route: ActivatedRoute,
    private conversationsService: ConversationsService,
    private authService: AuthService,
    private router: Router) {

  }



  ngOnInit() {
    this.getCurrentUser();
  }

  getCurrentUser(): void {
    this.current_user_subscription = this.authService.current_user.subscribe(
      (user: User) => {
        // set user to nil if necessary
        this.current_user = user;
        console.log(this.current_user);

        if (this.current_user) {
          this.route_params_subscription = this.route.params.subscribe(
            (params: Params) => {
              this.getConversation(params.id);
            }
          ); // end of route_params_subscription
        }

      }
    );
  }



  getConversation(conversation_id: number): void {
    this.conversation_sub = this.conversationsService.getConversation(conversation_id).subscribe(
      (conversation: Conversation) => {
        if (conversation) {
          this.conversation = conversation;
          this.titleService.setTitle(`${this.conversation.title} | ${this.title} `);
        }
      }
    );
  }


  removeMessage(message: Message): void {
    this.conversation.messages = this.conversation.messages.filter(m => m.id !== message.id);
  }


  deleteConversation(): void {


    if (this.current_user && this.current_user.is_an_admin) {
      if (confirm('Are you sure?')) {
        this.delete_conversation_sub = this.conversationsService.deleteConversation(this.conversation).subscribe(
          () => {
            this.router.navigate(['/']);

          }
        );
      }
    }
  }

  ngOnDestroy() {

    const subs: Subscription[] = [
      this.route_params_subscription,
      this.conversation_sub,
      this.delete_conversation_sub,
      this.current_user_subscription,
    ];

    subs.forEach((sub) => {
      if (sub) {
        sub.unsubscribe();
      }
    });


  }


}
