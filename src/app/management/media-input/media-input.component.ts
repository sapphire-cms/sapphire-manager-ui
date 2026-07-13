import {AbstractInput} from '../../inputs-base/abstract-input';
import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from '@angular/core';
import {DocumentInfo, DocumentReference} from '@sapphire-cms/core';

@Component({
  selector: 'scms-media-input',
  standalone: false,
  templateUrl: './media-input.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MediaInputComponent extends AbstractInput<string> {
  protected pickedShown = false;
  protected selectedMedia: DocumentInfo | undefined = undefined;

  constructor(private readonly cdr: ChangeDetectorRef) {
    super();
  }

  protected onSelect(media: DocumentInfo) {
    this.selectedMedia = media;
    const mediaDocRef = new DocumentReference(media.store, media.path, media.docId, 'default');
    this.value = mediaDocRef.toString();
    this.valueChange.emit(mediaDocRef.toString());
    this.pickedShown = false;
    this.cdr.markForCheck();
  }

  protected clear() {
    this.value = undefined;
    this.selectedMedia = undefined;
    this.valueChange.emit(undefined);
    this.cdr.markForCheck();
  }
}
