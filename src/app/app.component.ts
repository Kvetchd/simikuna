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
	wordLength: number = this.settingsService.wordLength;

  constructor(private settingsService: SettingsService) { }

  ngOnDestroy(): void {
    this.wordLengthSubscription.unsubscribe();
  }
}
