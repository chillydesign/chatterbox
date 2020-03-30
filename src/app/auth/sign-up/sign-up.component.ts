import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Subject, Subscription } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit, OnDestroy {
  public email: string;
  public username: string;
  public password: string;
  public password_confirmation: string;
  public canSubmitForm = false;
  public formLoading = false;
  public formSuccess = false;
  public errors: Subject<object> = new Subject();
  private register_sub: Subscription;

  constructor(private authService: AuthService, private router: Router) { }

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

      this.register_sub = this.authService.register(this.email, this.username, this.password, this.password_confirmation).subscribe(
        (user: User) => {
          this.formLoading = false;
          this.formSuccess = true;
          this.errors.next(null);
          this.router.navigate(['/login']);

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
      this.register_sub,

    ];

    subs.forEach((sub) => {
      if (sub) {
        sub.unsubscribe();
      }
    });

  }

}
