<template>
    <div class="text-brown-100 h-full">
        <div class="absolute top-0 right-0 ml-4 mt-2 b-8 p-2 bg-gray-1000/80 border-2 border-brown-500">
            <span class="block">Consult their psychological profile:</span>
            <select @change="setState" name="character"
                class="text-green-600 border mx-auto mt-2 block ring-0 outline-none border-brown-300 focus:border-brown-300 focus:ring-0 focus:outline-none p-1 leading-none bg-brown-900/50 h-6">
                <option value="-1">---</option>
                <option v-for="(character, idx) in cstore.personalities" :value="idx">{{ character.name }}</option>
            </select>
        </div>
        <div class="sticky top-0 right-0 w-48 ml-4 mt-2 b-8 p-2 bg-gray-1000/80 border-2 border-brown-500">
            <span class="block">Crush:</span>
            <select @change="setCrush" name="charCrush"
                class="text-green-600 border mx-auto mt-2 block ring-0 outline-none border-brown-300 focus:border-brown-300 focus:ring-0 focus:outline-none p-1 leading-none bg-brown-900/50 h-6">
                <option value="-1">---</option>
                <option v-for="(character, idx) in cstore.personalities" :value="idx">{{ character.name }}</option>
            </select>
        </div>
        <div class="mt-20 sm:mt-0">
            <div class="">
                <form class="flex flex-col" @change="getResults" ref="form$">
                    <div
                        class="sf-corner flex flex-col mx-auto backdrop-blur-sm w-full min-h-96 max-w-screen-sm p-[1px]">
                        <div class="absolute -z-10 top-0 left-0 w-full h-full mx-auto bg-brown-500 sf-corner-inset">
                        </div>
                        <p class="sticky block m-8 text-green-600">{{ desc }}</p>
                        <div v-for="(question, qid) in qstore.questions"
                            class="question relative border-b z-10 p-6 flex flex-col  sf-corner mx-auto h-full w-full flex-grow border-gray-700 bg-gradient-to-t from-gray-1000/60 to-gray-1000/80 shadow-inner">
                            <h2 class="text-lg font-semibold text-gray-200 mb-4">{{ qid + 1 + ". " + question.text }}
                            </h2>

                            <div class="space-y-3">
                                <label v-for="(option, index) in question.options" class="block">
                                    <input type="radio" :name="'q' + qid" :value="index + 1" class="answer mr-2">
                                    <span>{{ index + 1 + '. ' + option.text }}</span>
                                </label>
                            </div>
                            <input class="weight w-16 h-8 p-1 m-1 bg-gray-900" type="number">
                        </div>
                    </div>

                </form>
                <span class="block bg-gray-1000 p-2">Poids: {{ weights_value }}</span>
                <span class="bg-gray-1000 block p-2">Réponses: {{ answers_value }}</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import ProgressBar from '../components/ProgressBar.vue';
// import router from '../router/index.ts';
import { useQuestionStore } from '../stores/questionStore.ts'
import { useCharacterStore } from '../stores/characterStore copy.ts';
import { computed, onMounted, ref, nextTick } from 'vue'
import { useRoute, useRouter, onBeforeRouteUpdate } from 'vue-router';

const qstore = useQuestionStore();
const cstore = useCharacterStore();
var is_checked = ref(false);
const weights_value = ref([]);
const answers_value = ref([]);
const desc = ref("")


function setState() {
    const select: HTMLInputElement = document.querySelector(`select[name="character"]`);
    const id_char = parseInt(select.value)
    if (id_char === -1) {
        return
    }
    const character = cstore.romances[id_char];
    console.log(character)
    const answers = character.looking_for
    desc.value = character.description
    const questions = document.querySelectorAll(".question")
    questions.forEach((element, id_question) => {
        const weight_input: HTMLInputElement = element.querySelector(".weight")
        weight_input.value = cstore.getQuestionImportance(id_char, id_question)

        const radio: HTMLInputElement = element.querySelector(`input[value="${answers[id_question]}"]`)
        radio.checked = true;
    });
    getResults();
}
function setCrush() {
    const select: HTMLInputElement = document.querySelector(`select[name="charCrush"]`);
    const id_char = parseInt(select.value)
    if (id_char === -1) {
        return
    }
    const character = cstore.personalities[id_char];
    console.log(character)
    const answers = character.answers
    const questions = document.querySelectorAll(".question")
    questions.forEach((element, id_question) => {
        const radio: HTMLInputElement = element.querySelector(`input[value="${answers[id_question]}"]`)
        console.log(radio)
        radio.parentElement.style.fontWeight = "800";
        radio.parentElement.classList.add("text-green-700");
    });
}
function getResults() {
    weights_value.value = [];
    answers_value.value = [];
    const questions = document.querySelectorAll(".question")
    questions.forEach((element, id_question) => {
        const weight_input: HTMLInputElement = element.querySelector(".weight")
        weights_value.value.push(parseFloat(weight_input.value))

        const radio: HTMLInputElement = element.querySelector("input:checked")
        if (radio != null) {
            answers_value.value.push(parseInt(radio.value));
        } else {
            answers_value.value.push(0);
        }
    });
}


</script>