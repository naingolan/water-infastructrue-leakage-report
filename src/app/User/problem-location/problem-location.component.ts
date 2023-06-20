import { Component, OnInit } from '@angular/core';
declare const google: any; // Import Google Maps typings


@Component({
  selector: 'app-problem-location',
  templateUrl: './problem-location.component.html',
  styleUrls: ['./problem-location.component.css']
})
export class ProblemLocationComponent implements OnInit {
  map: any;
  apiKey ='AIzaSyAuC-zLWbKCbkgZ1UUBlva6iARfqaipGfU'; // Replace with your Google Maps JavaScript API key

  ngOnInit() {
    this.initMap();
  }

  initMap() {
    // Initialize the map
    this.map = new google.maps.Map(document.getElementById('map'), {
      center: { lat: 0, lng: 0 }, // Initial center of the map
      zoom: 10 // Initial zoom level
    });

    // Get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };

          // Center the map on the user's location
          this.map.setCenter(userLocation);

          // Add a marker at the user's location
          new google.maps.Marker({
            position: userLocation,
            map: this.map,
            title: 'User Location'
          });
        },
        (error) => {
          console.log('Error occurred while retrieving location:', error);
        }
      );
    } else {
      console.log('Geolocation is not supported by this browser.');
    }
  }
}
