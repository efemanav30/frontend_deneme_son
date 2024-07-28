import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isAdmin: boolean = false;
  loggedIn: boolean = false;
  currentTitle: string = 'Mevcut Taşınmaz Listesi';

  constructor(private router: Router, private authService: AuthService) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      const currentRoute = this.router.routerState.root.snapshot.firstChild;
      if (currentRoute && currentRoute.data['title']) {
        this.currentTitle = currentRoute.data['title'];
      }
    });
  }

  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin();
    this.loggedIn = this.authService.loggedIn();

    const currentRoute = this.router.routerState.root.snapshot.firstChild;
    if (currentRoute && currentRoute.data['title']) {
      this.currentTitle = currentRoute.data['title'];
    }
  }

  confirmLogout() {
    this.authService.logOut().then((result) => {
      if (result) {
        this.router.navigateByUrl("/login");
      }
    });
  }
  
}