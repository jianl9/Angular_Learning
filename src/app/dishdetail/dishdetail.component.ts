import {Component, OnInit, ViewChild, Inject} from '@angular/core';
import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Dish } from '../shared/dish';
import {DishService} from '../services/dish.service';
import {count, switchMap} from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Comment } from '../shared/comment';
import { trigger, state, style, animate, transition } from '@angular/animations';
import {expand, flyInOut, visibility} from '../animations/app.animation';


@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss'],
  animations: [
    visibility(), flyInOut(), expand()
  ],
  // tslint:disable-next-line:use-host-property-decorator
  host: {
    '[@flyInOut]': 'true',
    'style': 'display: block;'
  }
})

export class DishdetailComponent implements OnInit {

  dish: Dish;
  errMess: string;
  dishIds: string[];
  prev: string;
  next: string;
  commentForm: FormGroup;
  comment: Comment;
  @ViewChild('cform') commentFormDirective;
  dishcopy: Dish;
  visibility = 'shown';

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
              private cf: FormBuilder,
              @Inject('BaseURL') private BaseURL) {
  }

  ngOnInit() { // e.g dishdetail/0; params to get that 0
    this.createForm();
    this.dishservice.getDishIds()
      .subscribe(dishIds => this.dishIds = dishIds); // assign array of id to dishIds
    this.route.params.pipe(switchMap((params: Params) => {this.visibility = 'hidden'; return this.dishservice.getDish(params['id']); }))
      .subscribe(dish => { this.dish = dish; this.dishcopy = dish; this.setPrevNext(dish.id); this.visibility = 'shown'; },
        errmess => this.errMess = <any>errmess); // when a dish gets selected, routes changes and we get its id
    // and make it to fetch new dish
    // dishcopy: anytime dish info is modified in the route paras, also with saving the fish info to this.dish; also save a copy to dishcopy
    // visibility: whenever route.param changes, it first hide current dish and show new dish
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
    this.dishcopy.comments.push(this.comment); // modify dishcopy instead of dish; let dish waits for the server side being changed
    this.dishservice.putDish(this.dishcopy).subscribe(dish => {
      this.dish = dish; this.dishcopy = dish;
    },
      errmess => {this.dish = null; this.dishcopy = null; this.errMess = <any>errmess; }); // when the reply from server received
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
