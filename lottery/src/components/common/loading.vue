<template>
    <div class="vbl-loading">
        <transition name="fade">
            <div v-if="show">
                <div class="vbl-loading-bg"></div>
                <div class="vbl-loading-content">
                    <span class="loading-rotate"></span>
                    <span class="loading-car"></span>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
    export default {
        name: 'vbl-loading',
        props: {
            show: {
                type: Boolean,
                default: false
            }
        }
    }
</script>

<style lang="less" scoped>
    .vbl-loading {
        position: relative;
        z-index: 1300;
        .vbl-loading-bg {
            position: fixed;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            background-color: rgba(55,55,55,.6);
            height: 100%;
            z-index: 1;
         }
        .vbl-loading-content {
            position: fixed;
            // top: 50%;
            top: 300px;
            left: 50%;
            z-index: 2;
            width: 90px;
            height: 90px;
            margin: -45px 0 0 -45px;
         }
        .loading-rotate {
            display: block;
            width: 100%;
            height: 100%;
            background: url(../../assets/images/rotate-circle.png) no-repeat center center;
            transform-origin: 45px 45px;
            animation: rotate 1s infinite linear;
         }
        .loading-car {
             position: absolute;
             left: 0;
             top: 0;
             z-index: 1;
             display: block;
             width: 100%;
             height: 100%;
             background: url(../../assets/images/car.png) no-repeat center 26px;
         }
         
         @keyframes rotate {
            0% {
                transform: rotate(0deg);
            }
            50% {
                transform: rotate(180deg);
            }
            100% {
                transform: rotate(360deg);
            }
        }
    }
</style>