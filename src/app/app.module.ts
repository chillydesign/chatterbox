import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ConversationsComponent } from './conversations/conversations.component';
import { SignInComponent } from './auth/sign-in/sign-in.component';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { NotFoundComponent } from './status-codes/not-found/not-found.component';
import { NewConversationComponent } from './conversations/new-conversation/new-conversation.component';
import { ConversationComponent } from './conversations/conversation/conversation.component';
import { EditConversationComponent } from './conversations/edit-conversation/edit-conversation.component';
import { HeaderComponent } from './shared/header/header.component';
import { MessageComponent } from './messages/message/message.component';
import { NewMessageComponent } from './messages/new-message/new-message.component';
import { FormFieldComponent } from './shared/form-field/form-field.component';
import { SpinnerComponent } from './shared/spinner/spinner.component';
import { FancifyPipe } from './pipes/fancify.pipe';
import { ProfileComponent } from './profile/profile.component';
import { UserComponent } from './users/user/user.component';
import { UsersComponent } from './users/users.component';


@NgModule({
  declarations: [
    AppComponent,
    ConversationsComponent,
    SignInComponent,
    SignUpComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    NotFoundComponent,
    NewConversationComponent,
    ConversationComponent,
    EditConversationComponent,
    HeaderComponent,
    MessageComponent,
    NewMessageComponent,
    FormFieldComponent,
    SpinnerComponent,
    FancifyPipe,
    ProfileComponent,
    UserComponent,
    UsersComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    CommonModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
