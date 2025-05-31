import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ContentSchema} from '@sapphire-cms/core';
import {ManagementService} from '../management.service';

@Component({
  selector: 'scms-management',
  standalone: false,
  templateUrl: './management.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManagementComponent implements OnInit {
  public stores: ContentSchema[] = [];

  constructor(public readonly managementService: ManagementService,
              private readonly cdr: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.managementService.listStores().subscribe(stores => {
      this.stores = stores;
      this.cdr.markForCheck();
    });
  }
}
