import {ChangeDetectionStrategy, Component} from '@angular/core';
import {AuthenticationService} from '../authentication.service';
import {UsernamePassword} from '../username-password';

@Component({
  selector: 'scms-authentication-page',
  standalone: false,
  templateUrl: './authentication-page.component.html',
  styleUrl: './authentication-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthenticationPageComponent {
  constructor(private readonly authenticationService: AuthenticationService) {
  }

  protected login(usernamePassword: UsernamePassword) {
    this.authenticationService.testUsernamePassword(usernamePassword)
      .subscribe(res => {
        console.log(res);
      })
  }
}
