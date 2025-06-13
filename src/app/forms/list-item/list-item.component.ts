import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'scms-list-item',
  standalone: false,
  templateUrl: './list-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListItemComponent {

  @Input()
  public index!: number;

  @Input()
  public last!: boolean;

  @Output()
  public readonly moveUp = new EventEmitter<number>();

  @Output()
  public readonly moveDown = new EventEmitter<number>();

  @Output()
  public readonly delete = new EventEmitter<number>();

  protected onMoveUp() {
    this.moveUp.emit(this.index);
  }

  protected onMoveDown() {
    this.moveDown.emit(this.index);
  }

  protected onDelete() {
    this.delete.emit(this.index);
  }
}
