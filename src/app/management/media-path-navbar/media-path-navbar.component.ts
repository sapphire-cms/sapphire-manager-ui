import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';

type BreadcrumbLink = {
  label: string;
  path: string[];
};

@Component({
  selector: 'scms-media-path-navbar',
  standalone: false,
  templateUrl: './media-path-navbar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MediaPathNavbarComponent {

  @Input()
  public path: string[] = [];

  @Output()
  public linkClick = new EventEmitter<string[]>();

  protected get breadcrumbLinks(): BreadcrumbLink[] {
    const links: BreadcrumbLink[] = [];
    const tokens: string[] = []

    for (const token of this.path) {
      tokens.push(token);
      links.push({
        label: token,
        path: [...tokens],
      });
    }

    return links;
  }
}
