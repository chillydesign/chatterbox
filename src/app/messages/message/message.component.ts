import { Component, OnInit, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Message } from 'src/app/models/message.model';
import { User } from 'src/app/models/user.model';
import { MessagesService } from 'src/app/services/messages.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit, OnDestroy {
  @Input() message: Message;
  @Input() current_user: User;
  @Output() messageDeleted: EventEmitter<Message | null | undefined> = new EventEmitter(undefined);

  private delete_sub: Subscription;
  constructor(private messagesService: MessagesService) { }

  ngOnInit() {

  }

  deleteMessage(): void {
    if (this.current_user && this.current_user.is_an_admin) {
      if (confirm('Are you sure?')) {
        this.delete_sub = this.messagesService.deleteMessage(this.message).subscribe(
          () => {
            this.messageDeleted.next(this.message);
          }
        );
      }
    }
  }

  ngOnDestroy() {
    const subs: Subscription[] = [
      this.delete_sub,
    ];
    subs.forEach((sub) => {
      if (sub) {
        sub.unsubscribe();
      }
    });
  }


}
