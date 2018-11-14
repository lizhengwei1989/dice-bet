//数字滚动
const animate = (dom,newVal, oldVal)=>{
    newVal = parseFloat(newVal);
    oldVal = parseFloat(oldVal);
    const t = setInterval(() => {
        oldVal = oldVal + (newVal - oldVal) / 3;
        oldVal = Math.floor(oldVal * 100) / 100;
        dom.innerHTML = oldVal;
        if (Math.abs(oldVal - newVal) < 0.4) {
            clearInterval(t);
            dom.innerHTML = newVal;
        }
    }, 30);
}
export {animate}