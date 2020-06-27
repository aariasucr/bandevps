import {Component, OnInit, ViewChild, OnDestroy} from '@angular/core';
import {LocationsService} from '../shared/locations.service';
import {Observable, Subscription} from 'rxjs';
import {MapInfoWindow, MapMarker} from '@angular/google-maps';
import { async } from '@angular/core/testing';

@Component({
  selector: 'app-ubicaciones',
  templateUrl: './ubicaciones.component.html',
  styleUrls: ['./ubicaciones.component.css']
})
export class UbicacionesComponent implements OnInit, OnDestroy {
  @ViewChild(MapInfoWindow, {static: false}) infoWindow: MapInfoWindow;

  items: Observable<any[]>;

  latValue = 9.951309;
  lngValue = -84.046914;

  positions = [
    {
      post_country: 'Vietnam',
      post_latitude: 10.4452129,
      post_longitude: 106.4729811,
      post_description: 'lorem '
    },
    {
      post_country: 'Kyrgyzstan',
      post_latitude: 41.1694718,
      post_longitude: 75.8098141,
      post_description: 'lorem '
    },
    {
      post_country: 'China',
      post_latitude: 34.2456501,
      post_longitude: 108.9877602,
      post_description: 'lorem '
    }
  ];

  center = {lat: this.latValue, lng: this.lngValue};
  zoom = 8;
  display?: google.maps.LatLngLiteral;
  markerOptions = {draggable: false};
  markerPositions: google.maps.LatLngLiteral[] = [];
  locationsSuscription:Subscription
  constructor(private locationsService: LocationsService) {}


  ngOnInit() {
  this.locationsSuscription=this.locationsService.getLocationsList().subscribe((result)=>{
    console.log(result);
    result.forEach((elemt)=>{
      this.markerPositions.push({lat:elemt.post_latitude,lng:elemt.post_longitude});
    })
    });

  }

  ngOnDestroy(): void {
    if(!!this.locationsSuscription){
      this.locationsSuscription.unsubscribe()
    }
  }

  addMarker(event: google.maps.MouseEvent) {

    this.markerPositions.push(event.latLng.toJSON());
    console.log(event.latLng.toJSON())
  }

  move(event: google.maps.MouseEvent) {
    this.display = event.latLng.toJSON();
  }

  openInfoWindow(marker: MapMarker) {
    this.infoWindow.open(marker);
  }

  removeLastMarker() {
    this.markerPositions.pop();
  }
}
