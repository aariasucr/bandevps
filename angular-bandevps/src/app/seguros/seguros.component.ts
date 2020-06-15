import {Component, OnInit} from '@angular/core';
import {SegurosService} from '../shared/seguros.service';
import {Observable} from 'rxjs';
import {Router} from '@angular/router';
@Component({
  selector: 'app-seguros',
  templateUrl: './seguros.component.html',
  styleUrls: ['./seguros.component.css']
})
export class SegurosComponent implements OnInit {
  items: Observable<any[]>;
  constructor(private seguroService: SegurosService, private router: Router) {}
  ngOnInit() {
    this.items = this.seguroService.getInsuranceList();
  }
  navFormSol() {
    this.router.navigate(['/formInsurances']);
    console.log('ENTRE');
  }
}
