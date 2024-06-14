import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  wordLengthSubject: Subject<number> = new Subject<number>;
  boardWidthSubject: Subject<number> = new Subject<number>;

  MAX_WORD_LENGTH = 8;
  DEFAULT_WORD_LENGTH = 5;
  DEFAULT_BOARD_WIDTH = 350;
  MIN_WORD_LENGTH = 4;

  wordLength = this.DEFAULT_WORD_LENGTH;
  boardWidth = this.DEFAULT_BOARD_WIDTH;

  addWordLength() {
    this.wordLength += 1;
    this.boardWidth += 67;
    this.wordLengthSubject.next(this.wordLength);
    this.boardWidthSubject.next(this.boardWidth);
  }
  subWordLength() {
    this.wordLength -= 1;
    this.boardWidth -= 67;
    this.wordLengthSubject.next(this.wordLength);
    this.boardWidthSubject.next(this.boardWidth);
  }

  constructor() { }
}
