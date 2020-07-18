!function(){
if(window['content.js']) return;
window['content.js'] = true;
console.log("content.js-----working");

let FLAG = true;
//start HOUR
let HOUR_RANK = false;
let HOUR_RANK_TIME = 1;
let HOUR_RANK_URL_COUNT = 3;

/**
 * runtime onMessage
 * implement stop and start the extension 
 */
chrome.runtime.onMessage.addListener((message,sender,response) => {
    if('stop'== message.hansan){
        FLAG = false;
    }else if('start' == message.hansan){
        FLAG = true;
    }
    response(true);
})


setTimeout(() => {
    
/**
 * MutationObserver One
 * detect the DOM Node has class = 'chat-draw-area-vm'
 */
if(document.querySelector('#chat-draw-area-vm')){
    let observerOne = new MutationObserver(function(mutations){
        if(!FLAG) return;

        for(const mutation of mutations){
            if('childList' == mutation.type){
                if(mutation.addedNodes.length > 0){
                    getAward();
                }
            }
        }
    });

    observerOne.observe(document.querySelector('#chat-draw-area-vm'),{childList: true});
}

/**
 * MutationObserver Two
 * detect the DOM Node has class = 'chat-items'
 */
if(document.querySelector('#chat-items')){
    let observerTwo = new MutationObserver(function(mutations){
        if(!FLAG) return;

        for(const mutation of mutations){
            if('childList' == mutation.type){
                if(mutation.addedNodes.length > 0){
                    for(const addedNode of mutation.addedNodes){
                        if(addedNode.className.search('system-msg') > 0){
                            if(addedNode.childNodes[3] && addedNode.childNodes[3].childNodes[1].href){
                                let url = addedNode.childNodes[3].childNodes[1].href;
                                window.open(url.split('?')[0]);
                            }
                        }
                    }
                }
            }
        }
    });

    observerTwo.observe(document.querySelector("#chat-items"),{childList: true});
}


}, 1000);

/**
 * hour rank 
 */
if(HOUR_RANK){

setInterval(() => {

    let hr = document.querySelector('.hour-rank-content');
    if(!hr) return;

    hr.click();

    let observer = new MutationObserver(function(mutations){
        let timeout;
        for(const mutation of mutations){
            if('childList' == mutation.type){
                let iframe = document.querySelector('iframe[src*="room-current-rank"]');
                let close = document.querySelector('.fixed.rank>.close-btn');
                if(timeout) {
                    clearTimeout(timeout);
                }
                timeout = setTimeout(()=>{
                    let alinks = iframe.contentWindow.document.querySelectorAll('.face>a');
                    if(alinks.length > 0){
                        for(let i = 0;i < HOUR_RANK_URL_COUNT;i++){

                            // setTimeout(() => {
                                // chrome.runtime.sendMessage({url:alinks[i].href},(response) => {
                                    // if(chrome.runtime.lastError){
                                        // console.log("sendMessage wrong");
                                    // }
                                // });
                            // },2000)

                        }
                    }
                    close.click();
                    timeout = null;
                    observer.disconnect();
                },1000);
            }
        }
    });

    observer.observe(document.querySelector('.room-info-upper-row'),{childList: true,subtree: true});

    let close = document.querySelector('.fixed.rank>.close-btn');
    if(close){
        close.click();
    }

},HOUR_RANK_TIME * 60000);

}

/**
 * function getAward() 
 * get the gift immediate if can do this
 * wait specified times to get the gift
 */
function getAward(){
    let el = document.querySelector(".function-bar");
    if(el){
        let str = document.querySelector(".gift-animation>.gift-sender-info").innerHTML.toString();
        if(str.search("舰长") >= 0 || str.search("提督") >= 0|| str.search("总督") >= 0){
            el.click()
        }else{
            let spans = document.querySelectorAll(".function-bar>span");
            if(spans.length > 1){
                let splits = spans[1].innerHTML.split(':');
                if(splits instanceof Array && 2==splits.length){
                    setTimeout(()=>{
                        el.click();
                    },Number(splits[0]*60+splits[1]))
                }
            }else{
                el.click();
            }
        }
        return 1;
    }else{
        return 0;
    }
}

}(window,chrome);