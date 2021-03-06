import Vue from 'vue';
import VueRouter from 'vue-router';
import Vuex from 'vuex';
import $ from 'jquery';
import 'jquery.easing';
import 'popper.js';
import 'bootstrap';
var moment = require('moment');
import UserProfile from './views/userProfile.vue';
import SamplePage from './views/samplePage.vue';
import PageNotFound from './views/pageNotFound.vue';
import Breadcrumbs from './views/breadcrumbs.vue';
import Billing from '../components/billing/billing.vue';
import Plan from '../components/billing/views/plan.vue';
import BillingHistory from '../components/billing/views/billingHistory.vue';
import Summary from '../components/billing/views/summary.vue';
import PaymentMethod from '../components/billing/views/paymentMethod.vue';


Vue.use(VueRouter);
Vue.use(Vuex);
const store = new Vuex.Store({
    state: {
        accountInfo: {},
        accountText: ''
    },
    mutations: {
        updatePaymentInfo: function(state, newPaymentInfo) {
            state.accountInfo.payment_method_info = newPaymentInfo;
        },
        updatePaymentText: function(state, newPaymentText) {
            state.accountInfo.payment_method_text = newPaymentText;
        },
        updateAccountStatus: function(state, newStatus){
            state.accountInfo.account_status = newStatus;
        },
        updateAccountStatusText: function(state, newStatusText){
            state.accountInfo.account_status_text = newStatusText;
        },
        updateValidStatus: function(state, newStatus){
            state.accountInfo.valid_status = newStatus;
        },
        updatePaymentMethod: function(state, newMethod){
            state.accountInfo.payment_method = newMethod;
        },
        updatePlanId: function(state, newPlanId){
            state.accountInfo.plan_id = newPlanId;
        },
        updatePlanName: function(state, newPlanName){
            state.accountInfo.plan_name = newPlanName;
        },
        updateAccountInfo: function(state, newAccountInfo) {
            state.accountInfo = newAccountInfo;
        }
    }
});

var routes = [
    { 
        path: '/dashboard', 
        component: SamplePage
    },
    { 
        path: '/dashboard/user/profile', 
        component: UserProfile,
        name: 'userProfile',
        meta: {
            breadcrumb: [
                {   name: 'User'    },
                {   name: 'Profile' } // add 'link' field with name or the route
            ]
        } 
    },
    { 
        path: '/dashboard/sample', component: SamplePage,
        meta: {
            breadcrumb: [
                {   name: 'Pages'    },
                {   name: 'Sample sub menu' } // add 'link' field with name or the route
            ]
        }  
    },
    {
        path: '/dashboard/billing',
        component: Billing,
        name: 'billing',
        meta: {
            breadcrumb: [
                {   name: 'Billing'    }
            ]
        },
        children: [
            {path: '', component: Summary, meta: {
                breadcrumb: [{name: 'Billing'}]
            }},
            {   path: 'plan', 
                component: Plan, 
                meta: {
                    breadcrumb: [{name: 'Billing', link: '/dashboard/billing'}, {name: 'Plan'}]
                }
            },
            {path: 'paymentMethod', component: PaymentMethod, meta: {
                breadcrumb: [{name: 'Billing', link: '/dashboard/billing'}, {name: 'Payment methods'}]
            }},
            {path: 'billingHistory', component: BillingHistory, meta: {
                breadcrumb: [{name: 'Billing', link: '/dashboard/billing'}, {name: 'Billing history'}]
            }}
        ]
    },
    { path: "*", component: PageNotFound }
];

var router = new VueRouter({
    routes, 
    mode: 'history',
    linkExactActiveClass: 'active'
});

var timeFormatter = function(value){
    return (value ? moment(new Date("2015-06-17 14:24:36")).format("YYYY-MM-DD HH:mm:ss"): 'date/time is undefined');
};
Vue.filter('formatDt', timeFormatter);

new Vue({
    el: '#dashboardApp',
    components: { 
        SamplePage, 
        UserProfile, 
        Billing,
        'breadcrumbs': Breadcrumbs 
    },
    router,
    store,
    data: {
        sideBarOpened: true
    },
    methods: {
        toggleMenu: function(){
            this.sideBarOpened = !this.sideBarOpened;
        }, 
        handleScroll: function(){
            100 < $(window.document).scrollTop() ? $(".scroll-to-top").fadeIn() : $(".scroll-to-top").fadeOut()
        },
        scrollToTop: function(event){
            var btn = $(event.currentTarget);
            $("html, body").stop().animate({
                scrollTop: $(btn.attr("href")).offset().top
            }, 1e3, "easeInOutExpo");
            event.preventDefault();
        },
        redirect: function(url){
            window.location.href = url;
        }
    },
    created: function(){
        window.addEventListener('scroll', this.handleScroll);
    },
    destroyed: function(){
        window.removeEventListener('scroll', this.handleScroll);
    }
});