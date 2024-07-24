import { Injectable } from '@angular/core';
import { LoginUser } from 'src/app/models/loginUser';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { JwtHelperService } from '@auth0/angular-jwt/src/jwthelper.service';
import { Router } from '@angular/router';
import { RegisterUser } from 'src/app/models/registerUser';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private httpClient: HttpClient, private router: Router) { }
  path = "https://localhost:44312/api/Auth/";
  userToken: any;
  decodedToken: any;
  jwtHelper: JwtHelperService = new JwtHelperService();
  TOKEN_KEY = "token"

  login(LoginUser: LoginUser) {
    let headers = new HttpHeaders();
    headers = headers.append("Content-Type", "application/json");
    this.httpClient.post(this.path + "login", LoginUser, { headers: headers })
      .subscribe((data: any) => {
        this.saveToken(data.token); // Token'ı kaydettiğinizden emin olun
        this.decodedToken = this.jwtHelper.decodeToken(data.token);
        console.log(this.decodedToken); // Token'ın çözümlendiğinden emin olmak için
        this.router.navigateByUrl("/table-list");
      }, error => {
        console.error("Login error: ", error); // Hata durumunu kontrol etmek için
      });
  }

  saveToken(token: string) {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  register(RegisterUser: RegisterUser) {
    let headers = new HttpHeaders();
    headers = headers.append("Content-Type", "application/json");
    this.httpClient.post(this.path + "register", RegisterUser, { headers: headers })
      .subscribe(data => {
        // Kayıt başarılı olduğunda yapılacak işlemler
      });
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  logOut() {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  loggedIn() {
    const token = this.getToken();
    return !!token && !this.jwtHelper.isTokenExpired(token);
  }

  get token() {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getCurrentUserId() {
    const token = this.getToken();
    if (!token) return null;
    const decodedToken = this.jwtHelper.decodeToken(token);
    return decodedToken ? decodedToken.nameid : null;
  }
}
