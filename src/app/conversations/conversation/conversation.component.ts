import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Params, Router, UrlSegment } from '@angular/router';
import { ConversationsService } from 'src/app/services/conversations.service';
import { Conversation } from 'src/app/models/conversation.model';
import { Title } from '@angular/platform-browser';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.scss']
})
export class ConversationComponent implements OnInit, OnDestroy {
  public conversation: Conversation;
  private route_params_subscription: Subscription;
  private delete_conversation_sub: Subscription;
  private conversation_sub: Subscription;
  private drag_sub: Subscription;
  private update_conversation_sub: Subscription;
  private url_sub: Subscription;
  private update_task_sub: Subscription;
  public title = environment.site_name;
  public canAdministrate = false;

  constructor(
    private titleService: Title,
    private route: ActivatedRoute,
    private conversationsService: ConversationsService,
    private router: Router) {

  }

  ngOnInit() {

    this.route_params_subscription = this.route.params.subscribe(
      (params: Params) => {
        this.getConversation(params.id);
      }
    ); // end of route_params_subscription




  }

  getConversation(conversation_id: number): void {
    this.conversation_sub = this.conversationsService.getConversation(conversation_id).subscribe(
      (conversation: Conversation) => {
        if (conversation) {
          this.conversation = conversation;
          this.titleService.setTitle(`${this.conversation.title} | ${this.title} `);
          console.log(this.conversation);
        }
      }
    );
  }


  ngOnDestroy() {

    const subs: Subscription[] = [
      this.route_params_subscription,
      this.conversation_sub,
      this.delete_conversation_sub,
      this.drag_sub,
      this.update_conversation_sub,
      this.update_task_sub,
      this.url_sub,

    ];

    subs.forEach((sub) => {
      if (sub) {
        sub.unsubscribe();
      }
    });


  }


}
