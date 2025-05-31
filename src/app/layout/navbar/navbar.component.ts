import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
  selector: 'scms-navbar',
  standalone: false,
  templateUrl: './navbar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent {

}
