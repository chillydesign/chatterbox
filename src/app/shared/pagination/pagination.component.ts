import { Component, OnInit, Input } from '@angular/core';
import { PaginationOptions } from 'src/app/models/pagination_options.model';

export interface PaginationUrl {
  path: string[];
  page: number;
  gap?: boolean;
}

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnInit {
  @Input() options: PaginationOptions;
  public page_urls: PaginationUrl[] = [];

  public start_urls: PaginationUrl[] = [];
  public middle_urls: PaginationUrl[] = [];
  public end_urls: PaginationUrl[] = [];
  constructor() { }

  ngOnInit(): void {

    const all_urls: PaginationUrl[] = [];
    for (let i = 0; i < this.options.total_count; i++) {
      const ar = this.options.base_url.concat(`${(i + 1)}`);
      all_urls.push({ page: (i + 1), path: ar });
    }

    const gap: PaginationUrl = { gap: true, page: null, path: null };
    const midpoint = Math.floor(this.options.total_count / 2);
    all_urls.forEach((url, i) => {
      if (
        url.page === 1 ||
        url.page === 2 ||
        url.page === 3 ||
        url.page === this.options.total_count - 2 ||
        url.page === this.options.total_count - 1 ||
        url.page === this.options.total_count ||
        url.page === this.options.current_page
      ) {
        this.page_urls.push(url);
      } else if (url.page === this.options.current_page - 1) {
        if (this.options.current_page > 5) {
          this.page_urls.push(gap);
        }
        this.page_urls.push(url);

      } else if (url.page - 1 === this.options.current_page) {
        this.page_urls.push(url);
        if (this.options.current_page < this.options.total_count - 4) {
          this.page_urls.push(gap);
        }
      } else if (url.page === midpoint && (
        this.options.current_page > this.options.total_count - 3 ||
        this.options.current_page < 3)
      ) {
        this.page_urls.push(gap);
      }



    })





  }

}
