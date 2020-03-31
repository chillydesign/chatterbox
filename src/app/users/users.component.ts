import { Component, OnInit, OnDestroy } from '@angular/core';
import { User } from '../models/user.model';
import { Subscription } from 'rxjs';
import { UsersService } from '../services/users.service';
import { AuthService } from '../services/auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, OnDestroy {
  public current_user: User;
  public users: User[];
  private current_user_subscription: Subscription;
  private users_sub: Subscription;
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
    private route: ActivatedRoute
  ) { }




  ngOnInit() {
    this.getCurrentUser();
  }

  getCurrentUser(): void {
    this.current_user_subscription = this.authService.current_user.subscribe(
      (user: User) => {
        // set user to nil if necessary
        this.current_user = user;
        if (this.current_user) {
          this.getUsers();
        }

      }
    );
  }



  getUsers(): void {


    this.users_sub = this.usersService.getUsers().subscribe(
      (users: User[]) => {
        if (users) {
          this.users = users;
        }
      }
    );

  }

  toggleApproval(user: User): void {
    user.is_approved = !user.is_approved;
    this.usersService.updateUserApproval(user).subscribe(
      (updated_user: User) => {
        user.is_approved = updated_user.is_approved;
      },
      (error) => console.log(error)
    );
  }



  ngOnDestroy() {

    const subs: Subscription[] = [

      this.users_sub,
      this.current_user_subscription,
    ];

    subs.forEach((sub) => {
      if (sub) {
        sub.unsubscribe();
      }
    });

  }

}
