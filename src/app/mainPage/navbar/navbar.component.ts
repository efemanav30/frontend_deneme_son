import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  currentTitle: string = 'Anasayfa';

  constructor(private router: Router) {
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
    const currentRoute = this.router.routerState.root.snapshot.firstChild;
    if (currentRoute && currentRoute.data['title']) {
      this.currentTitle = currentRoute.data['title'];
    }
  }
}
