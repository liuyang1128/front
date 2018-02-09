<template>
    <div class="crumbs">
        <p class="navi"><span class="navi-main">贷后平台</span><img src="../../assets/images/crumbs.png" height="12" width="9"><span class="navi-next">{{two}}</span></p>
    </div>
</template>
<script>
    export default {
        name: "crumbs",
        props:["two"],
        data() {
            return {

            }
        }
    }
</script>
<style>
    
</style>