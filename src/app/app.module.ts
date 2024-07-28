import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './mainPage/navbar/navbar.component';
import { TableListComponent } from './mainPage/table-list/table-list.component';
import { LoginComponent } from './logInPage/login/login.component';
import {HttpClientModule} from '@angular/common/http';
import { TasinmazService } from './tasinmaz.service';
import { AddComponent } from './mainPage/table-list/add/add.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { UpdateComponent } from './mainPage/table-list/update/update.component';
import { MapComponent } from './mainPage/table-list/map/map.component';
import { KullaniciComponent } from './kullanici/kullanici.component';
import { AddKullaniciComponent } from './kullanici/add-kullanici/add-kullanici.component';
import { UpdateKullaniciComponent } from './kullanici/update-kullanici/update-kullanici.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { LogComponent } from './log/log.component';
import { JwtModule } from '@auth0/angular-jwt';
import { AuthService } from './mainPage/services/auth.service';
import { AdminGuardService } from './mainPage/services/admin-guard.service';
import { LogDetailsComponent } from './log/log-details/log-details.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    TableListComponent,
    LoginComponent,
    AddComponent,
    UpdateComponent,
    MapComponent,
    KullaniciComponent,
    AddKullaniciComponent,
    UpdateKullaniciComponent,
    LogComponent,
    LogDetailsComponent,
    
   
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    NgxPaginationModule,
    JwtModule,
    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot()
    
  ],
  providers: [TasinmazService,NgbActiveModal,AuthService,AdminGuardService],
  bootstrap: [AppComponent],
  entryComponents: [AddKullaniciComponent, UpdateKullaniciComponent,UpdateComponent] // Add this line

})
export class AppModule { }
