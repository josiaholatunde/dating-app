import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  isSignedUp = false;
  constructor() { }

  ngOnInit() {
  }
  toggleSignUp($event) {
    this.isSignedUp = $event;
    console.log($event);

  }

}
