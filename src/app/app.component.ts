import { Component, OnInit } from '@angular/core';
import { filter, map, mergeMap } from 'rxjs/operators';
import { NavigationEnd, Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public title = environment.site_name;
  constructor(
    private router: Router,
    private titleService: Title,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.setPageTitle();
  }



  setPageTitle() {

    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map(() => this.activatedRoute),
      map((route) => {
        while (route.firstChild) {
          route = route.firstChild;
        }
        return route;
      }),
      filter((route) => route.outlet === 'primary'),
      mergeMap((route) => route.data)
    ).subscribe(
      (event) => {
        let event_title = this.title;
        if (typeof event.title !== 'undefined') {
          event_title = `${event.title} | ${this.title}`;
        }
        this.titleService.setTitle(event_title);
      }
    );
  }
}
