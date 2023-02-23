## Information flow

Components:

* **Front-end**: Angular
  * Get info from user (modals or other interactive inputs)
    * Display "templates" to collect information: `books.component.{ts, html}`
      * input elements     `<input ...` or buttons,
      * Call a method on the component, `addBook()`
    * Give it to a SERVICE (`books.service.ts`)
      * behaves like a mini-backend for the specific data collection
      * use other services:     `http` service from Angular
    * Send it to the _backend_:     `POST`,     `PUT`
    * ...
    * Take result and post-process it in the service.
      * Say `Users(firstName, lastName, ...)`, computer `name = firstName + " " + lastName`so that the name is standardized.
      * Compute SVG for an Identicons of the user.
    * Provide the "result" to the component

* **Back-end**
  * Implements a router (GorillaMux)
  * Send information form FE to handling functions
    * make sure info is "reasonable"
    * error and permission handling
    * Ways to send info:
      * encode in URL: GET, POST, PUT,  DELETE
      * query parameters: GET (POST, PUT, DELETE)
      * body of the request: POST, PUT
  * Use info to lookup/change in memory data-structure
    * Reason 1: cache database info
    * Reason 2: info only in memory. Sessions.
  * Interact with a  database
    * Gorm:
    * Persistent
    * Multiple backend processes using the same database
  * Sending an answer:
    * Send an error message
    * Send a reply:
      * OK: 200, delete action
      * JSON: most common
    * Binary reply,  
* **Database**
  * Almost all applications can work with SQLite3
  * Can use Database Servers: MySQL/MariaDB, PostgresSQL, Oracle, MS SQLserver, ....
  * Data holder
  * Hardest to SCALE
  * Usage:
    * Manage collections: CRUD interface
    * Compute statistics
      * Dashboards
      * GROUP BY, COUNT, SUM...
  * BLOBS: binary data

Workflow:
FE => BE => DB => BE => FE

### Promises

Component

```
title: string; // title of new book
author: string; //  name of author
books: BookInfo[];

async addBook(){
    // Promise interface
    booksService.addBook(this.title, this.author).then(
      books => {
        this.books = books;
      }, err => {
          
      }
    )
    
    // Alternative
    this.books = await booksService.addBook(this.title, this.author)
}
```

Service:

```
class BooksService {
    
    addBook(title: string, author: string): Promise<BookInfo[]>{
        return this.http.post<BookInfo[]>("/books", {
             title, author
        }).toPromise()
    }

}
```
