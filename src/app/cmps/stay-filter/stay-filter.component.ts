import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { faChevronRight, faChevronLeft } from '@fortawesome/free-solid-svg-icons'
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { StayFilter } from 'src/app/models/stay.model';
import { StayService } from 'src/app/services/stay.service';

@Component({
  selector: 'stay-filter',
  templateUrl: './stay-filter.component.html',
  styleUrls: ['./stay-filter.component.scss']
})

export class StayFilterComponent implements OnInit, OnDestroy {
  constructor(
    private breakpointObserver: BreakpointObserver,
    private stayService: StayService) {
    this.breakpointObserver.observe([
      "(max-width:460px)"
    ]).subscribe((result: BreakpointState) => {
      if (result.matches) {
        this.itemsToShow = 3
      }
    })
    this.breakpointObserver.observe([
      "(min-width:600px)"
    ]).subscribe((result: BreakpointState) => {
      if (result.matches) {
        this.itemsToShow = 5
      }
    })
    this.breakpointObserver.observe([
      "(min-width:800px)"
    ]).subscribe((result: BreakpointState) => {
      if (result.matches) {
        this.itemsToShow = 8
      }
    })
    this.breakpointObserver.observe([
      "(min-width:960px)"
    ]).subscribe((result: BreakpointState) => {
      if (result.matches) {
        this.itemsToShow = 12
      }
    })
    this.breakpointObserver.observe([
      "(min-width:1400px)"
    ]).subscribe((result: BreakpointState) => {
      if (result.matches) {
        this.itemsToShow = 14
      }
    })
  }

  faChevronRight = faChevronRight
  faChevronLeft = faChevronLeft
  stayFilter !: StayFilter
  subscription!: Subscription
  index = 0
  itemsToShow = 3

  ngOnInit(): void {
    this.subscription = this.stayService.stayFilter$.subscribe(stayFilter => {
      this.stayFilter = stayFilter
    })
  }

  onClickLabel(label: string): void {
    this.stayFilter.label = label
    this.stayService.setFilter({...this.stayFilter})
  }

  onClickArrow(diff: number) {
    this.index += diff * 3
  }

  checkRightArrow() {
    return this.filters.length - 1 >= this.index + 3 && this.itemsToShow + this.index + 3 <= this.filters.length
  }

  checkLeftArrow() {
    return this.index - 3 >= 0
  }

  getFilters() {
    return this.filters.slice(this.index, this.index + this.itemsToShow)
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }

  filters = [
    { txt: 'OMG!', img: 'assets/img/filter-imgs/omg.jpg' },
    { txt: 'Amazing views', img: 'assets/img/filter-imgs/amazing-views.jpg' },
    { txt: 'Trending', img: 'assets/img/filter-imgs/trending.jpg' },
    { txt: 'Golfing', img: 'assets/img/filter-imgs/golfing.jpg' },
    { txt: 'Surfing', img: 'assets/img/filter-imgs/surfing.jpg' },
    { txt: 'Mansions', img: 'assets/img/filter-imgs/mansions.jpg' },
    { txt: 'Luxe', img: 'assets/img/filter-imgs/luxe.jpg' },
    { txt: 'Private rooms', img: 'assets/img/filter-imgs/private-rooms.jpg' },
    { txt: 'Lakefront', img: 'assets/img/filter-imgs/lake-front.jpg' },
    { txt: 'Castles', img: 'assets/img/filter-imgs/castles.jpg' },
    { txt: 'Tiny homes', img: 'assets/img/filter-imgs/tiny-homes.jpg' },
    { txt: 'Islands', img: 'assets/img/filter-imgs/islands.jpg' },
    { txt: 'Boats', img: 'assets/img/filter-imgs/boats.jpg' },
    { txt: 'Creative spaces', img: 'assets/img/filter-imgs/creative-spaces.jpg' },
    { txt: 'Beach', img: 'assets/img/filter-imgs/beach.jpg' },
    { txt: 'Design', img: 'assets/img/filter-imgs/design.jpg' },
  ]
}
