import { Component, HostListener, Output, EventEmitter, Input } from '@angular/core';

enum LetterState {
	// you know
	WRONG,
	// letter in a word but position is wrong
	PARTIAL_MATCH,
	// letter and position are all correct
	FULL_MATCH,
	// before the current try is submitted
	PENDING,
}

@Component({
  selector: 'app-keyboard',
  templateUrl: './keyboard.component.html',
  styleUrls: ['./keyboard.component.scss']
})

export class KeyboardComponent {

	// Keyboard rows.
	readonly keyboardRows = [
		['Q', 'W', 'R', 'T', 'Y', 'U', 'I', 'P'],
		['A', 'S', 'H', 'K', 'L', 'Ñ'],
		['Enter', 'C', 'N', 'M', 'Backspace'],
	];

	@Output() newItemEvent = new EventEmitter<string>();
	addNewItem(value: string) {
		this.newItemEvent.emit(value);
	}

	@HostListener('document:keydown', ['$event'])
	handleKeyboardEvent(event: KeyboardEvent) {
		this.newItemEvent.emit(event.key);
	}
	
	@Input() curLetterStates: {[key: string]: LetterState} = {};

	// Returns the classes for the given keyboard key based on its state
	getKeyClass(key: string): string {
		const state = this.curLetterStates[key.toLowerCase()];
		switch (state) {
			case LetterState.FULL_MATCH:
				return 'match key';
			case LetterState.PARTIAL_MATCH:
				return 'partial key';
			case LetterState.WRONG:
				return 'wrong key';
			default:
				return 'key';
		}
	}
	constructor() { }
}
