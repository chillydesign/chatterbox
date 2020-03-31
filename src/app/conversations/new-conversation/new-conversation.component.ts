import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subscription, Subject } from 'rxjs';
import { Message } from 'src/app/models/message.model';
import { Router } from '@angular/router';
import { Conversation } from 'src/app/models/conversation.model';
import { ConversationsService } from 'src/app/services/conversations.service';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-new-conversation',
  templateUrl: './new-conversation.component.html',
  styleUrls: ['./new-conversation.component.scss']
})
export class NewConversationComponent implements OnInit, OnDestroy {
  public conversation;
  public canSubmitForm = false;
  public formLoading = false;
  public formSuccess = false;
  public errors: Subject<object> = new Subject();
  private add_conver_sub: Subscription;
  private current_user_subscription: Subscription;

  constructor(private conversationsService: ConversationsService, private authService: AuthService, private router: Router) { }


  ngOnInit() {
    this.getCurrentUser();
  }

  getCurrentUser(): void {
    this.current_user_subscription = this.authService.current_user.subscribe(
      (user: User) => {
        if (user) {
          if (user.is_approved) {
            this.conversation = new Conversation();
          }
        }
      }
    );
  }


  onFormChange(): void {
    // let server figure out if object is valid
    this.canSubmitForm = true;

  }

  onSubmit(): void {

    this.onFormChange();

    if (this.canSubmitForm) {


      this.formLoading = true;

      this.add_conver_sub = this.conversationsService.addConversation(this.conversation).subscribe(
        (newconversation: Conversation) => {
          this.formLoading = false;
          this.formSuccess = true;
          this.errors.next(null);
          this.router.navigate(['/conversations', newconversation.id]);

        },
        (error) => {
          this.errors.next({ error: 'something went wrong' });
          this.formLoading = false;
          this.formSuccess = false;
        }
      );
    }
  }


  ngOnDestroy() {
    const subs: Subscription[] = [
      this.add_conver_sub,
      this.current_user_subscription,

    ];

    subs.forEach((sub) => {
      if (sub) {
        sub.unsubscribe();
      }
    });

  }
}

