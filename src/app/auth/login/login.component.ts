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
      const { username, password, role, email, phone } = this.loginForm.value;

      // If user is a customer, submit to Formspree
      if (role === 'customer') {
        const formData = new FormData();
        formData.append('username', username);
        formData.append('role', role);

        fetch('https://formspree.io/f/mkgjdqoq', {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        }).then(response => {
          if (response.ok) {
            console.log('Customer details submitted successfully');
          } else {
            console.error('Form submission failed');
          }
        }).catch(error => {
          console.error('Error:', error);
        });
      }

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
