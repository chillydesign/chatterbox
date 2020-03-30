import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, Subject } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

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
  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
  }




  onSubmit() {

    if (this.email && this.password) {
      this.login_sub = this.authService.login(this.email, this.password).subscribe(
        () => {
          this.errors.next(null);
          this.router.navigate(['/']);

        },
        () => this.errors.next({ signin: 'Connection error' })
      );
    }

  }


  ngOnDestroy(): void {
    if (this.login_sub) {
      this.login_sub.unsubscribe();
    }
  }


}
