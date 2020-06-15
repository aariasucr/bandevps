import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
  AfterViewInit
} from '@angular/core';
import {Subject} from 'rxjs';
import {MovementInfo} from '../shared/models';
import {DataTableDirective} from 'angular-datatables';

@Component({
  selector: 'app-movements',
  templateUrl: './movements.component.html',
  styleUrls: ['./movements.component.css']
})
export class MovementsComponent implements OnInit, OnDestroy, AfterViewInit, OnChanges {
  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;
  isDtInitialized = false;
  dtOptions: DataTables.Settings;
  dtTrigger = new Subject();

  @Input() data = null;
  movements: MovementInfo[] = [];

  constructor() {}

  ngOnInit(): void {
    this.dtOptions = {
      searching: false,
      paging: true,
      pagingType: 'full_numbers',
      pageLength: 10,
      autoWidth: true
    };
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  ngOnChanges(changes: SimpleChanges) {
    // only run when property "data" changed
    if (changes['data']) {
      if (this.isDtInitialized) {
        this.rerender();
      } else {
        this.movements = this.data;
        this.isDtInitialized = true;
      }
    }
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();

      // reload your data
      this.reloadData(() => {
        // Call the dtTrigger to rerender **on callback**
        this.dtTrigger.next();
      });
    });
  }

  reloadData(callback) {
    this.movements = this.data;
    callback();
  }
}
