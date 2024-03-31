import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  wordLengthSubject: Subject<number> = new Subject<number>;

  MAX_WORD_LENGTH = 8;
  DEFAULT_WORD_LENGTH = 5;
  MIN_WORD_LENGTH = 4;

  wordLength = this.DEFAULT_WORD_LENGTH;

  addWordLength() {
    this.wordLength += 1;
    this.wordLengthSubject.next(this.wordLength);
  }
  subWordLength() {
    this.wordLength -= 1;
    this.wordLengthSubject.next(this.wordLength);
  }

  constructor() { }
}
