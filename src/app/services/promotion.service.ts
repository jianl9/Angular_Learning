import { Injectable } from '@angular/core';
import { Promotion } from '../shared/promotion';
import { Observable } from 'rxjs';
import {HttpClient} from '@angular/common/http';
import { baseURL } from '../shared/baseurl';
import { map, catchError } from 'rxjs/operators';
import { ProcessHTTPMsgService } from './process-httpmsg.service';

@Injectable({
  providedIn: 'root'
})

export class PromotionService {

  constructor(private http: HttpClient,
              private processHTTPMsgService: ProcessHTTPMsgService) {}

  getPromotions(): Observable<Promotion[]> {
    // return of(PROMOTIONS).pipe(delay(500)).toPromise();
    return this.http.get<Promotion[]>(baseURL + 'promotions')
      .pipe(catchError(this.processHTTPMsgService.handleError));
  }

  getPromotion(id: string): Observable<Promotion> {
    // return of(PROMOTIONS.filter((promotion) => (promotion.id === id)))[0].pipe(delay(500)).toPromise();
    return this.http.get<Promotion>(baseURL + 'dishes/' + id)
      .pipe(catchError(this.processHTTPMsgService.handleError));
  }

  getFeaturedPromotion(): Observable<Promotion> {
    // return of(PROMOTIONS.filter((promotion) => promotion.featured)[0]).pipe(delay(500)).toPromise();
    return this.http.get<Promotion[]>(baseURL + 'promotions?featured=true').pipe(map(promotions => promotions[0]))
      .pipe(catchError(this.processHTTPMsgService.handleError));
  }
}

