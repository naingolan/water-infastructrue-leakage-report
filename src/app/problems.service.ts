import { Injectable } from '@angular/core';

export interface Problem{
  id: number;
  name: string;
  imageSrc: string;
  description: string;
  location: string;
  reporter: string;
  status: string;
}
@Injectable({
  providedIn: 'root'
})
export class ProblemsService {
  problems: Problem[] = [
    {
      id: 1,
      name: 'Pothole',
      imageSrc: 'assets/leak2.png',
      description: 'A pothole is a depression in a road surface, usually asphalt pavement, where traffic has removed broken pieces of the pavement. It is usually the result of water in the underlying soil structure and traffic passing over the affected area.',
      location: 'Tabata, Dar es Salaam',
      reporter: 'John Doe',
      status: 'Pending'
    },
    {
      id: 2,
      name: 'Pothole',
      imageSrc: 'assets/leak2.png',
      description: 'A pothole is a depression in a road surface, usually asphalt pavement, where traffic has removed broken pieces of the pavement. It is usually the result of water in the underlying soil structure and traffic passing over the affected area.',
      location: 'Tabata, Dar es Salaam',
      reporter: 'John Doe',
      status: 'Pending'
    }
  ]

  constructor() { }
}
