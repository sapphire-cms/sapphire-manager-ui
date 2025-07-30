import {ChangeDetectionStrategy, Component} from '@angular/core';
import {AbstractInput} from '../../../inputs-base/abstract-input';

@Component({
  selector: 'scms-raw',
  standalone: false,
  templateUrl: './raw.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RawComponent extends AbstractInput<string> {
  protected readonly editorOptions = {
    language: 'markdown',
    theme: 'vs',
    automaticLayout: true,
    lineNumbers: 'off',
    minimap: {
      enabled: false,
    },
    scrollBeyondLastLine: false,
    overviewRulerLanes: 0,
  };
}
