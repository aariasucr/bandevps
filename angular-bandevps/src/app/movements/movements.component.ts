import {Component, OnInit, OnDestroy} from '@angular/core';
import {Subject, Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {MovementInfo} from '../shared/models';

@Component({
  selector: 'app-movements',
  templateUrl: './movements.component.html',
  styleUrls: ['./movements.component.css']
})
export class MovementsComponent implements OnInit, OnDestroy {
  dtOptions: DataTables.Settings = {};
  // persons: Person[] = [];
  movements: MovementInfo[] = [];
  // We use this trigger because fetching the list of persons can be quite long,
  // thus we ensure the data is fetched before rendering
  dtTrigger = new Subject();

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 2
    };
    this.get().subscribe((data) => {
      this.movements = data.data as MovementInfo[];
      this.dtTrigger.next();
    });
  }

  get(): Observable<any> {
    return this.http.get('./assets/data.json');
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }
}
