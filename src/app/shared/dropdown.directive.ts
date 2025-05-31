import {Directive, ElementRef, HostBinding, HostListener} from '@angular/core';

/**
 * Directive that animates dropdown component from Bulma.
 *
 * @see https://bulma.io/documentation/components/dropdown/
 */
@Directive({
  selector: '[scmsDropdown]',
  standalone: false,
})
export class DropdownDirective {

  @HostBinding('class.is-active')
  open = false;

  constructor(private readonly elemRef: ElementRef) {
  }

  @HostListener('click')
  onClick() {
    this.open = !this.open;
  }

  @HostListener('window:click', ['$event'])
  captureClick(event: MouseEvent) {
    if (!this.elemRef.nativeElement.contains(event.target)) {
      this.open = false;
    }
  }

  @HostListener('window:keyup', ['$event'])
  onKeydownHandler(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.open = false;
    }
  }
}
