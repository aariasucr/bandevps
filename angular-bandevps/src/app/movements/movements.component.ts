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
import {Subject, Observable} from 'rxjs';
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

  @Input() data = null; //: Observable<MovementInfo[]>;
  movements: MovementInfo[] = [];

  constructor() {} // private http: HttpClient

  ngOnInit(): void {
    this.dtOptions = {
      searching: false,
      paging: true,
      pagingType: 'full_numbers',
      pageLength: 2
    };

    // this.data.subscribe((value) => {
    //   console.log(value);
    // });
    // this.get().subscribe((data) => {
    //   this.movements = data.data as MovementInfo[];
    //   this.dtTrigger.next();
    // });
  }

  // rerender(): void {
  //   this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
  //     // Destroy the table first
  //     dtInstance.destroy();
  //     // Call the dtTrigger to rerender again
  //     this.dtTrigger.next();
  //   });
  // }

  // get(): Observable<any> {
  //   return this.http.get('./assets/data.json');
  // }
  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  ngOnChanges(changes: SimpleChanges) {
    // only run when property "data" changed
    if (changes['data']) {
      console.log(this.data);
      this.movements = this.data as MovementInfo[];

      if (this.isDtInitialized) {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
          this.dtTrigger.next();
        });
      } else {
        this.isDtInitialized = true;
        this.dtTrigger.next();
      }
    }
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }
}
