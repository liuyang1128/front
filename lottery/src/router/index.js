import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router)

export default new Router({
    routes: [
        /*
        *
        *结算--提前还款--经营性租赁
        */
        {
            path: '/login',
            name: '登录',
            component: (resolve) => {
                require(['@/components/lottery/login'], resolve);
            }
        },
        {
            path: '/lotterylist',
            name: '中奖人名单',
            component: (resolve) => {
                require(['@/components/lottery/lotterylist'], resolve);
            }
        },
        {
            path: '/lottery',
            name: '抽奖',
            component: (resolve) => {
                require(['@/components/lottery/lottery'], resolve);
            }
        }
    ]
})
