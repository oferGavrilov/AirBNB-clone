import { Component, Input, OnInit } from '@angular/core';
import { googleMapLoc, Loc, Marker, Stay } from 'src/app/models/stay.model';
import { StayService } from 'src/app/services/stay.service';

@Component({
  selector: 'map',
  templateUrl: './google-map.component.html',
  styleUrls: ['./google-map.component.scss']
})
export class GoogleMapComponent implements OnInit {
  @Input() stay!: Stay;

  constructor(private stayService: StayService) { }
  location !: googleMapLoc
  display: any
  center: google.maps.LatLngLiteral = { lat: 40.084, lng: 34.8 }
  zoom = 10
  prices !: number[]

  markerOptions: google.maps.MarkerOptions = { draggable: false }
  markerPositions: google.maps.LatLngLiteral[] = [];
  // marker !: Marker
  ngOnInit() {
    console.log(this.stay.loc.lat)
    console.log(this.stay.loc.lan)
    this.center.lat = this.stay.loc.lan
    this.center.lng = this.stay.loc.lat
    this.markerPositions.push({
      lat: this.stay.loc.lan,
      lng: this.stay.loc.lat
    })
    this.location ={
      lat: this.stay.loc.lan,
      lng: this.stay.loc.lat,
    }

  }

  getPositions(idx: number) {
    // if (!this.stays) return
    // const { lat, lan: lng } = this.stays[idx].loc
    // return { lat, lng }
  }

  getMarkerPrice() {
    // if (this.stays) return this.prices = this.stays.map(stay => stay.price)
    // return ''
  }

  addMarker(event: google.maps.MapMouseEvent) {
    if (event.latLng != null) {
      this.markerPositions.push(event.latLng.toJSON());
    }
  }

  moveMap(event: google.maps.MapMouseEvent) {
    if (event.latLng != null) {
      this.center = (event.latLng.toJSON());
    }
  }

  move(event: google.maps.MapMouseEvent) {
    if (event.latLng != null) {
      this.display = event.latLng.toJSON();
    }
  }
}
