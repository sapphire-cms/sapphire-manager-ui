import {ChangeDetectionStrategy, Component} from '@angular/core';
import packageJson from '../../../../package.json';
import {AuthenticationService} from '../../authentication/authentication.service';

@Component({
  selector: 'scms-navbar',
  standalone: false,
  templateUrl: './navbar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent {
  public version = packageJson.version;

  constructor(protected readonly authenticationService: AuthenticationService) {
  }
}
