import { Component, OnInit } from '@angular/core';
import { Dish } from '../shared/dish';
import { DISHES } from '../shared/dishes';
import {DishService} from '../services/dish.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})

export class MenuComponent implements OnInit {

  // dishes: Dish[] = DISHES; // assign dishes info into variable;
  dishes: Dish[];

  selectedDish: Dish;

  constructor(private dishService: DishService) {
  }

  ngOnInit() {
    this.dishes = this.dishService.getDishes(); // fetch dishes info and assign into variable
  }

  onSelect(dish: Dish) {
    this.selectedDish = dish;
  }
}
