import { Component } from '@angular/core';
import { SettingsService } from './services/settings.service'; 
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
	readonly wordLengthSubscription: Subscription = this.settingsService.wordLengthSubject.subscribe((value) => this.wordLength = value);
  readonly boardWidthSubscription: Subscription = this.settingsService.boardWidthSubject.subscribe((value) => this.boardWidth = value);
	wordLength: number = this.settingsService.wordLength;
  boardWidth: number = this.settingsService.boardWidth;

  constructor(private settingsService: SettingsService) { }

  ngOnDestroy(): void {
    this.wordLengthSubscription.unsubscribe();
    this.boardWidthSubscription.unsubscribe();
  }
}
