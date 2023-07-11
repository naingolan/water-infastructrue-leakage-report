import { AfterViewInit, Component } from '@angular/core';

declare var google: any;

@Component({
  selector: 'app-map',
  template: `
    <div id="map"></div>
  `
})
export class MapComponent implements AfterViewInit {
  latitude!: number;
  longitude!: number;
  map: any;
  geocoder: any;

  constructor() {}

  ngAfterViewInit(): void {
    this.initializeMap();
  }

  initializeMap(): void {
    this.map = new google.maps.Map(document.getElementById('map'), {
      center: { lat: this.latitude, lng: this.longitude },
      zoom: 8
    });

    this.geocoder = new google.maps.Geocoder();

    this.map.addListener('click', (event: any) => {
      this.latitude = event.latLng.lat();
      this.longitude = event.latLng.lng();

      this.fetchPlaceDetails(this.latitude, this.longitude);
    });
  }

  fetchPlaceDetails(latitude: number, longitude: number): void {
    const latLng = new google.maps.LatLng(latitude, longitude);

    this.geocoder.geocode({ location: latLng }, (results: any[], status: any) => {
      if (status === google.maps.GeocoderStatus.OK) {
        if (results[0]) {
          const place = results[0];

          // Extract the address components
          const country = this.getAddressComponent(place, 'country');
          const region = this.getAddressComponent(place, 'administrative_area_level_1');
          const district = this.getAddressComponent(place, 'administrative_area_level_2');
          const ward = this.getAddressComponent(place, 'administrative_area_level_3');
          const street = this.getAddressComponent(place, 'route');

          console.log('Country:', country);
          console.log('Region:', region);
          console.log('District:', district);
          console.log('Ward:', ward);
          console.log('Street:', street);
        }
      } else {
        console.error('Geocoder failed due to:', status);
      }
    });
  }

  getAddressComponent(place: any, type: string): string {
    const component = place.address_components.find((component: any) =>
      component.types.includes(type)
    );

    return component ? component.long_name : '';
  }
}
