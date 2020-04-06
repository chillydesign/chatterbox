import { Component, OnInit, OnDestroy } from '@angular/core';
import { User } from '../models/user.model';
import { Subscription } from 'rxjs';
import { UsersService } from '../services/users.service';
import { AuthService } from '../services/auth.service';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { PaginationOptions } from '../models/pagination_options.model';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, OnDestroy {
  public current_user: User;
  public users: User[];
  public pagination_options: PaginationOptions = {
    posts_per_page: 20,
    total_count: 0,
    current_page: 1,
    base_url: ['/users', 'page']
  };
  private current_user_subscription: Subscription;
  private route_params_subscription: Subscription;
  private users_sub: Subscription;
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
  ) { }


  ngOnInit() {
    this.getCurrentUser();
  }

  getCurrentUser(): void {
    this.current_user_subscription = this.authService.current_user.subscribe(
      (user: User) => {
        if (user) {
          this.current_user = user;
          this.subscribeToRoute();
        }
      }
    );
  }

  subscribeToRoute(): void {
    this.route_params_subscription = this.route.params.subscribe(
      (params: Params) => {
        if (params.page) {
          this.pagination_options.current_page = parseInt(params.page, 10);
        } else {
          this.pagination_options.current_page = 1;
        }
        this.getUsers();
      }
    ); // end of route_params_subscription
  }



  getUsers(): void {

    const options = {
      offset: this.pagination_options.posts_per_page * (this.pagination_options.current_page - 1),
      limit: this.pagination_options.posts_per_page
    };
    this.users_sub = this.usersService.getUsers(options).subscribe(
      (users: User[]) => {
        if (users) {
          this.setPageCount();
          this.users = users;
        }
      }
    );
  }


  setPageCount(): void {
    this.pagination_options.total_count = Math.ceil(
      this.usersService.total_users_count / this.pagination_options.posts_per_page
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
      this.route_params_subscription,
      this.current_user_subscription,
    ];

    subs.forEach((sub) => {
      if (sub) {
        sub.unsubscribe();
      }
    });

  }

}
