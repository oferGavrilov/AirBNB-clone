import { Component, Input, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Stay } from 'src/app/models/stay.model';
import { faStar, faCircleMinus, faCirclePlus, faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons'
import { CalendarOptions } from 'ngx-airbnb-calendar';
import { OrderService } from 'src/app/services/order.service';
import { UserService } from 'src/app/services/user.service';
import { Order } from 'src/app/models/order.model';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'stay-order',
  templateUrl: './stay-order.component.html',
  styleUrls: ['./stay-order.component.scss']
})
export class StayOrderComponent implements OnInit, OnDestroy {
  constructor(private orderService: OrderService,
    private userService: UserService,
    private snackBar: MatSnackBar) { }
    
  @Input() stay !: Stay
  @Output() setIsReserveClick = new EventEmitter<boolean>()

  faCirclePlus = faCirclePlus
  faCircleMinus = faCircleMinus
  faChevronDown = faChevronDown
  faChevronUp = faChevronUp
  faStar = faStar

  date: string | null = null
  totalDays!: any
  children: number = 0
  showGuestModal: boolean = false
  order !: Order
  subscription!: Subscription

  options: CalendarOptions = {
    format: "yyyy/LL/dd",
    formatDays: "eeeeee",
    firstCalendarDay: 1,
    closeOnSelected: true,
  }

  ngOnInit() {
    this.subscription = this.orderService.order$.subscribe(order => this.order = order)
    if (!this.order.startDate.getTime()) this.order.startDate = new Date()
    if (!this.order.endDate.getTime()) this.order.endDate = new Date(Date.now() + (3600 * 1000 * 72))
    this.date = this.dateFromOrder
  }

  public toggleGuestModal() {
    this.showGuestModal = !this.showGuestModal
  }

  get GetTotalDays() {
    return this.getCheckOut().getDate() - this.getCheckIn().getDate()
  }

  get Price() {
    return this.stay.price * this.GetTotalDays
  }

  get CleanTax() {
    return (this.Price * 0.10).toFixed()
  }

  get ServiceFee() {
    return (this.Price * 0.17).toFixed()
  }

  get TotalPrice() {
    return (+this.Price + +this.CleanTax + +this.ServiceFee)
  }

  get dateFromOrder() {
    if (!this.order.startDate.getMilliseconds() || !this.order.endDate.getMilliseconds()) return ''
    return this.order.startDate.toDateString() + '-' + this.order.endDate.toDateString()
  }

  getGuests() {
    let str = this.order.guests.adults + this.order.guests.children > 0 ? (this.order.guests.adults + this.order.guests.children) + ' guests ' : ''
    str += this.order.guests.infants > 0 ? ' ,' + this.order.guests.infants + ' infants ' : ''
    str += this.order.guests.pets > 0 ? ' ,' + this.order.guests.pets + ' pets ' : ''
    return str
  }

  getCheckIn() {
    if (this.date) {
      const dates = this.date?.split('-')
      if (dates.length >= 1) {
        this.order.startDate = new Date(dates[0])
        return new Date(dates[0])
      }
    }
    return this.order.startDate
  }

  getCheckOut() {
    if (this.date) {
      const dates = this.date?.split('-')
      if (dates.length === 2) {
        this.order.endDate = new Date(dates[1])
        return new Date(dates[1])
      }
    }
    return this.order.endDate
  }

  onAddOrder() {
    const user = this.userService.getUser()
    if (!user) this.snackBar.open('Please login first', 'Close', { duration: 3000 })
    else {
      this.order.host._id = this.stay.host._id
      this.order.host.fullname = this.stay.host.fullname
      this.order.buyer = { _id: user._id, fullname: user.fullname }
      this.order.totalPrice = this.TotalPrice
      this.order.stay = { _id: this.stay._id, name: this.stay.name, price: this.stay.price }
      this.setIsReserveClick.emit(true)
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe()
  }
}