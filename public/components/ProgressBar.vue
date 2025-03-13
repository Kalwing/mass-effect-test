<template>
    <div class="w-full h-5 flex items-center bg-gray-1000 absolute top-0 left-0">
        <div :style="'width:' + computeProgress() + '%'"
            class="h-[1px] transition-[width] shadow-sm relative shadow-green-600 bg-gradient-to-r from-green-800 via-green-400 to-green-200">
            <div class="absolute h-2 w-2 rounded-full blur-sm bg-green-200/95 -top-[0.25rem] -right-1"></div>
        </div>
        <span
            class="text-green-200 font-black absolute text-[0.85rem] px-1 left-1/2 top-0 -translate-x-1/2 shadow-md shadow-green-400/10 border-2 border-t-0 border-brown-500 bg-green-600/0 backdrop-blur-sm">{{
                store.currentQuestionIndex + 1 }}/{{ store.questions.length }}</span>
    </div>
</template>
<script setup lang="ts">
import { useQuestionStore } from '../stores/questionStore';

const store = useQuestionStore();

function computeProgress() {
    return store.currentQuestionIndex / (store.questions.length - 1) * 100
}
</script>