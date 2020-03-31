import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConversationsComponent } from './conversations/conversations.component';
import { NotFoundComponent } from './status-codes/not-found/not-found.component';
import { NewConversationComponent } from './conversations/new-conversation/new-conversation.component';
import { ConversationComponent } from './conversations/conversation/conversation.component';
import { EditConversationComponent } from './conversations/edit-conversation/edit-conversation.component';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { SignInComponent } from './auth/sign-in/sign-in.component';
import { ProfileComponent } from './profile/profile.component';
import { UserComponent } from './users/user/user.component';
import { UsersComponent } from './users/users.component';


const routes: Routes = [
  { path: '', component: ConversationsComponent },
  { path: 'page/:page', component: ConversationsComponent },
  { path: 'conversations/new', component: NewConversationComponent, data: { title: 'New Conversation' } },
  { path: 'conversations/:id/edit', component: EditConversationComponent, data: { title: 'Edit Conversation' } },
  { path: 'conversations/:id', component: ConversationComponent },
  { path: 'register', component: SignUpComponent },
  { path: 'login', component: SignInComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'users/:id', component: UserComponent },
  { path: 'users', component: UsersComponent },

  { path: '401', component: NotFoundComponent, data: { title: 'Page not found' } },
  { path: '404', component: NotFoundComponent, data: { title: 'Page not found' } },
  { path: '**', component: NotFoundComponent, data: { title: 'Page not found' } },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
