import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
// selector: 'app-root' refers to index.html app-root tag
// templateUrl: templete deinfed by app.component.html
// styleUrls: applying style
// inline template can also be used, instead of templateUrl
// same as inline style

export class AppComponent {
  title = 'conFusion';
}
// export: this component can be imported into my app module
// local property - title: accessible from template file
