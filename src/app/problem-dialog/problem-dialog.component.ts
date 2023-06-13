import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Problem } from '../problems.service';

@Component({
  selector: 'app-problem-dialog',
  templateUrl: './problem-dialog.component.html',
  styleUrls: ['./problem-dialog.component.css']
})
export class ProblemDialogComponent implements OnInit {
  problemForm!: FormGroup;
  imagePreview!: string;
  defaultStatus = 'Pending';
  

  constructor(
    private dialogRef: MatDialogRef<ProblemDialogComponent>,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.problemForm = this.formBuilder.group({
      name: ['', Validators.required],
      location: ['', Validators.required],
      reporter: ['', Validators.required],
      image: [''],
      status: [this.defaultStatus]
    });
  }

  onImageSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.problemForm.patchValue({
        image: file
      });

      this.previewImage(file);
    }
  }

  previewImage(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  onSubmit() {
    if (this.problemForm.valid) {
      const problem: Problem = this.problemForm.value;
      this.dialogRef.close(problem);
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
