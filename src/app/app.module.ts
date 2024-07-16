import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './mainPage/navbar/navbar.component';
import { TableListComponent } from './mainPage/table-list/table-list.component';
import { LoginComponent } from './logInPage/login/login.component';
import {HttpClientModule} from '@angular/common/http';
import { TasinmazService } from './tasinmaz.service';
import { AddComponent } from './mainPage/table-list/add/add.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    TableListComponent,
    LoginComponent,
    AddComponent
   
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule, ReactiveFormsModule
    
  ],
  providers: [TasinmazService],
  bootstrap: [AppComponent]
})
export class AppModule { }
