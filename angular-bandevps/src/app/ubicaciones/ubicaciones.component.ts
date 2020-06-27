import { Component, OnInit } from '@angular/core';
import {LocationsService} from '../shared/locations.service';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-ubicaciones',
  templateUrl: './ubicaciones.component.html',
  styleUrls: ['./ubicaciones.component.css']
})
export class UbicacionesComponent implements OnInit {
  items: Observable<any[]>;
  constructor(private locationsService: LocationsService) {}



  ngOnInit() {
    this.items = this.locationsService.getLocationsList();
    console.log(this.items)
  }


lat = 6.05246325;
log = 9.01555559;

positions = [{
    "post_country": "Vietnam",
    "post_latitude": 10.4452129,
    "post_longitude": 106.4729811,
    "post_description":"lorem "
}, {
    "post_country": "Kyrgyzstan",
    "post_latitude": 41.1694718,
    "post_longitude": 75.8098141,
    "post_description":"lorem "
}, {

    "post_country": "China",
    "post_latitude": 34.2456501,
    "post_longitude": 108.9877602,
    "post_description":"lorem "
}]
}
