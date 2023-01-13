import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ICarrera } from '../planes/interfaces/planes.interfaces';

@Component({
  selector: 'app-dropwdown',
  templateUrl: './dropwdown.component.html',
  styleUrls: ['./dropwdown.component.scss']
})
export class DropwdownComponent implements OnInit {

  @Input() defaultOptionTitle:string = 'Seleccionar'

  @Input() selectOptions:ICarrera[] = []

  @Output() onSelected: EventEmitter<ICarrera> = new EventEmitter<ICarrera>();

  selectedOption!:ICarrera

  constructor() { }

  ngOnInit(): void {
  }

  onSelect(carrera:any):void{
    this.onSelected.emit(this.selectedOption)
  }



}
