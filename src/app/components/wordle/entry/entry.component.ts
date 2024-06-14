import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { WORDS } from '../../../words';

interface Subentry {
  type: string,
  trans: string,
  def: string,
  example: string,
  exampleTrans: string
}

@Component({
  selector: 'app-entry',
  templateUrl: './entry.component.html',
  styleUrls: ['./entry.component.scss']
})
export class EntryComponent {
  @Input() won!: boolean;
  @Input() targetIndex!: number;

  @ViewChild('entry') entry!: ElementRef;
  entryContainer: any;

  targetWord!: string;
  subentries: Subentry[] = [];

  ngOnInit() {

  }

  ngOnChanges() {
    if (this.won) { 
      this.targetWord = WORDS[this.targetIndex].word;

      this.subentries[0] = WORDS[this.targetIndex].subentry1;

      let entryLength = Object.keys(WORDS[this.targetIndex]).length;
      if (entryLength > 2) {
        this.subentries[1] = WORDS[this.targetIndex].subentry2!;
        if (entryLength > 3) {
          this.subentries[2] = WORDS[this.targetIndex].subentry3!;
        }
      }

      console.log("hola")

      this.entryContainer = this.entry.nativeElement;

      this.entryContainer.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest"
      });
    }
  }

  ngDoCheck() {
    if (this.won) {

    }
  }
}
