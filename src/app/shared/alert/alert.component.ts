import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit {
  @Input() warning: boolean;
  @Input() success: boolean;
  @Input() closable: boolean;
  public visible = true;
  constructor() { }

  ngOnInit() {
  }

  closeAlert(): void {
    if (this.closable) {
      this.visible = false;
    }
  }

}
