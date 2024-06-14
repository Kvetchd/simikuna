import { Component, ElementRef, QueryList, ViewChild, ViewChildren, Input, TemplateRef } from '@angular/core';
import { SettingsService } from 'src/app/services/settings.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { WORDS } from '../../words';

// Letter map
const LETTERS: {[key: string]: boolean} = {'a': true, 'c': true, 'h': true, 'i': true, 'k': true, 'l': true, 'm': true, 'n': true, 'ñ': true, 'p': true, 'q': true, 'r': true, 's': true, 't': true, 'u': true, 'w': true, 'y': true}

// One try
interface Try {
	letters: Letter[];
}

// One letter in a try
interface Letter {
	text: string;
	state: LetterState;
}

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
	selector: 'app-wordle',
	templateUrl: './wordle.component.html',
	styleUrls: ['./wordle.component.scss']
})
export class WordleComponent {
	@ViewChild('greeting') greeting!: TemplateRef<void>;
	@ViewChildren('tryContainer') tryContainers!: QueryList<ElementRef>;

	modalRef?: BsModalRef;

	@Input() boardWidth: number = this.settingsService.boardWidth;

	@Input() wordLength: number = this.settingsService.wordLength;

	readonly numTries: number = 6;

	// Stores all tries
	// One try is one row in the UI
	tries: Try[] = [];

	// This is to make LetterState enum accessible in html template
	readonly LetterState = LetterState;

	// Stores the state for the keyboard key indexed by keys
	readonly curLetterStates: {[key: string]: LetterState} = {};

	// Message shown in the message panel
	infoMsg = '';

	// Controls info message's fading-out animation
	fadeOutInfoMessage = false;

	showShareDialogContainer = false;
	showShareDialog = false;

	// Tracks the current letter index
	private curLetterIndex = 0;

	// Tracks the number of submitted tries
	private numSubmittedTries = 0;

	targetIndex!: number;

	// Store the target word
	targetWord = '';

	// Won or not
	won = false;

	// Stores the count for each letter from the target word
	//
	// For example, if the target word is 'happy', then this map will look like:
	//
	// {'h': 1, 'a': 1, 'p': 2, 'y': 1}
	private targetWordLetterCounts: {[letter: string]: number} = {};

	constructor(private settingsService: SettingsService, private modalService: BsModalService) { }

	handleClickKey(key: string) {
		// Don't process key down when user has won the game
		if (this.won) {
			return;
		}

		// If key is a letter, update the text in the corresponding letter object
		if (LETTERS[key.toLowerCase()]) {
			// Only allow typing letters in the current try. Don't go over if the current try has not been submitted
			if (this.curLetterIndex < (this.numSubmittedTries + 1) * this.settingsService.wordLength) {
				this.setLetter(key);
				this.curLetterIndex++;
			}
		}

		// Handle delete
		else if (key === 'Backspace') {
			// Don't delete previous try
			if (this.curLetterIndex > this.numSubmittedTries * this.settingsService.wordLength) {
				this.curLetterIndex--;
				this.setLetter('');
			}
		}

		// Submit the current try and check
		else if (key === 'Enter') {
			this.checkCurrentTry();
		}
	}

	handleClickShare() {
		// Copy results into clipboard.
		let clipboardContent = '';
		for (let i = 0; i < this.numSubmittedTries; i++) {
			for (let j = 0; j < this.settingsService.wordLength; j++) {
				const letter = this.tries[i].letters[j];
				switch (letter.state) {
					case LetterState.FULL_MATCH:
						clipboardContent += '';
						break;
					case LetterState.PARTIAL_MATCH:
						clipboardContent += '';
						break;
					case LetterState.WRONG:
						clipboardContent += '';
						break;
					default:
						break;
				}
			}
			clipboardContent += '\n';
		}
		console.log(clipboardContent);
		navigator.clipboard.writeText(clipboardContent);
		this.showShareDialogContainer = false;
		this.showShareDialog = false;
		this.showInfoMessage('Copied results to clipboard');
	}

	private setLetter(letter: string) {
		const tryIndex = Math.floor(this.curLetterIndex / this.settingsService.wordLength);
		const letterIndex = this.curLetterIndex - tryIndex * this.settingsService.wordLength;
		this.tries[tryIndex].letters[letterIndex].text = letter;
	}

	private async checkCurrentTry() {
		// Check if user has typed all the letters
		const curTry = this.tries[this.numSubmittedTries];
		if (curTry.letters.some(letter => letter.text === '')) {
			this.showInfoMessage('Not enough letters');
			return;
		}

		// Check if the current try is a word in the list
		const wordFromCurTry = 
			curTry.letters.map(letter => letter.text).join('').toUpperCase();
		
		if (!WORDS.some(entry => entry.word === wordFromCurTry)) {
			this.showInfoMessage('Not in word list');
			// Shake the current row
			const tryContainer =
				this.tryContainers.get(this.numSubmittedTries)?.nativeElement as HTMLElement;
			tryContainer.classList.add('shake');
			setTimeout(() => {
				tryContainer.classList.remove('shake');
			}, 500);
			return;
		}

		// Check if the current try matches the target word

		// Stores the check results
		
		// Clone the counts map. Need to use it in every check with the initial values
		const targetWordLetterCounts = {...this.targetWordLetterCounts};
		const states: LetterState[] = [];
		for (let i = 0; i < this.settingsService.wordLength; i++) {
			const expected = this.targetWord[i];
			const curLetter = curTry.letters[i];
			const got = curLetter.text.toLowerCase();
			let state = LetterState.WRONG;
			// Need to make sure only performs the check when the letter has not been checked before
			//
			// For example, if the target word is 'happy', then the first 'a' user types should be checked, but the second 'a' should not, because there is no more 'a' left in the target word that has not been checked
			if (expected === got && targetWordLetterCounts[got] > 0) {
				targetWordLetterCounts[expected]--;
				state = LetterState.FULL_MATCH;
			} else if (this.targetWord.includes(got) && targetWordLetterCounts[got] > 0) {
				targetWordLetterCounts[got]--;
				state = LetterState.PARTIAL_MATCH;
			}	
			states.push(state);
		}
		console.log(states);

		// Animate
		// Get the current try
		const tryContainer =
			this.tryContainers.get(this.numSubmittedTries)?.nativeElement as HTMLElement;
		// Get the letter elements
		const letterEles = tryContainer.querySelectorAll('.letter-container');
		for (let i = 0; i < letterEles.length; i++) {
			// "Fold" the letter, apply the result (and update the style), then unfold it
			const curLetterEle = letterEles[i];
			curLetterEle.classList.add('fold');
			// Wait for fold animation to finish
			await this.wait(180);
			// Update state. This will also update styles
			curTry.letters[i].state = states[i];
			// Unfold
			curLetterEle.classList.remove('fold');
			await this.wait(180);
		}

		// Save to keyboard key states
		//
		// Do this after the current try has been submitted and the animation above is done
		for (let i = 0; i < this.settingsService.wordLength; i++) {
			const curLetter = curTry.letters[i];
			const got = curLetter.text.toLowerCase();
			const curStoredState = this.curLetterStates[got];
			const targetState = states[i];
			// This allows override state with better result
			//
			// For example, if "A" was partial match in previous try, and becomes full match in the current try, we update the key state to the full match (because its enum value is larger)
			if (curStoredState === undefined || targetState > curStoredState) {
				this.curLetterStates[got] = targetState;
			}
		}
		
		this.numSubmittedTries++;

		// Check if all letters in the current try are correct
		if (states.every(state => state === LetterState.FULL_MATCH)) {
			this.showInfoMessage('KUSA!');
			this.won = true;
			// Bounce animation
			for (let i = 0; i < letterEles.length; i++) {
				const curLetterEle = letterEles[i];
				curLetterEle.classList.add('bounce');
				await this.wait(160);
			}
			this.showShare();
			return;
		}

		// Running out of tries. Show correct answer
		if (this.numSubmittedTries === this.numTries) {
			// Don't hide it
			this.showInfoMessage(this.targetWord.toUpperCase(), false);
			this.showShare();
		}

		console.log(WORDS.map(obj => obj.word.length).indexOf(Math.max.apply(Math, WORDS.map(obj => obj.word.length))));
		console.log(WORDS.map(obj => obj.word)[574]);
	}

	private showInfoMessage(msg: string, hide = true) {
		this.infoMsg = msg;
		if (hide) {
			// Hide after 2s
			setTimeout(() => {
				this.fadeOutInfoMessage = true;
				// Reset when animation is done
				setTimeout(() => {
					this.infoMsg = '';
					this.fadeOutInfoMessage = false;
				}, 500);
			}, 2000);
		}
	}

	private async wait(ms: number) {
		await new Promise<void>((resolve) => {
			setTimeout(() => {
				resolve();
			}, ms);
		})
	}

	private showShare() {
		setTimeout(() => {
			this.showShareDialogContainer = true;
			// Wait a tick til dialog container is displayed
			setTimeout(() => {
				// Slide in the share dialog
				this.showShareDialog = true;
			});
		}, 1500);
	}
 
	ngOnChanges(): void {
		// Populate initial state of "tries"
		const newTries: Try[] = [];
		for (let i = 0; i < this.numTries; i++) {
			const letters: Letter[] = [];
			for (let j = 0; j < this.wordLength; j++) {
				letters.push({text: '', state: LetterState.PENDING});
			}
			newTries.push({letters: letters});
		}
		this.tries = newTries;

		// Get a target word from the word list
		const numWords = WORDS.length;
		while (true) {
			// Randomly select a word and check if its length is this.settingsService.wordLength
			this.targetIndex = Math.floor(Math.random() * numWords);
			const word = WORDS[this.targetIndex].word;
			if (word.length === this.wordLength) {
				this.targetWord = word.toLowerCase();
				break;
			}
		}

		// Print it out so we can cheat
		console.log('target word: ', this.targetWord);

		// Generate letter counts for target word
		for (const letter of this.targetWord) {
			const count = this.targetWordLetterCounts[letter];
			if (count === undefined) {
				this.targetWordLetterCounts[letter] = 0;
			}
			this.targetWordLetterCounts[letter]++;
		}
	}

	ngAfterViewInit(): void {
		this.modalRef = this.modalService.show(this.greeting);
	}
}
