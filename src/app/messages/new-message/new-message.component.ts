import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subscription, Subject } from 'rxjs';
import { MessagesService } from 'src/app/services/messages.service';
import { Message } from 'src/app/models/message.model';
import { Router } from '@angular/router';
import { Conversation } from 'src/app/models/conversation.model';

@Component({
  selector: 'app-new-message',
  templateUrl: './new-message.component.html',
  styleUrls: ['./new-message.component.scss']
})
export class NewMessageComponent implements OnInit, OnDestroy {
  @Input() conversation: Conversation;
  public message = new Message();
  public canSubmitForm = false;
  public formLoading = false;
  public formSuccess = false;
  public errors: Subject<object> = new Subject();
  private add_message_sub: Subscription;
  public file: File;
  public maxFileSize: number = 1024 * 1024 * 1; // 1 mb

  constructor(private messagesService: MessagesService, private router: Router) { }

  ngOnInit() {


  }




  onFormChange(): void {
    // let server figure out if object is valid
    this.canSubmitForm = true;

  }

  onSubmit(): void {

    this.onFormChange();

    if (this.canSubmitForm) {

      this.message.conversation_id = this.conversation.id;

      this.formLoading = true;

      this.add_message_sub = this.messagesService.addMessage(this.message).subscribe(
        (newmessage: Message) => {
          this.formLoading = false;
          this.formSuccess = true;
          this.errors.next(null);
          if (!this.conversation.messages) {
            this.conversation.messages = [];
          }
          this.conversation.messages.push(newmessage);
          this.message = new Message();
          this.file = null;

        },
        (error) => {
          this.errors.next({ error: 'something went wrong' });
          this.formLoading = false;
          this.formSuccess = false;
        }
      );
    }
  }





  onSelect(event) {


    if (event.rejectedFiles.length > 0) {
      if (event.rejectedFiles[0].reason === 'size') {
        alert('This file is too big.')
      }
    }


    if (event.addedFiles.length > 0) {
      this.file = event.addedFiles[0];
      this.readFile(this.file).then(fileContents => {
        this.message.file = fileContents.toString();

      }).catch((err) => {
        console.log(err);
      });

    }
  }





  onRemove(event: File) {
    this.file = null;
  }



  private async readFile(file: File): Promise<string | ArrayBuffer> {
    return new Promise<string | ArrayBuffer>((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = e => {
        return resolve((e.target as FileReader).result);
      };

      reader.onerror = e => {
        console.error(`FileReader failed on file ${file.name}.`);
        return reject(null);
      };

      if (!file) {
        console.error('No file to read.');
        return reject(null);
      }

      reader.readAsDataURL(file);
    });
  }



  ngOnDestroy() {
    const subs: Subscription[] = [

      this.add_message_sub,

    ];

    subs.forEach((sub) => {
      if (sub) {
        sub.unsubscribe();
      }
    });

  }
}
