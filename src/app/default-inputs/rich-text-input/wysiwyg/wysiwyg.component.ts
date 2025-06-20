import {ChangeDetectionStrategy, Component, OnDestroy} from '@angular/core';
import {AbstractInput} from '../../../inputs-base/abstract-input';
import {Editor} from '@tiptap/core';
import {StarterKit} from '@tiptap/starter-kit';
import {Markdown} from 'tiptap-markdown';

@Component({
  selector: 'scms-wysiwyg',
  standalone: false,
  templateUrl: './wysiwyg.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WysiwygComponent extends AbstractInput<string> implements OnDestroy {
  editor = new Editor({
    extensions: [
      StarterKit,
      Markdown,
    ],
    content: '',
    onUpdate: ({ editor }) => {
      // this.markdown = editor.storage.markdown.getMarkdown();
    }
  });

  ngOnDestroy() {
    this.editor.destroy();
  }
}
