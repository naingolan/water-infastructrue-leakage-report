import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Retrieve the token from local storage or wherever you have stored it
    const token = localStorage.getItem('token'); // Replace 'token' with the key you used to store the token
    
    // Clone the request and add the token to the 'Authorization' header
    const authRequest = request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    
    // Pass the modified request to the next interceptor or the HTTP handler
    return next.handle(authRequest);
  }
}
