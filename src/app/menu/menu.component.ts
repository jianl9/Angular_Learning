import { Component, OnInit, Inject } from '@angular/core';
import { Dish } from '../shared/dish';
import {DishService} from '../services/dish.service';
import {expand, flyInOut} from '../animations/app.animation';


@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  // tslint:disable-next-line:use-host-property-decorator
  host: {
    '[@flyInOut]': 'true',
    'style': 'display: block;'
  },
  animations: [
    flyInOut(), expand()
  ]
})

export class MenuComponent implements OnInit {

  // dishes: Dish[] = DISHES; // assign dishes info into variable;
  dishes: Dish[];
  selectedDish: Dish;
  errMess: string;

  constructor(private dishService: DishService,
              @Inject('BaseURL') private BaseURL) { } // inject baseURL as we specify baseURL as provider before

  ngOnInit() {
    this.dishService.getDishes()
      .subscribe(dishes => this.dishes = dishes, // fetch dishes info and assign into variable
        errmess => this.errMess = <any>errmess);
    // if the observable is returned with the observable throw, then this function will be executed.
    // We take the error message and capture that error msg into errMess string that we have here and make it available to use
    // so we can display this erro msg on the view of this menu component.
  }

  onSelect(dish: Dish) {
    this.selectedDish = dish;
  }
}
