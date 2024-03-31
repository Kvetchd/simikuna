import { Component, Input } from '@angular/core';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.scss']
})
export class HeaderComponent {	
	@Input() wordLength = this.settingsService.wordLength;
	wordMax = this.settingsService.MAX_WORD_LENGTH;
	wordMin= this.settingsService.MIN_WORD_LENGTH;

	onAddWordLength() {
		this.settingsService.addWordLength();
	}
	onSubWordLength() {
		this.settingsService.subWordLength();
	}

	@Input() numTries = this.settingsService.numTries;
	numMax = this.settingsService.MAX_NUM_TRIES;
	numMin = this.settingsService.MIN_NUM_TRIES;

	onAddNumTries() {
		this.settingsService.addNumTries();
	}
	onSubNumTries() {
		this.settingsService.subNumTries();
	}

	constructor(private settingsService: SettingsService) { }
}
