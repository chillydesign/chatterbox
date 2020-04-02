import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, Subject } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { Router, Params, ActivatedRoute } from '@angular/router';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit, OnDestroy {
  private login_sub: Subscription;
  public return_url;
  public email: string;
  public password: string;
  public errors: Subject<object> = new Subject();
  private current_user_subscription: Subscription;
  private query_sub: Subscription;
  constructor(private authService: AuthService, private route: ActivatedRoute, private router: Router) { }


  ngOnInit() {
    this.getReturnUrl();
    this.getCurrentUser();
  }

  getReturnUrl(): void {
    // if a ?return param is set, redirect the user to that url on login
    this.query_sub = this.route.queryParams.subscribe(
      (params: Params) => {
        if (params.return) {
          this.return_url = params.return;
        }
      }
    );
  }

  getCurrentUser(): void {
    this.current_user_subscription = this.authService.current_user.subscribe(
      (user: User) => {

        if (user) {
          if (user.is_approved) {
            if (this.return_url) {
              this.router.navigateByUrl(this.return_url);
            } else {
              this.router.navigate(['/']);
            }
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
          // current user subscription will redirect us to right page
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
    if (this.query_sub) {
      this.query_sub.unsubscribe();
    }
  }


}
