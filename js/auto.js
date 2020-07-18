/**
 * Achieved:
 * click the live room gift and after some seconds shutdown the page
 * Problems:
 * some activity pages script can not work normal (with page has three iframe)
 * Solve methods:
 * maybe should console.log(document.querySelector("#chat-items"));
 */

!function(){
if(!!window['auto.js']) return;
window['auto.js'] = true;
console.log("auto.js-----start flag");

let timeout;

/**
 * get the gift from the gift room
 * when the gift was got shut down the page
 */
new Promise((resolve,reject)=>{
    let t = 1;
    let interval = setInterval(()=>{
        if(document.querySelector(".gift-animation")){
            getAward();
        }else if(3 == t++){
            clearInterval(interval);
            resolve("end");
        }
    },3000);
}).then(value=>{
    window.close();
}).catch(error=>{
    window.location.reload();
})


/**
 * function getAward() 
 * get the gift immediate if can do this
 * wait specified times to get the gift
 */
function getAward(){
    let el = document.querySelector(".function-bar");
    if(el){
        let str = document.querySelector(".gift-animation>.gift-sender-info").innerHTML;
        if(str.includes("舰长") || str.includes("提督") || str.includes("总督")){
            el.click()
        }else{
            let spans = document.querySelectorAll(".function-bar>span");
            if(spans.length > 1){
                let splits = spans[1].innerHTML.split(':');
                if(splits instanceof Array && 2==splits.length){
                    if(timeout){
                        clearTimeout(timeout);
                    }
                    timeout = setTimeout(()=>{
                        timeout = null;
                        el.click();
                    },Number(splits[0]*60+splits[1]))
                }
            }else{
                el.click();
            }
        }

        return 1;
    }

    return 0;
}


/**
 * improve in here  for iframes have  gifts 
 * 
 */

// let iframes = document.querySelectorAll('iframe');
// if(iframes && iframes.length > 0){
    // for(const iframe of iframes){
        // let el = iframe.contentWindow.document.querySelector('.function-bar');
        // console.log(el);
    // }
// }



}(window,chrome)