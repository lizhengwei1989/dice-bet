<template>
    <div class="devcon-badge">{{text}}</div>
</template>

<script>
    export default {
        props:['text'],
        name: "Notice"
    }
</script>

<style scoped>
    .devcon-badge {
        width: 100%;
        height: 45px;
        line-height:45px;
        z-index: 100;
        background: linear-gradient(90deg,#fca09a,#fcccd3,#ffcc9d,#98ddad,#81d7ec,#a0aaed);
        background-size: 200%;
        text-align: center;
        -webkit-animation: AnimationName 5s ease infinite;
        -moz-animation: GradientAnimation 5s ease infinite;
        animation: GradientAnimation 5s ease infinite
    }
    @keyframes GradientAnimation {
        0%,100% {
            background-position: 0 50%
        }

        50% {
            background-position: 100% 50%
        }
    }
</style>