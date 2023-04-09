import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTreeModule } from '@angular/material/tree';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTooltipModule } from '@angular/material/tooltip';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

import { ItemComponent } from './container/item.component';
import { ContainerCardPageComponent } from './container-card-page/container-card-page.component';
import { InventoryPageComponent } from './inventory-page/inventory-page.component';
import { ContainerComponent } from './container/container.component';
import { DialogComponent } from './inventory-page/dialog/dialog.component';
import { ConfirmDialogComponent } from './inventory-page/confirm-dialog/confirm-dialog.component';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { SignUpPageComponent } from './sign-up-page/sign-up-page.component';
import { RenameDialogComponent } from './inventory-page/rename-dialog/rename-dialog.component';

import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { ItemDialogComponent } from './inventory-page/item-dialog/item-dialog.component';
import { InvContainerComponent } from './inventory-page/inv-container/inv-container.component';
import { SearchComponent } from './search/search.component';
import { SearchItemComponent } from './search/search-item/search-item.component';
import { RecountDialogComponent } from './container-card-page/recount-dialog/recount-dialog.component';
import { SidebarNavComponent } from './sidebar-nav/sidebar-nav.component';
import { RecentlyDeletedComponent } from './recently-deleted/recently-deleted.component';

@NgModule({
  declarations: [
    AppComponent,
    ItemComponent,
    ContainerCardPageComponent,
    InventoryPageComponent,
    ContainerComponent,
    DialogComponent,
    ConfirmDialogComponent,
    HomeComponent,
    AboutComponent,
    LoginPageComponent,
    SignUpPageComponent,
    RenameDialogComponent,
    ItemDialogComponent,
    InvContainerComponent,
    SearchComponent,
    SearchItemComponent,
    RecountDialogComponent,
    SidebarNavComponent,
    RecentlyDeletedComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatButtonModule,
    MatInputModule,
    MatGridListModule,
    MatCardModule,
    MatDividerModule,
    MatIconModule,
    MatMenuModule,
    FormsModule,
    MatDialogModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatTreeModule,
    MatSidenavModule,
    MatTooltipModule,
  ],
  providers: [AuthService, AuthGuard],
  bootstrap: [AppComponent],
})
export class AppModule {}
