import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
  selector: 'scms-root',
  standalone: false,
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
}
