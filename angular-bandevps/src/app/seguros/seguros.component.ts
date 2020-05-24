import {Component, OnInit} from '@angular/core';
import {SegurosService} from '../shared/seguros.service';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-seguros',
  templateUrl: './seguros.component.html',
  styleUrls: ['./seguros.component.css']
})
export class SegurosComponent implements OnInit {
  items: Observable<any[]>;
  constructor(private seguroService: SegurosService) {}

  ngOnInit() {}
  obtieneSeguros() {
    this.items = this.seguroService.getCustomersList();
  }
}
