import {ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewChild} from '@angular/core';
import {AbstractInput} from '../../../inputs-base/abstract-input';
import * as monaco from 'monaco-editor';
import {EditorComponent} from 'ngx-monaco-editor-v2';

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
    lineNumbers: 'off',
    minimap: {
      enabled: false,
    },
    scrollBeyondLastLine: false,
    automaticLayout: false,
    overviewRulerLanes: 0,
  };

  protected containerHeight = '100px';

  @ViewChild('editorComponent', { static: true })
  private readonly editorComponent!: EditorComponent;

  private editor!: monaco.editor.IStandaloneCodeEditor;

  constructor(private readonly cdr: ChangeDetectorRef) {
    super();
  }

  protected onEditorInit(editor: monaco.editor.IStandaloneCodeEditor): void {
    this.editor = editor;
    editor.onDidContentSizeChange(() => this.resizeToContent());
  }

  private resizeToContent(): void {
    const height = Math.min(600, Math.max(100, this.editor.getContentHeight()));

    this.containerHeight = `${height + 24}px`; // 24 pixels for border and padding of textarea
    this.editorComponent._editorContainer.nativeElement.style.height = `${height}px`;

    this.cdr.markForCheck();
    this.editor.layout();
  }
}
