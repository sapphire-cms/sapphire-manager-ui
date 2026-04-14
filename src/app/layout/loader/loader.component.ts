import {ChangeDetectionStrategy, Component} from '@angular/core';
import {LoaderService} from '../loader.service';

@Component({
  selector: 'scms-loader',
  standalone: false,
  templateUrl: './loader.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoaderComponent {
  constructor(protected readonly loaderService: LoaderService) {
  }
}
