import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, Subject } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit, OnDestroy {
  private login_sub: Subscription;

  public email: string;
  public password: string;
  public errors: Subject<object> = new Subject();
  private current_user_subscription: Subscription;
  constructor(private authService: AuthService, private router: Router) { }


  ngOnInit() {
    this.getCurrentUser();
  }

  getCurrentUser(): void {
    this.current_user_subscription = this.authService.current_user.subscribe(
      (user: User) => {

        if (user) {
          if (user.is_approved) {
            this.router.navigate(['/']);
          } else {
            this.router.navigate(['/unauthorized']);
          }
        }



      }
    );
  }



  onSubmit() {

    if (this.email && this.password) {
      this.login_sub = this.authService.login(this.email, this.password).subscribe(
        () => {
          this.errors.next(null);


        },
        () => this.errors.next({ signin: 'Connection error' })
      );
    }

  }


  ngOnDestroy(): void {
    if (this.login_sub) {
      this.login_sub.unsubscribe();
    }
    if (this.current_user_subscription) {
      this.current_user_subscription.unsubscribe();
    }
  }


}
