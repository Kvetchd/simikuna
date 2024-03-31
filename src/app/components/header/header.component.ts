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

	constructor(private settingsService: SettingsService) { }
}
