import { Component, OnInit } from '@angular/core';
import { SegurosService } from '../shared/seguros.service';

@Component({
  selector: 'app-seguros',
  templateUrl: './seguros.component.html',
  styleUrls: ['./seguros.component.css']
})
export class SegurosComponent implements OnInit {

  constructor(private seguroService:SegurosService) { }

  ngOnInit() {
  }
  obtieneSeguros(){
    this.seguroService.getCustomersList();
  }
}
