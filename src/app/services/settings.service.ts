import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  wordLengthSubject: Subject<number> = new Subject<number>;
  numTriesSubject: Subject<number> = new Subject<number>;

  MAX_WORD_LENGTH = 8;
  DEFAULT_WORD_LENGTH = 5;
  MIN_WORD_LENGTH = 4;
  
  MAX_NUM_TRIES = 9;
  DEFAULT_NUM_TRIES = 6;
  MIN_NUM_TRIES = 3;

  wordLength = this.DEFAULT_WORD_LENGTH;
  addWordLength() {
    this.wordLength += 1;
    this.wordLengthSubject.next(this.wordLength);
  }
  subWordLength() {
    this.wordLength -= 1;
    this.wordLengthSubject.next(this.wordLength);
  }
  
  numTries = this.DEFAULT_NUM_TRIES;
  addNumTries() {
    this.numTries += 1;
    this.numTriesSubject.next(this.numTries);
  }
  subNumTries () {
    this.numTries -= 1;
    this.numTriesSubject.next(this.numTries);
  }
  

  constructor() { }
}
