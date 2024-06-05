import { Component, Input } from '@angular/core';
import { Orders } from '../../../models/Orders';

@Component({
  selector: 'app-order-form',
  templateUrl: './order-form.component.html',
  styleUrl: './order-form.component.css'
})
export class OrderFormComponent {

  @Input() order!:Orders;

}
