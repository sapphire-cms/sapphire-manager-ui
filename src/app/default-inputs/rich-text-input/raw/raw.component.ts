import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  ViewChild
} from '@angular/core';
import {AbstractInput} from '../../../inputs-base/abstract-input';
import * as monaco from 'monaco-editor';

@Component({
  selector: 'scms-raw',
  standalone: false,
  templateUrl: './raw.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RawComponent extends AbstractInput<string> implements AfterViewInit, OnDestroy {

  @ViewChild('editorContainer', { static: true })
  private readonly editorContainer!: ElementRef<HTMLDivElement>;

  private editorInstance!: monaco.editor.IStandaloneCodeEditor;

  constructor(private readonly zone: NgZone) {
    super();
  }

  ngAfterViewInit(): void {
    this.zone.runOutsideAngular(() => {
      this.editorInstance = monaco.editor.create(this.editorContainer.nativeElement, {
        value: this.value,
        language: 'markdown',
        theme: 'vs',
        automaticLayout: true,
        lineNumbers: 'off',
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        overviewRulerLanes: 0,
      });

      this.editorInstance.onDidChangeModelContent(() => {
        const content = this.editorInstance.getValue();
        this.valueChange.emit(content);
      });
    });
  }

  ngOnDestroy(): void {
    this.editorInstance?.dispose();
  }
}
