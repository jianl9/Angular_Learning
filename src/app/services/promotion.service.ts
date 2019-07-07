import { Injectable } from '@angular/core';
import { Promotion } from '../shared/promotion';
import { PROMOTIONS } from '../shared/promotions';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';
import {DISHES} from '../shared/dishes';

@Injectable({
  providedIn: 'root'
})

export class PromotionService {

  constructor() {}

  getPromotions(): Promise<Promotion[]> {
    return of(PROMOTIONS).pipe(delay(500)).toPromise();
  }

  getPromotion(id: string): Promise<Promotion> {
    return of(PROMOTIONS.filter((promotion) => (promotion.id === id)))[0].pipe(delay(500)).toPromise();
  }

  getFeaturedPromotion(): Promise<Promotion> {
    return of(PROMOTIONS.filter((promotion) => promotion.featured)[0]).pipe(delay(500)).toPromise();
  }
}

