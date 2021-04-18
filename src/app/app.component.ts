import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'sample-application';
  selectedDestination = '';
  list = [{ "id": 1, "name": "Afghanistan", "region": "Asia" }, { "id": 2, "name": "Aland Islands", "region": "Europe" }, { "id": 3, "name": "Albania", "region": "Europe" }, { "id": 4, "name": "Algeria", "region": "Africa" }, { "id": 5, "name": "American Samoa", "region": "America" }];
  myForm: FormGroup;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.myForm = new FormGroup({
      country: new FormControl('', [Validators.required]),
      region: new FormControl('sd', [Validators.required])
    });
  }

  trackObject(index: number, item: any): any {
    return item;
  }
}
