import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subscription, Subject } from 'rxjs';
import { Message } from 'src/app/models/message.model';
import { Router } from '@angular/router';
import { Conversation } from 'src/app/models/conversation.model';
import { ConversationsService } from 'src/app/services/conversations.service';

@Component({
  selector: 'app-new-conversation',
  templateUrl: './new-conversation.component.html',
  styleUrls: ['./new-conversation.component.scss']
})
export class NewConversationComponent implements OnInit, OnDestroy {
  public conversation = new Conversation();
  public canSubmitForm = false;
  public formLoading = false;
  public formSuccess = false;
  public errors: Subject<object> = new Subject();
  private add_conver_sub: Subscription;

  constructor(private conversationsService: ConversationsService, private router: Router) { }

  ngOnInit() {
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

    ];

    subs.forEach((sub) => {
      if (sub) {
        sub.unsubscribe();
      }
    });

  }
}

