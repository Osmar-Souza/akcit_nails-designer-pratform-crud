import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login-screen',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login-screen.component.html',
  styleUrls: ['./login-screen.component.css']
})
export class LoginScreenComponent {
  @Output() onLogin = new EventEmitter<boolean>();

  loginAsAdmin() {
    this.onLogin.emit(true);
  }

  loginAsClient() {
    this.onLogin.emit(false);
  }
}