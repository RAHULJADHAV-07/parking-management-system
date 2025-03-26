import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  showPassword: boolean = false; // ✅ Toggle password visibility

  roles = [
    { value: 'admin', viewValue: 'Admin' },
    { value: 'watchman', viewValue: 'Watchman' },
    { value: 'customer', viewValue: 'Customer' }
  ];

  private allowedUsers = {
    admin: { username: 'admin123', password: 'admin@pass' },
    watchmen: [
      { username: 'Rahul', password: 'Rahul@9175' },
      { username: 'Magic', password: 'magic@20' },
      { username: 'watchman3', password: 'watchman@789' }
    ]
  };

  constructor(private fb: FormBuilder, private router: Router) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      role: ['', Validators.required]
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { username, password, role } = this.loginForm.value;

      if (role === 'admin') {
        const admin = this.allowedUsers.admin;
        if (admin.username === username && admin.password === password) {
          localStorage.setItem('userRole', role);
          localStorage.setItem('isLoggedIn', 'true');
          this.router.navigate([`/${role}`]);
        } else {
          alert('Access Denied: Invalid Admin credentials!');
        }
      } else if (role === 'watchman') {
        const validWatchman = this.allowedUsers.watchmen.some(
          user => user.username === username && user.password === password
        );

        if (validWatchman) {
          localStorage.setItem('userRole', role);
          localStorage.setItem('isLoggedIn', 'true');
          this.router.navigate([`/${role}`]);
        } else {
          alert('Access Denied: Invalid Watchman credentials!');
        }
      } else {
        localStorage.setItem('userRole', role);
        localStorage.setItem('isLoggedIn', 'true');
        this.router.navigate([`/${role}`]);
      }
    }
  }
}
