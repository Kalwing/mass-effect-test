import { defineStore } from 'pinia';
import questionsData from '../assets/questions.json';

export const useQuestionStore = defineStore('questions', {
	state: () => ({
		questions: questionsData.questions.slice(0, 25),
		currentQuestionIndex: 0,
		answers: [],
	}),
	actions: {
		nextQuestion() {
			if (this.currentQuestionIndex < this.questions.length) {
				this.currentQuestionIndex++;
			}
			return this.currentQuestionIndex;
		},
		prevQuestion() {
			if (this.currentQuestionIndex > 0) {
				this.currentQuestionIndex--;
			}
			return this.currentQuestionIndex;
		},
		addAnswer(value: string) {
			const value_: number = parseInt(value);
			if (this.currentQuestionIndex < this.answers.length) {
				// Answers are 1 indexed
				this.answers[this.currentQuestionIndex] = value_;
			} else {
				this.answers.push(value_);
			}
		},
		initializeAnswersIfNeeded() {
			if (!this.answers) {
				this.answers = [];
			}
		},
	},
	getters: {
		currentQuestion() {
			return this.questions[this.currentQuestionIndex];
		},
		currentAnswer() {
			console.log(this.answers, this.currentQuestionIndex, this.answers.length);
			if (this.currentQuestionIndex < this.answers.length) {
				return this.answers[this.currentQuestionIndex];
			} else {
				return 0;
			}
		},
		isLastQuestion() {
			console.log(this.currentQuestionIndex, this.questions.length);
			return this.currentQuestionIndex === this.questions.length - 1;
		},
	},
});
