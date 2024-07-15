import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './logInPage/login/login.component';
import { TableListComponent } from './mainPage/table-list/table-list.component';
import { NavbarComponent } from './mainPage/navbar/navbar.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'table-list', component: TableListComponent },

  { path: '', redirectTo: '/login', pathMatch: 'full' },
  // { path: '', redirectTo: '/login' },

  //{ path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
