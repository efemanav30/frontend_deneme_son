import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './logInPage/login/login.component';
import { TableListComponent } from './mainPage/table-list/table-list.component';
import { NavbarComponent } from './mainPage/navbar/navbar.component';
import { AddComponent } from './mainPage/table-list/add/add.component';
import { MapComponent } from './mainPage/table-list/map/map.component';
import { KullaniciComponent } from './kullanici/kullanici.component';
import { LogComponent } from './log/log.component';
const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'table-list', component: TableListComponent },
  { path: 'home', component: MapComponent, data: { title: 'Anasayfa' } },
  { path: 'table-list', component: AddComponent },
  { path: 'table-list', component: TableListComponent, data: { title: 'Mevcut Taşınmaz Listesi' }},
  { path: 'log', component: LogComponent, data: { title: ' Log İşlemleri' } },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'kullanici', component: KullaniciComponent, data: { title: ' Kullanıcı İşlemleri' } }
  
  // { path: '', redirectTo: '/login' },

  //{ path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
