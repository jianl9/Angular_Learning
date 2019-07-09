import {Component, OnInit, ViewChild} from '@angular/core';
import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Dish } from '../shared/dish';
import {DishService} from '../services/dish.service';
import {count, switchMap} from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Comment } from '../shared/comment';


@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss']
})

export class DishdetailComponent implements OnInit {

  dish: Dish;
  dishIds: string[];
  prev: string;
  next: string;
  commentForm: FormGroup;
  comment: Comment;
  @ViewChild('cform') commentFormDirective;

  formErrors = {
    'author': '',
    'comment': ''
  };

  validationMessages = {
    'author': {
      'required':    'Name is required.',
      'minlength':   'Name must be at least 2 characters long.',
      'maxlength':   'Name cannot be more than 25 characters long.'
    },
    'comment': {
    'required':    'Comment is required.',
    'minlength':   'Comment must be at least 1 characters long.',
    },
  };

  constructor(private dishservice: DishService,
              private route: ActivatedRoute,
              private location: Location,
              private cf: FormBuilder) {
    this.createForm();
  }

  ngOnInit() { // e.g dishdetail/0; params to get that 0
    this.dishservice.getDishIds().subscribe(dishIds => this.dishIds = dishIds); // assign array of id to dishIds
    this.route.params.pipe(switchMap((params: Params) => this.dishservice.getDish(params['id'])))
      .subscribe(dish => { this.dish = dish; this.setPrevNext(dish.id); }); // when a dish gets selected, routes changes and we get its id
    // and make it to fetch new dish
  }

  setPrevNext(dishId: string) { // get prev/next dish index
    const index = this.dishIds.indexOf(dishId); // get current id
    // tslint:disable-next-line:max-line-length
    this.prev = this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length]; // get prev value; if index is 0 get to the last index;
    this.next = this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length];
  }

  goBack(): void {
    this.location.back();
  }

  createForm() {
    this.commentForm = this.cf.group({
      author: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)]],
      comment: ['', [Validators.required, Validators.minLength(1)]],
      rating: 5
    });

    this.commentForm.valueChanges
      .subscribe(data => this.onValueChanged(data));

    this.onValueChanged(); // (re)set validation messages now
  }

  onValueChanged(data?: any) {
    if (!this.commentForm) { return; } // if the method get called but no from created, just return
    const form = this.commentForm;
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        this.formErrors[field] = ''; // clear previous error message (if any)
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }

  onSubmit() {
    this.comment = this.commentForm.value;
    this.comment['date'] = new Date().toDateString();
    console.log(this.comment);
    this.dish.comments.push(this.comment);
    this.commentForm.reset({
      author: '',
      comment: '',
      rating: 5
    });
    this.commentFormDirective.resetForm({
      author: '',
      comment: '',
      rating: 5
    });
  }

}
