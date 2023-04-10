import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';

interface Item {
  ItemID: number;
  User: string;
  ItemName: string;
  LocID: number;
  Count: number;
}

@Component({
  selector: 'app-search-item',
  templateUrl: './search-item.component.html',
  styleUrls: ['./search-item.component.css'],
})
export class SearchItemComponent implements OnInit {
  @Input() item: Item = {
    ItemID: -1,
    User: '',
    ItemName: '',
    LocID: -1,
    Count: -1,
  };

  @Input() index: number = -1;
  locationName: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getContainerName();
  }

  getContainerName() {
    // Set the HTTP headers with the authorization token
    const authToken: string = localStorage.getItem('token')!;

    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: authToken,
      }),
    };

    this.http
      .get<string>(`/api/name?Container_id=${this.item.LocID}`, httpOptions)
      .subscribe((response) => {
        let arr;
        arr = response.split('/');
        arr.shift();
        response = arr.join('/');
        this.locationName = response;
      });
  }
}
