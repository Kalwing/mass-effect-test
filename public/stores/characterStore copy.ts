import { defineStore } from 'pinia';
import personalitiesData from '../assets/answers_personality.json';
import romancesData from '../assets/answers_romance.json';

export const useCharacterStore = defineStore('characters', {
	state: () => ({
		personalities: personalitiesData.characters,
		romances: romancesData.characters,
	}),
	actions: {
		getName(id: number) {
			return this.personalities[id].name;
		},
		getQuote(id: number) {
			return this.personalities[id].quote;
		},
		getPersonalityDesc(id: number) {
			return this.personalities[id].description;
		},
		getQuestionImportance(id_char: number, id_question: number) {
			return this.romances[id_char].weights[id_question];
		},
		getRomanceDesc(id: number) {
			return this.romances[id].description;
		},
	},
});
