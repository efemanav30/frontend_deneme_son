import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { LoginUser } from 'src/app/models/loginUser';
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
  TOKEN_KEY = "token";
  private ROLE_KEY = "role";

  login(LoginUser: LoginUser) {
    let headers = new HttpHeaders();
    headers = headers.append("Content-Type", "application/json");
    this.httpClient.post(this.path + "login", LoginUser, { headers: headers })
      .subscribe((data: any) => {
        this.saveToken(data.token); // Token'ı kaydettiğinizden emin olun
        this.decodedToken = this.jwtHelper.decodeToken(data.token);
        localStorage.setItem(this.ROLE_KEY, this.decodedToken.role); // Rol bilgisini kaydet
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

 /* async logOut(): Promise<void> {
    const confirmation = confirm('Çıkış yapmak istediğinizden emin misiniz?');
    if (!confirmation) {
      console.log('Çıkış iptal edildi.');
      return; // Çıkış iptal edildiğinde metodu sonlandır
    }
    else{
    try {
      const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.getToken());
      await this.httpClient.post(this.path + 'logout', {}, { headers: headers }).toPromise();
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem('userId');
      localStorage.removeItem(this.ROLE_KEY);
      console.log('Çıkış başarılı'); // Logout işleminin başarılı olduğunu kontrol etmek için
      alert('Çıkış başarılı.');
      //this.router.navigateByUrl("/login");
    } catch (error) {
      alert('Çıkış işlemi sırasında bir hata oluştu.');
      console.error('Çıkış işlemi sırasında bir hata oluştu', error);
    }
  }
  }*/
  async logOut(): Promise<boolean> {
    const confirmation = confirm('Çıkış yapmak istediğinizden emin misiniz?');
    if (!confirmation) {
      console.log('Çıkış iptal edildi.');
      return false; // Logout cancelled
    } else {
      try {
        const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.getToken());
        await this.httpClient.post(this.path + 'logout', {}, { headers: headers }).toPromise();
        localStorage.removeItem(this.TOKEN_KEY);
        localStorage.removeItem('userId');
        localStorage.removeItem(this.ROLE_KEY);
        console.log('Çıkış başarılı'); // Logout işleminin başarılı olduğunu kontrol etmek için
        alert('Çıkış başarılı.');
        return true; // Logout successful
      } catch (error) {
        alert('Çıkış işlemi sırasında bir hata oluştu.');
        console.error('Çıkış işlemi sırasında bir hata oluştu', error);
        return false; // Logout failed
      }
    }
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

  getRole(): string | null {
    return localStorage.getItem(this.ROLE_KEY);
  }

  isAdmin(): boolean {
    return this.getRole() === 'admin';
  }
}
