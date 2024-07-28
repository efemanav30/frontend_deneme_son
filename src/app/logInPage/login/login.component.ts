import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/mainPage/services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private authService: AuthService, private toastr: ToastrService) { }

  loginUser: any = {}
  ngOnInit(): void {
    const container = document.getElementById('container');
    const registerBtns = document.querySelectorAll('#register');
    const loginBtns = document.querySelectorAll('#login');

    registerBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        container.classList.add('active');
      });
    });

    loginBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        container.classList.remove('active');
      });
    });
  }

  login() {
    this.authService.login(this.loginUser);
  }

  logOut() {
    this.authService.logOut();
  }

  get isAuthenticated() {
    return this.authService.loggedIn();
  }
}
