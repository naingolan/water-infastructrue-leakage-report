import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProblemService } from 'src/app/problem.service';
declare const google: any; // Import Google Maps typings


@Component({
  selector: 'app-problem-location',
  templateUrl: './problem-location.component.html',
  styleUrls: ['./problem-location.component.css']
})
export class ProblemLocationComponent implements OnInit {
  map: any;
  apiKey ='AIzaSyAuC-zLWbKCbkgZ1UUBlva6iARfqaipGfU'; // Replace with your Google Maps JavaScript API key

  //taking latitudes and logitudes trial
latitude = 37.12345;
longitude = -122.6789;
problemId: any;
problem: any;

  constructor(
    private problemService: ProblemService,
    private route: ActivatedRoute
  ) { }
  ngOnInit() {
    this.route.params.subscribe(params => {
      this.problemId = params['id'];
      this.fetchProblemById(this.problemId);
    });

  }

  fetchProblemById(problemId:String): void {
    console.log(problemId);
    this.problemService.fetchProblemById(problemId)
      .subscribe((response) => {
        console.log(response);
        this.problem = response;
        this.latitude = this.problem.latitude;
        this.longitude = this.problem.longitude;
       this.initMap(this.latitude, this.longitude);
      });
  }

  initMap(latitude: number, longitude: number) {
    // Initialize the map
    this.map = new google.maps.Map(document.getElementById('map'), {
      center: { lat: latitude, lng: longitude },
      zoom: 10
    });

    // Add a marker at the specified location
    new google.maps.Marker({
      position: { lat: latitude, lng: longitude },
      map: this.map,
      title: 'Location'
    });
  }


    // // Get user's location
    // if (navigator.geolocation) {
    //   navigator.geolocation.getCurrentPosition(
    //     (position) => {
    //       const userLocation = {
    //         lat: position.coords.latitude,
    //         lng: position.coords.longitude
    //       };

    //       // Center the map on the user's location
    //       this.map.setCenter(userLocation);

    //       // Add a marker at the user's location
    //       new google.maps.Marker({
    //         position: userLocation,
    //         map: this.map,
    //         title: 'User Location'
    //       });
    //     },
    //     (error) => {
    //       console.log('Error occurred while retrieving location:', error);
    //     }
    //   );
    //
  //  } else {
  //     console.log('Geolocation is not supported by this browser.');
  //   }
  // }
}
