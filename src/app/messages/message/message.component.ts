import { Component, OnInit, Input, OnDestroy, Output, EventEmitter, HostListener, ElementRef, ViewChild } from '@angular/core';
import { Message } from 'src/app/models/message.model';
import { User } from 'src/app/models/user.model';
import { MessagesService } from 'src/app/services/messages.service';
import { Subscription } from 'rxjs';
import { WinrefService } from 'src/app/services/winref.service';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit, OnDestroy {
  @Input() message: Message;
  @Input() current_user: User;
  @Output() messageDeleted: EventEmitter<Message | null | undefined> = new EventEmitter(undefined);
  @ViewChild('messageContainer', { read: ElementRef }) messageContainer: ElementRef;
  public file_url: string;
  public scrollY = 0;
  public inViewport = false;
  private delete_sub: Subscription;
  constructor(private messagesService: MessagesService, private winref: WinrefService) { }

  ngOnInit() {
    // if in viewport load any picture necessary, this will also be called on scroll
    setTimeout(() => this.checkIsPostInViewport(), 1000);
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



  checkIsPostInViewport(): void {
    if (this.inViewport === false) {
      // console.log('checkIsPostInViewport', this.spacepost.id);
      if (this.message) {

        const winHeight = (this.winref.nativeWindow.innerHeight);
        const nat = this.messageContainer.nativeElement;
        const natHeight = nat.clientHeight;
        const natOffset = nat.offsetTop;
        if ((this.scrollY + winHeight) > (natOffset - natHeight)) {
          this.inViewport = true;
          this.lazyloadImages();
        }
      }
    }

  }


  lazyloadImages(): void {
    if (this.message.file_url) {
      this.file_url = this.message.file_url;
    }
  }


  // on scroll check if in viewpoirt, if so can load video
  @HostListener('window:scroll', ['$event']) onKeydownHandler(event) {
    this.scrollY = (this.winref.nativeWindow.scrollY);
    this.checkIsPostInViewport();
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
