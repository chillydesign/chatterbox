import { Component, OnInit, OnDestroy } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {

  public current_user: User;
  private current_user_subscription: Subscription;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.getCurrentUser();
  }

  getCurrentUser(): void {
    this.current_user_subscription = this.authService.current_user.subscribe(
      (user: User) => {
        // set user to nil if necessary
        this.current_user = user;

      }
    );
  }


  logout(): void {
    this.authService.logout();
  }

  ngOnDestroy(): void {
    const subs: Subscription[] = [
      this.current_user_subscription,
    ];
    subs.forEach((sub) => {
      if (sub) {
        sub.unsubscribe();
      }
    });
  }


}
