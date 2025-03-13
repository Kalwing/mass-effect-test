import {
	createRouter,
	createWebHistory,
	RouteLocationNormalized,
	RouteRecordRaw,
} from 'vue-router';
import QuestionView from '../views/QuestionView.vue';
import ResultsView from '../views/ResultsView.vue';
import { useQuestionStore } from '../stores/questionStore';

const routes: Array<RouteRecordRaw> = [
	{
		path: '/',
		name: 'home',
		component: QuestionView,
		beforeEnter: (to: RouteLocationNormalized, from: RouteLocationNormalized) => {
			return { name: 'question', params: { id: 0 } };
		},
	},
	{
		path: '/question/:id',
		component: QuestionView,
		name: 'question',
		beforeEnter: (to: RouteLocationNormalized, from: RouteLocationNormalized) => {
			const store = useQuestionStore();
			console.log(to.params);
			const questionId = parseInt(to.params.id as string);

			if (questionId > 0 && store.answers.length == 0) {
				return { name: 'question', params: { id: 0 } };
			}

			if (questionId > store.currentQuestionIndex + 1) {
				return { name: 'question', params: { id: store.currentQuestionIndex } };
			}
		},
	},
	{
		path: '/results',
		name: 'results',
		component: ResultsView,
		beforeEnter: (to: RouteLocationNormalized, from: RouteLocationNormalized) => {
			const store = useQuestionStore();

			if (store.questions.length === 0 || store.currentQuestionIndex < store.questions.length - 1) {
				return { name: 'home' };
			}
		},
	},
	{
		path: '/:catchAll(.*)',
		name: 'notFound',
		component: QuestionView,
		beforeEnter: (to: RouteLocationNormalized, from: RouteLocationNormalized) => {
			return { name: 'home' };
		},
	},
];

if (process.env.NODE_ENV !== 'production') {
	routes.push({
		path: '/rom',
		name: 'romanceTest',
		component: () => import('../views/RomanceTestView.vue'),
	} as RouteRecordRaw);
}

const router = createRouter({
	history: createWebHistory(process.env.BASE_URL),
	routes,
});

router.beforeEach((to: RouteLocationNormalized, from: RouteLocationNormalized) => {
	const qstore = useQuestionStore();

	if (to.name === 'question') {
		const requestedQuestionId = parseInt(to.params.id as string);

		if (requestedQuestionId > qstore.answers.length + 1) {
			return { name: 'question', params: { id: qstore.answers.length } };
		} else {
			qstore.currentQuestionIndex = requestedQuestionId;
		}
	}
});

export default router;
