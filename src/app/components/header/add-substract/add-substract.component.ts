import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-add-substract',
  templateUrl: './add-substract.component.html',
  styleUrls: ['./add-substract.component.scss']
})
export class AddSubstractComponent {

  @Input() value!: number;
  @Output() valueAdd = new EventEmitter<number>();
  @Output() valueSub = new EventEmitter<number>();

  @Input() maxValue!: number;
  @Input() minValue!: number;

  onClickAdd() {
    if (this.value < this.maxValue) {
      this.valueAdd.emit();
    }
  }

  onClickSubstract() {
    if (this.value > this.minValue) {
      this.valueSub.emit();
    }
  }

}
