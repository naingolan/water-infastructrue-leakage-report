import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AnnouncementService } from '../../anouncement.service';

@Component({
  selector: 'app-user-anouncement',
  templateUrl: './user-anouncements.component.html',
  styleUrls: ['./user-anouncements.component.css']
})
export class UserAnouncementComponent implements OnInit {
  announcementForm!: FormGroup;
  announcements!: any[];

  constructor(
    private formBuilder: FormBuilder,
    private announcementService: AnnouncementService
  ) { }

  ngOnInit(): void {
    this.announcementForm = this.formBuilder.group({
      header: ['', Validators.required],
      content: ['', Validators.required],
      createdBy: ['', Validators.required],
    });

    this.fetchAnnouncements();
  }

  fetchAnnouncements(): void {
    this.announcementService.getAnnouncements().subscribe(
      (announcements: any[]) => {
        this.announcements = announcements.reverse();
      },
      (error: any) => {
        console.error('Error fetching announcements:', error);
      }
    );
  }

  createAnnouncement(): void {
    if (this.announcementForm.invalid) {
      return;
    }

    const announcement = this.announcementForm.value;

    this.announcementService.createAnnouncement(announcement).subscribe(
      (response: any) => {
        console.log('Announcement created successfully');
        // Clear the form and fetch the updated list of announcements
        this.announcementForm.reset();
        this.fetchAnnouncements();
      },
      (error: any) => {
        console.error('Error creating announcement:', error);
      }
    );
  }
}
