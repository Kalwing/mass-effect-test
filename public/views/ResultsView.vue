<template>
    <div id="results"
        class="sf-corner relative flex flex-col mx-auto mb-8 backdrop-blur-sm w-full min-h-96 max-w-screen-sm p-[1px]">
        <div class="absolute -z-10 top-0 left-0 w-full h-full mx-auto bg-brown-500 sf-corner-inset">
        </div>
        <div
            class="relative z-10 divide-y-2 divide-brown-600 p-4 py-6 sm:p-6 flex flex-col sf-corner mx-auto h-full w-full flex-grow border border-gray-1000 bg-gradient-to-t from-gray-1000/60 to-gray-1000/80">
            <div>
                <h2 class="text-xl text-green-600">Your profile match with:</h2>
                <div class="grid grid-cols-1 sm:grid-cols-3">

                    <div class="w-full">
                        <div :class="'pic-' + (pers_test_score.closest_id + 1)"
                            class="relative w-24 h-24 my-4 mx-auto border border-green-700">
                            <div class="h-full w-full scan-line bg-blend-screen opacity-25"></div>
                        </div>
                        <h3 class="text-lg text-gray-200">{{ name }}</h3>
                        <p class="text-bold">{{ (similarity_score * 100).toFixed(1) }}% similarity.</p>

                    </div>

                    <div v-html="quote"
                        class="sm:col-span-3 border-b-0 ml-16 p-4 sm:px-8 mt-8 bg-brown-600/20 border border-t-brown-100 border-brown-100/20">
                    </div>
                    <div class="sm:col-span-3 p-4 sm:p-8 bg-gray-1000/30 border border-brown-600 sf-corner-half">
                        {{ personality_desc }}</div>
                    <div id="full-results-pers"
                        class="w-full sm:col-span-2 flex flex-col py-4 sm:p-4 justify-items-center">
                        <h3 class="text-lg text-green-200 border-green-600 border-b border-l px-1 cursor-pointer"
                            tabindex="0" @click="toggleFullResult" @keyup.enter="toggleFullResult">
                            <span v-if="results_pers_closed">↧ Open</span><span v-else>↥ Close</span>
                            full results:
                        </h3>
                        <div v-if="!results_pers_closed" class="relative">
                            <ul
                                class="border border-brown-100 w-full p-1 h-32 overflow-y-auto divide-y divide-brown-600">
                                <li v-for="(other_score) in other_scores">
                                    <em class="font-bold not-italic">{{ cstore.getName(other_score.id) }}:</em><span
                                        class="float-right font-thin">{{
                                            (other_score.dist * 100).toFixed(1)
                                        }}%</span>
                                </li>
                            </ul>
                            <div
                                class="absolute pointer-events-none bottom-0 left-0 w-full h-12 bg-gradient-to-t from-brown-900/60 via-brown-600/20 to-brown-300/0">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="mt-12 pt-12">
                <h2 class="text-xl text-green-600">You are well aligned to have a romance with:</h2>
                <div class="grid grid-cols-1 sm:grid-cols-3">

                    <div class="w-full">
                        <div :class="'pic-' + (rom_test_score.closest_id + 1)"
                            class="w-24 h-24 my-4 mx-auto relative border border-green-700">
                            <div class="h-full w-full scan-line bg-blend-screen opacity-25"></div>
                        </div>
                        <h3 class="text-lg text-gray-200">{{ romance_name }}</h3>
                        <p class="text-bold">{{ (match_score * 100).toFixed(1) }}% match score.</p>

                    </div>
                    <div class="sm:col-span-3 p-4 sm:p-8 mt-4 bg-gray-1000/30 border border-brown-600 sf-corner-half">{{
                        romance_desc }}</div>
                    <div id="full-results-rom"
                        class="w-full sm:col-span-2 mb-4 flex flex-col py-4 sm:p-4 justify-items-center">
                        <h3 class="text-lg text-green-200 border-green-600 border-b border-l px-1 cursor-pointer"
                            tabindex="0" @click="toggleFullResult" @keyup.enter="toggleFullResult">
                            <span v-if="results_rom_closed">↧ Open</span><span v-else>↥ Close</span>
                            full results:
                        </h3>
                        <div v-if="!results_rom_closed" class="relative">
                            <ul
                                class="border border-brown-100 w-full p-1 h-32 overflow-y-auto divide-y divide-brown-600">
                                <li v-for="(rom_other_score) in rom_other_scores">
                                    <em class="font-bold not-italic">{{ cstore.getName(rom_other_score.id) }}:</em><span
                                        class="float-right font-thin">{{
                                            (rom_other_score.dist * 100).toFixed(1)
                                        }}%</span>
                                </li>
                            </ul>
                            <div
                                class="absolute pointer-events-none bottom-0 left-0 w-full h-12 bg-gradient-to-t from-brown-900/60 via-brown-600/20 to-brown-300/0">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>


    </div>
    <div
        class="relative sf-corner-half  mt-4 mb-16 font-bold text-gray-200 bg-brown-900/30 w-[min(100%,50rem)] mx-auto flex flex-row">
        <div class="absolute -z-10 top-0 left-0 w-full h-full mx-auto bg-brown-500 sf-corner-half-inset">
        </div>
        <button type="button" @keyup.enter="newTest" @click="newTest" class="inline-block btn w-full">Retake the
            test</button>
    </div>
</template>

<script setup lang="ts">
import { forEach } from 'mathjs';
import { ref } from 'vue'
import { useQuestionStore } from '../stores/questionStore';
import { useCharacterStore } from '../stores/characterStore copy';
import router from '../router';

interface DistObj {
    "id": number,
    "dist": number
}

const qstore = useQuestionStore();
const cstore = useCharacterStore();
var name = ref("");
var romance_name = ref("");
var romance_desc = ref("");
var similarity_score = ref(0);
var match_score = ref(0);
var personality_desc = ref("")
var quote = ref("");
var results_pers_closed = ref(true);
var results_rom_closed = ref(true);

function computeSimilarity(reference: Array<number>, comparison: Array<number>) {
    var dist = 0
    var sum_weight = 0
    for (var i = 0; i < qstore.questions.length; i++) {
        const comp_val = comparison[i]
        const ref_val = reference[i]
        // if (print_) {
        //     console.log(i, ":", qstore.questions[i].options[ref_val - 1].related_weights, comp_val, ref_val)
        // }
        const weights = qstore.questions[i].options[ref_val - 1].related_weights;
        const max_weight = Math.max.apply(null, weights)
        sum_weight += max_weight
        dist += max_weight - weights[comp_val - 1]
        // if (print_) {
        //     console.log(sum_weight, weights[comp_val - 1], dist)
        // }
    }
    return dist / sum_weight
}

function computeRomanceSimilarity(reference: Array<number>, char_id: number, comparison: Array<number>) {
    var dist = 0
    var sum_weight = 0
    for (var i = 0; i < qstore.questions.length; i++) {
        const comp_val = comparison[i]
        const ref_val = reference[i]
        const answer_weights = qstore.questions[i].options[ref_val - 1].related_weights;
        const question_weight = cstore.getQuestionImportance(char_id, i)
        const max_weight = Math.max.apply(null, answer_weights) * question_weight
        sum_weight += max_weight
        dist += (max_weight - answer_weights[comp_val - 1] * question_weight)
    }
    return dist / sum_weight
}
function getSortedArrayIdx(arr: Array<DistObj>) {
    arr.sort((a, b) => { return (a.dist < b.dist) ? 1 : ((a.dist == b.dist) ? 0 : -1) })
    return arr
}
function findClosestPersonality() {
    const distances: Array<DistObj> = []
    var min_dist = 1000;
    var min_id = 0;
    cstore.personalities.forEach((character, index) => {
        const dist = computeSimilarity(qstore.answers, character.answers)
        distances.push({ "id": index, "dist": dist })
        if (dist < min_dist) {
            min_dist = dist;
            min_id = index;
        }
    })
    const results: Array<DistObj> = distances.map(
        (val) => { return { "id": val.id, "dist": 1 - val.dist } }
    )
    var sorted_results = getSortedArrayIdx(results)
    sorted_results = sorted_results.filter((val) => { return val.id != min_id })
    return {
        closest_id: min_id,
        similarity: 1 - min_dist,
        other_scores: sorted_results
    }
}
function findClosestRomance(type: number) {
    const distances: Array<DistObj> = []
    var min_dist = 1000;
    var min_id = 0;
    cstore.romances.forEach((character, index) => {
        const dist = computeRomanceSimilarity(qstore.answers, index, character.looking_for)
        const wanted_type = cstore.personalities[index].answers[13]
        const type_factors = qstore.questions[13].options[
            wanted_type - 1
        ].related_weights;
        const type_factor = type_factors[type - 1]
        console.log(cstore.personalities[index].name, wanted_type, type_factor, type_factors);
        const reciprocated_dist = 0.80 * dist + 0.20 * (1 - type_factor)
        distances.push({ "id": index, "dist": reciprocated_dist })
        if (reciprocated_dist < min_dist) {
            min_dist = reciprocated_dist;
            min_id = index;
        }
    })
    const results: Array<DistObj> = distances.map(
        (val) => { return { "id": val.id, "dist": 1 - val.dist } }
    )
    var sorted_results = getSortedArrayIdx(results)
    sorted_results = sorted_results.filter((val) => { return val.id != min_id })
    return {
        closest_id: min_id,
        similarity: 1 - min_dist,
        other_scores: sorted_results
    }
}

const pers_test_score = findClosestPersonality();
similarity_score.value = pers_test_score.similarity
name = cstore.getName(pers_test_score.closest_id)
const other_scores: Array<DistObj> = pers_test_score.other_scores
personality_desc.value = cstore.getPersonalityDesc(pers_test_score.closest_id)
quote.value = "“" + cstore.getQuote(pers_test_score.closest_id) + "”"
if (quote.value.slice(0, 2) != "“<") { // quick and dirty to allow dialogues
    quote.value += `<em style="opacity: 0.6;"> — ${name}</em>`;
}


const type = cstore.romances[pers_test_score.closest_id].type
const rom_test_score = findClosestRomance(type);
match_score.value = rom_test_score.similarity;
romance_name = cstore.getName(rom_test_score.closest_id);
romance_desc = cstore.getRomanceDesc(rom_test_score.closest_id);
const rom_other_scores: Array<DistObj> = rom_test_score.other_scores

function newTest() {
    qstore.answers = []
    router.push("question")
}

function toggleFullResult(evt: Event) {
    const target = evt.target as HTMLElement
    console.log(target);
    var full_results = target;
    if (target.parentElement.id == "full-results-pers") {
        full_results = target.parentElement;
    } else if (target.parentElement.parentElement.id == "full-results-pers") {
        full_results = target.parentElement.parentElement;
    } else if (target.parentElement.id == "full-results-rom") {
        full_results = target.parentElement;
    } else if (target.parentElement.parentElement.id == "full-results-rom") {
        full_results = target.parentElement.parentElement;
    }

    if (full_results.id == "full-results-pers") {
        console.log(results_pers_closed)
        results_pers_closed.value = !results_pers_closed.value;
    } else if (full_results.id == "full-results-rom") {
        console.log(results_rom_closed)
        results_rom_closed.value = !results_rom_closed.value;
    }

}

</script>
