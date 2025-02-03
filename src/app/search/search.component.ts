import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Location } from '@angular/common';
import { AuthService } from '../auth.service';

interface Item {
  ItemID: number;
  User: string;
  ItemName: string;
  LocID: number;
  Count: number;
}

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.css'],
    standalone: false
})
export class SearchComponent implements OnInit {
  query: string = '';
  queryValue: string = '';
  results: Item[] = [];

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private authService: AuthService,
    private location: Location,
    private router: Router
  ) {}

  ngOnInit() {
    if (this.route.snapshot.queryParamMap.get('q') != null) {
      this.query = decodeURI(this.route.snapshot.queryParamMap.get('q')!);
      this.search();
      this.queryValue = this.query;
    }
  }

  onSubmit() {
    this.queryValue = this.query;
    this.router.navigate(['/search'], { queryParams: { q: this.query } });
    this.search();
  }

  backClicked() {
    this.location.back();
  }

  logOut() {
    this.authService.logout();
  }

  search() {
    // Set the HTTP headers with the authorization token
    const authToken: string = localStorage.getItem('token')!;

    const search = {
      Authorization: authToken,
      Item: this.query,
    };

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: search.Authorization,
      }),
    };

    this.http
      .post<Item[]>('/api/search', search, httpOptions)
      .subscribe((data: Item[]) => {
        this.results = data;
        console.log(this.results);
      });
  }
}
