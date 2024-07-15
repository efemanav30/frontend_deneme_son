import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor() { }

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

}
