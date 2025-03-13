<template>
    <div class="h-full">
        <div id="selector"
            class="absolute bottom-0 translate-y-9 transition-transform left-0 ml-4 mt-2 b-8 p-2 bg-gray-1000/70 border-2 border-b-0 border-brown-500">
            <span class="block">Consult their psychological profile:</span>
            <select @change="setAnswerToCharacter" name="character"
                class="text-green-600 border mx-auto mt-2 block ring-0 outline-none border-brown-300 focus:border-brown-300 focus:ring-0 focus:outline-none p-1 leading-none bg-brown-900/50 h-6">
                <option value="-1">---</option>
                <option v-for="(character, idx) in cstore.personalities" :value="idx">{{ character.name }}</option>
            </select>
        </div>
        <div class="mt-20 sm:mt-0">
            <div class="">
                <form class="flex flex-col" @submit.prevent="validateQuestion" ref="form$">

                    <div
                        class="sf-corner flex flex-col mx-auto backdrop-blur-sm w-full min-h-96 max-w-screen-sm p-[1px]">
                        <div class="absolute -z-10 top-0 left-0 w-full h-full mx-auto bg-brown-500 sf-corner-inset">
                        </div>
                        <div
                            class="relative z-10 p-6 flex flex-col items-center justify-center sf-corner mx-auto h-full w-full flex-grow border border-gray-1000 bg-gradient-to-t from-gray-1000/60 to-gray-1000/80 shadow-inner">
                            <ProgressBar />
                            <Transition :name="transitionSide" mode="out-in">
                                <div v-if="updated_question">
                                    <h2 class="text-lg font-semibold text-gray-200 mb-4">{{ qstore.currentQuestion.text
                                        }}
                                    </h2>

                                    <div class="space-y-3">
                                        <label v-for="(option, index) in qstore.currentQuestion.options" class="block">
                                            <input type="radio" @change="setIsChecked"
                                                :name="'q' + qstore.currentQuestion.id" :value="index + 1" class="mr-2">
                                            <span>{{ option.text }}</span>
                                        </label>
                                    </div>
                                </div>
                            </Transition>
                        </div>
                    </div>

                    <div
                        class="relative sf-corner-half  mt-4 font-bold text-gray-200 bg-brown-900/30 w-[min(100%,50rem)] mx-auto flex flex-row">
                        <div
                            class="absolute -z-10 top-0 left-0 w-full h-full mx-auto bg-brown-500 sf-corner-half-inset">
                        </div>
                        <button type="button" @keyup.enter="prevQuestion" @click="prevQuestion"
                            :disabled="qstore.currentQuestionIndex === 0"
                            :class="qstore.isLastQuestion ? 'w-32' : 'w-1/2 '"
                            class="inline-block btn disabled:hover:text-gray-200 disabled:text-gray-200">&lt;
                            Previous</button>
                        <button v-if="!qstore.isLastQuestion" type="submit" :disabled="!is_checked"
                            class="w-1/2  btn disabled:hover:text-gray-200 disabled:text-gray-200">Next
                            &gt;</button>
                        <button v-if="qstore.isLastQuestion" @click="getResults" @keyup.enter="getResults" type="submit"
                            :disabled="!is_checked"
                            class="w-full btn disabled:hover:text-gray-200 disabled:text-gray-200">Analyze.</button>

                    </div>
                </form>
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
var is_checked = ref(false)
const route = useRoute();
const router = useRouter();
var updated_question = ref(false);
var transitionSide = ref("next");

const currentQuestionIndex = computed(ref(() =>
    parseInt(route.params.id as string)
).value);
qstore.currentQuestionIndex = Math.min(currentQuestionIndex.value, qstore.answers.length);

// Set answer if it exist
onMounted(() => {
    const selector = document.getElementById("selector");
    selector.addEventListener("click", switch_selector);

    updated_question.value = true;
    nextTick(() => {
        setLastAnswer();
        setIsChecked();
    });
})

onBeforeRouteUpdate((to, from) => {
    updated_question.value = false;
    // Update the current question index in the store
    qstore.currentQuestionIndex = Math.min(parseInt(to.params.id as string), qstore.answers.length);
    nextTick(() => {
        updated_question.value = true
        // Display the correct checked answer
        nextTick(() => {
            console.log(updated_question);
            setLastAnswer();
            setAnswerToCharacter();
            setIsChecked();

        });
    });
});

var selector_opened = false;
function switch_selector(event: Event) {
    const selector = document.getElementById("selector");
    if (!selector_opened) {
        selector.style.transform = "translateY(0)"
        selector_opened = true;
    }
}

function findChecked() {
    const answer_key: String = 'q' + qstore.currentQuestion.id;
    console.log(answer_key)
    const input: HTMLInputElement = document.querySelector(`input[name="${answer_key}"]:checked`);
    return input;
}
function setLastAnswer() {
    const last_answer = qstore.currentAnswer;
    console.log(last_answer)
    if (last_answer > 0) { // there's already an answer
        const radio: HTMLInputElement = document.querySelector(`input[value="${last_answer}"]`)
        radio.checked = true;
    }
}
function addCurrentAnswer() {
    const input = findChecked();
    qstore.addAnswer(input.value)
}
function setIsChecked() {
    const input = findChecked();
    console.log(input, input !== null)
    is_checked.value = input !== null;
}
function validateQuestion(evt: Event) {
    addCurrentAnswer();
    const next_possible_question = qstore.nextQuestion();
    if (currentQuestionIndex.value < next_possible_question) {
        transitionSide.value = "next"
        router.push(`/question/${currentQuestionIndex.value + 1}`);
    }
}
function prevQuestion() {
    if (is_checked.value) {
        addCurrentAnswer();
    }
    qstore.prevQuestion();
    const prev_possible_question = qstore.prevQuestion();
    if (currentQuestionIndex.value > prev_possible_question) {
        transitionSide.value = "prev"
        router.push(`/question/${currentQuestionIndex.value - 1}`);
    }
}
function getResults() {
    addCurrentAnswer();
    router.push('/results')
}
function setAnswerToCharacter() {
    const select: HTMLInputElement = document.querySelector(`select[name="character"]`);
    const id = parseInt(select.value)
    if (id === -1) {
        return
    }
    const character = cstore.personalities[id];
    console.log(character)
    const answer = character.answers[qstore.currentQuestionIndex]
    const radio: HTMLInputElement = document.querySelector(`input[value="${answer}"]`)
    radio.checked = true;
    is_checked.value = true
}
</script>