<template>
    <div class="lottery">
     <div class="box">
        <img class="pos" src="../../assets/images/1.png">
        <img class="back" src="../../assets/images/back.png" @click="reset">
        <img @click="tolotterylist" class="lotterylistimg" src="../../assets/images/lotterylist.png">
        <div class="item">
            <img v-show="!hyyy" :src="imgUrl1" alt="">
            <img v-show="hyyy" ref="img1" src="../../assets/images/number.png" alt="">
        </div>
        <div class="item">
            <img v-show="!hyyy" :src="imgUrl2" alt="">
            <img v-show="hyyy"  ref="img2" src="../../assets/images/number.png" alt="">
        </div>
        <div class="item">
            <img v-show="!hyyy" :src="imgUrl3" alt="">
            <img v-show="hyyy" ref="img3" src="../../assets/images/number.png" alt="">
        </div>
        <div class="item">
            <img v-show="!hyyy" :src="imgUrl4" alt="">
            <img v-show="hyyy" ref="img4" src="../../assets/images/number.png" alt="">
        </div>
        <div class="begin" @click="queryWinPerson">
            <img v-show="begin" src="../../assets/images/start_blue.png" alt="">
            <img v-show="!begin" src="../../assets/images/start_gray.png" alt="">
        </div>
        <div class="end" @click="extractstar">
            <img v-show="end" src="../../assets/images/end_red.png" alt="">
            <img v-show="!end" src="../../assets/images/end_gray.png" alt="">
        </div>
    </div>
    <!-- 错误提示框 -->
    <Modal v-model="prompt" title="提示" :mask-closable="false" class-name="prompt" >
            <p class="center">{{promptmessage}}</p>
            <div slot="footer" class="center">
            <Button size="small" type="primary" @click="back">确定</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
    let timer1,timer2,timer3,timer4;
    export default {
        name: "lottery",
        data() {
            return {
                hyyy: false,
                begin: true,
                end: false,
                prompt:false,
                startIcon:'',
                stopIcon:'',
                promptmessage:'',
                lotteryNum:'',
                lotteryNumList:[],
                frequency: 30,
                isFive:false,
                imgUrl1:require('../../assets/images/xin.png'),
                imgUrl2:require('../../assets/images/chun.png'),
                imgUrl3:require('../../assets/images/kuai.png'),
                imgUrl4:require('../../assets/images/le.png'),
            }
        },
        methods: {
            tolotterylist() {
                this.$router.push('./lotterylist')
            },
            back(){
                this.$router.push('/login');
            },
            queryLotteryList(val){
                this.$http.post('/lottery-web/lottery/queryLotteryList.do').then((resp)=> {
                    if(resp.data.success && resp.data.data){
                        if (resp.data.data.length == 5 || resp.data.data.length > 5) {
                            this.isFive = true;
                            this.$Message.info("抽奖已结束");
                        }
                        if (resp.data.data.length == 3) {
                            if (1 == val) {
                                setTimeout(()=> {
                                    this.imgUrl1 = require('../../assets/images/wan.png');
                                    this.imgUrl2 = require('../../assets/images/shi.png');
                                    this.imgUrl3 = require('../../assets/images/ru.png');
                                    this.imgUrl4 = require('../../assets/images/yi.png');
                                    this.hyyy = false;
                                },3000);
                            } else {
                                this.imgUrl1 = require('../../assets/images/wan.png');
                                this.imgUrl2 = require('../../assets/images/shi.png');
                                this.imgUrl3 = require('../../assets/images/ru.png');
                                this.imgUrl4 = require('../../assets/images/yi.png');
                                this.hyyy = false;
                            }
                        }
                    }
                })
            },
            reset(){
                this.$http.post('/lottery-web/lottery/reset.do').then((resp)=> {
                    if(resp.data.success){
                        this.imgUrl1 = require('../../assets/images/xin.png');
                        this.imgUrl2 = require('../../assets/images/chun.png');
                        this.imgUrl3 = require('../../assets/images/kuai.png');
                        this.imgUrl4 = require('../../assets/images/le.png');
                        this.hyyy = false;
                        this.isFive = false;
                        this.$Message.info(resp.data.data);
                        this.queryLotteryList(1);
                    }else{
                        this.$Message.info(resp.data.errorMessage);
                    }
                })
            },
            queryWinPerson(){
                if (this.isFive) {
                    this.$Message.info("抽奖已结束");
                    return;
                }
                if(!this.begin) {
                    this.$Message.info("请抽取")
                    return;
                }
                this.$http.post('/lottery-web/lottery/queryWinPerson.do').then((resp)=> {
                    if(resp.data.success && resp.data.data){
                        this.lotteryNum = resp.data.data.lotteryNumber;
                        this.kaishi();
                    }else{
                        this.$Message.info("查询中奖号失败");
                    }
                })
            },
            kaishi() {
                this.hyyy = true;
                this.begin = false;
                this.end = true;
                let t1=0,t2=0,t3=0,t4=0;
                timer1 = setInterval(()=>{
                    ++t1;
                    if(t1>9) {
                        t1=0;
                    }
                    this.$refs.img1.style.marginTop = -0.75*t1 + 'rem';
                },this.frequency);
                timer2 = setInterval(()=>{
                    ++t2;
                    if(t2>9) {
                        t2=0;
                    }
                    this.$refs.img2.style.marginTop = -0.75*t2 + 'rem';
                },this.frequency);
                timer3 = setInterval(()=>{
                    ++t3;
                    if(t3>9) {
                        t3=0;
                    }
                    this.$refs.img3.style.marginTop = -0.75*t3 + 'rem';
                },this.frequency);
                timer4 = setInterval(()=>{
                    ++t4;
                    if(t4>9) {
                        t4=0;
                    }
                    this.$refs.img4.style.marginTop = -0.75*t4 + 'rem';
                },this.frequency);
            },
            extractstar() {
                if (this.isFive) {
                    this.$Message.info("抽奖已结束");
                    return;
                }
                this.extract(this.lotteryNum);
            },
            extract(num) {
                this.end = false;
                clearInterval(timer1);
                 this.$refs.img1.style.marginTop = -0.75*Number(num.substr(0,1)) + 'rem';
                setTimeout(()=> {
                    clearInterval(timer2);
                    this.$refs.img2.style.marginTop = -0.75*Number(num.substr(1,1)) + 'rem';
                },400)
                setTimeout(()=> {
                    clearInterval(timer3);
                    this.$refs.img3.style.marginTop = -0.75*Number(num.substr(2,1)) + 'rem';
                },800)
                setTimeout(()=> {
                    clearInterval(timer4);
                    this.$refs.img4.style.marginTop = -0.75*Number(num.substr(3,1)) + 'rem';
                    this.begin = true;
                },1200)
                this.queryLotteryList(1);
            },
        },
        mounted(){
            this.queryLotteryList(0);
            if (!this.$route.query.sign) {
                this.promptmessage = "请先进行登录";
                this.prompt = true;
            }
            // document.documentElement.style.fontSize = clientWidth/750*150+'px';
        }
    }
</script>
<style lang="less" scoped>
    .lottery {
     background: url(../../assets/images/background.gif) no-repeat fixed top;
     background-size: 100% 100%;
     height: 100%;
     position: relative;
     .mingdan {
        margin-top: .1rem;
        margin-left: .1rem;
        a {
            font-size: 18px;
            color: yellow;
        }
     }
     .box {
        position: absolute;
        top: 100%;
        left: 50%;
        width: 5rem;
        height: 2.81rem;
        margin-top: -2.81rem;
        margin-left: -2.5rem;
        z-index:999;
        overflow: hidden;
        text-align: center;
        .pos {
             width: 100%;
             height: auto;
        }
        .back {
            position: absolute;
            top: .58rem;
            right: 0.96rem;
            width: .09rem;
            height: .07rem;
        }
        img.lotterylistimg {
            vertical-align: top;
            width: .8rem;
            height: .46rem;
            position: absolute;
            top: .13rem;
            left: .9rem;
        }
    }
     .item {
         img {
             width: 0.55rem;
        }
         width: 0.56rem;
         height: 0.74rem;
         position: absolute;
         z-index: 3;
         left: 1.06rem;
         top:1.12rem;
         overflow: hidden;
    }
     .item:nth-of-type(2) {
         left:1.86rem;
    }
     .item:nth-of-type(3) {
         left:2.61rem;
    }
     .item:nth-of-type(4) {
         left:3.36rem;
    }
    .begin,.end {
         // background:url(../../assets/images/start_blue.png) no-repeat;
         width: 1.3rem;
         height: 0.35rem;
         cursor: pointer;
         position: absolute;
         z-index: 999;
         top:2.26rem;
         left: 0.9rem;
         img {
            vertical-align: top;
            width: 100%;
            height:100%;
         }
    }
    .end{
        left: 2.8rem;
    }

}
</style>