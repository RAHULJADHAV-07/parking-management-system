// src/app/shared/header/header.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  userRole: string = '';

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.userRole = localStorage.getItem('userRole') || '';
  }

  logout(): void {
    localStorage.removeItem('userRole');
    localStorage.removeItem('isLoggedIn');
    this.router.navigate(['/login']);
  }
}