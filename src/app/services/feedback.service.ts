import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ProcessHTTPMsgService} from './process-httpmsg.service';
import {Dish} from '../shared/dish';
import {Observable} from 'rxjs';
import {baseURL} from '../shared/baseurl';
import {catchError} from 'rxjs/operators';
import {Feedback} from '../shared/feedback';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {

  constructor(private http: HttpClient,
              private processHTTPMsgService: ProcessHTTPMsgService) { }

  submitFeedback(fb: Feedback): Observable<Feedback> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };

    // location, obj, http method
    return this.http.post<Feedback>(baseURL + 'feedback/', fb, httpOptions)
      .pipe(catchError(this.processHTTPMsgService.handleError));

  }
}
