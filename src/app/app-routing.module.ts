import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './logInPage/login/login.component';
import { TableListComponent } from './mainPage/table-list/table-list.component';
import { NavbarComponent } from './mainPage/navbar/navbar.component';
import { AddComponent } from './mainPage/table-list/add/add.component';
import { MapComponent } from './mainPage/table-list/map/map.component';
import { KullaniciComponent } from './kullanici/kullanici.component';
import { LogComponent } from './log/log.component';
import { LoginGuardService } from './mainPage/services/login-guard.service';
import { AdminGuardService } from './mainPage/services/admin-guard.service';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'table-list', component: TableListComponent, data: { title: 'Mevcut Taşınmaz Listesi' }, canActivate: [LoginGuardService] },
  { path: 'add', component: AddComponent, canActivate: [LoginGuardService] },
  { path: 'map', component: MapComponent, data: { title: 'Anasayfa' }, canActivate: [LoginGuardService] },
  { path: 'log', component: LogComponent, data: { title: 'Log İşlemleri' }, canActivate: [LoginGuardService, AdminGuardService] },
  { path: 'kullanici', component: KullaniciComponent, data: { title: 'Kullanıcı İşlemleri' }, canActivate: [LoginGuardService, AdminGuardService] },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
