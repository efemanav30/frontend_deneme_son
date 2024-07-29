import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { LoginUser } from 'src/app/models/loginUser';
import { RegisterUser } from 'src/app/models/registerUser';
import { ToastrService } from 'ngx-toastr';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private httpClient: HttpClient, private router: Router, private toastr: ToastrService) { }
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
      .pipe(
        catchError(this.handleError.bind(this))
      )
      .subscribe((data: any) => {
        this.saveToken(data.token);
        this.decodedToken = this.jwtHelper.decodeToken(data.token);
        localStorage.setItem(this.ROLE_KEY, this.decodedToken.role);
        console.log(this.decodedToken);
        this.router.navigateByUrl("/table-list");
      });
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      switch (error.status) {
        case 401:
          errorMessage = 'Email veya şifre hatalı.';
          break;
        case 404:
          errorMessage = 'The requested resource was not found.';
          break;
        default:
          errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      }
    }
    this.toastr.error(errorMessage);
    return throwError(errorMessage);
  }

  saveToken(token: string) {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  register(RegisterUser: RegisterUser) {
    let headers = new HttpHeaders();
    headers = headers.append("Content-Type", "application/json");
    
    this.httpClient.post(this.path + "register", RegisterUser, { headers: headers })
      .subscribe({
        next: (data: any) => {
          // Burada data'yı console.log ile yazdırın
          console.log('Kayıt başarılı verisi: ', data);
          alert("Kayıt başarılı.");
        },
        error: (error: HttpErrorResponse) => {
          // Burada hata detaylarını console.error ile yazdırın
          console.error('Kayıt hatası: ', error);
          this.toastr.error("Kayıt başarısız.");
        }
      });
  }
  

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  async logOut(): Promise<boolean> {
    const confirmation = confirm('Çıkış yapmak istediğinizden emin misiniz?');
    if (!confirmation) {
      console.log('Çıkış iptal edildi.');
      return false;
    } else {
      try {
        const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.getToken());
        await this.httpClient.post(this.path + 'logout', {}, { headers: headers }).toPromise();
        localStorage.removeItem(this.TOKEN_KEY);
        localStorage.removeItem('userId');
        localStorage.removeItem(this.ROLE_KEY);
        console.log('Çıkış başarılı');
        alert('Çıkış başarılı.');
        return true;
      } catch (error) {
        alert('Çıkış işlemi sırasında bir hata oluştu.');
        console.error('Çıkış işlemi sırasında bir hata oluştu', error);
        return false;
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
    const role = this.getRole();
    return role === 'admin';
  }
}