import { FlatTreeControl } from '@angular/cdk/tree';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
} from '@angular/core';
import { NgModel } from '@angular/forms';
import {
  MatTreeFlatDataSource,
  MatTreeFlattener,
} from '@angular/material/tree';
import { Observable } from 'rxjs';

interface Container {
  LocID: number;
  Name: string;
  ParentID: number;
  User: string;
}

interface invContainer {
  LocID: number;
  Name: string;
  ParentID: number;
}

interface ContainerTree {
  Container: Container;
  Children: ContainerTree[];
}

/** Flat node with expandable and level information */
interface ContainerFlatNode {
  expandable: boolean;
  Container: Container;
  level: number;
}

@Component({
  selector: 'app-move-menu',
  templateUrl: './move-menu.component.html',
  styleUrls: ['./move-menu.component.css'],
})
export class MoveMenuComponent implements OnChanges {
  @Input() invContainers: invContainer[] = [];
  @Output() onContainerPicked = new EventEmitter<any>();

  private _transformer = (node: ContainerTree, level: number) => {
    return {
      expandable: node.Children && node.Children.length > 0,
      Container: node.Container,
      level: level,
    };
  };

  treeControl = new FlatTreeControl<ContainerFlatNode>(
    (node) => node.level,
    (node) => node.expandable
  );

  treeFlattener = new MatTreeFlattener(
    this._transformer,
    (node) => node.level,
    (node) => node.expandable,
    (node) => node.Children
  );

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  constructor(private http: HttpClient) {}

  ngOnChanges() {
    this.updateTree();
  }

  updateTree() {
    this.getContainerTree().subscribe((data: { Children: ContainerTree[] }) => {
      this.dataSource.data = data.Children;
    });
  }

  hasChild = (_: number, node: ContainerFlatNode) => node.expandable;

  getContainerTree(): Observable<ContainerTree> {
    // Set the HTTP headers with the authorization token
    const authToken: string = localStorage.getItem('token')!;

    const authorization = {
      Authorization: authToken,
    };

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: authorization.Authorization,
      }),
    };
    return this.http.get<ContainerTree>('/api/tree', httpOptions);
  }

  move(locID: number) {
    this.onContainerPicked.emit(locID);
  }
}
