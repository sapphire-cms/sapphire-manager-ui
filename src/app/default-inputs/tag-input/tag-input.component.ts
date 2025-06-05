import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {AbstractInput} from '../../inputs-base/abstract-input';

const tagsPattern = /#[a-zA-Z0-9_-\s][^#]+/g;

@Component({
  selector: 'scms-tag-input',
  standalone: false,
  templateUrl: './tag-input.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TagInputComponent extends AbstractInput<string> implements OnInit {
  protected selected = new Set<string>();

  protected toggle(tag: string) {
    if (this.selected.has(tag)) {
      this.selected.delete(tag);
    } else if (this.params.multiple) {
      this.selected.add(tag);
    } else {
      this.selected.clear();
      this.selected.add(tag);
    }

    this.valueChange.emit(this.selectedToString());
  }

  ngOnInit(): void {
    this.selected.clear();
    this.value!.match(tagsPattern)!.map((tag) => tag.trim().slice(1)).forEach(tag => this.selected.add(tag));
  }

  private selectedToString(): string {
    return [...this.selected].map(tag => '#' + tag).join(' ');
  }
}
