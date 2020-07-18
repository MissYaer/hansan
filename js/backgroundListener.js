console.log("backgroundListener.js-----start flag");

/**
 * tabs onCreated
 * remarks:when tab created the url properties not set immediate 
 * 1.get new tab id
 * 2.return to hansanRoom
 * 3.remove duplicate tab 
 */
chrome.tabs.onCreated.addListener(tab => {
    if(!HANSAN) return;

    tabId = tab.id;

    if(HANSAN && hansanTabId && hansanTabId != tab.id){
        chrome.tabs.update(hansanTabId,{active: true});
    }
    // let urls = ["https://live.bilibili.com/926101", "https://live.bilibili.com/11713", "https://live.bilibili.com/21444545", "https://live.bilibili.com/11616349", "https://live.bilibili.com/21301839", "https://live.bilibili.com/34180"];
    // for(let i=0;i<6;i++){
        // chrome.tabs.create({url:urls[i]});
    // }
    removeDuplicateTab();

});

/**
 * tabs onUpdated
 * insert auto.js when specified tab is created
 * giftRoomMatch  hansanRoomNumber
 */
chrome.tabs.onUpdated.addListener((tabId,{},tab) => {
    if(!HANSAN) return;

    if(tab.url.includes(giftRoomMatch) && !tab.url.includes(hansanRoomNumber)){
        chrome.tabs.executeScript(tab.id,{
            file: "./js/auto.js",
            allFrames: true,
            frameId: 0,
            runAt: "document_end"
        },results => {
            if(chrome.runtime.lastError){
                console.log("tabs onUpdated: "+chrome.runtime.lastError.message);
            }
        })
    }

});

/**
 * webNavigation onCompleted
 * insert contentScript.js when navigation to hansanRoom
 * hansanRoom
 */
chrome.webNavigation.onCompleted.addListener(() => {
    if(!HANSAN) return;
    chrome.tabs.query({currentWindow: true,active: true},tabs => {
        if(tabs[0].id){
            hansanTabId = tabs[0].id;
            chrome.tabs.executeScript(tabs[0].id,{
                file: "./js/contentScript.js",
                runAt: "document_end"
            },results => {
                if(chrome.runtime.lastError){
                    console.log("webNavigation-executeScript: "+chrome.runtime.lastError.message);
                }
            })
        }
    })

},{
    url: [{ urlMatches: hansanRoom }]
});

/**
 * storage onChanged
 */
// chrome.storage.onChanged.addListener((changes) => {
//     console.log(changes);
//     if(changes.HourRankUrls.newValue.length > 0){
//         let urls = changes.HourRankUrls.newValue;
//         if(urls.length > 0){
//             for(const url of urls){
//                 chrome.tabs.create({url:url});
//             }
//         }
//     }
// })

/**
 * onMessage
 */
// chrome.runtime.onMessage.addListener((msg,sender,response) => {
//     if(msg.url){
//         chrome.tabs.create({url:msg.url});
//     }
// });


/**
 * function removeDuplicateTab()
 * remove tab if duplicated 
 */
function removeDuplicateTab(){
    chrome.tabs.query({currentWindow: true,active: false,discarded: false,url: "https://*.bilibili.com/*"},tabs => {
        let set = new Set();
        let mp = new Map();
        let map = new Map();

        for(const tab of tabs){
            set.add(tab.url.split('?')[0]);
            mp.set(tab.id,tab.url.split('?')[0]);
        }

        if(set.size !== mp.size){
            for(const url of set){
                let ids = [];
                for(const [key,value] of mp.entries()){
                    if(url.includes(value)){
                        ids.push(key);
                    }
                }
                map.set(url,ids);
            }
             
            for(const tabIds of map.values()){
                if(tabIds.length > 1){
                    for(let i = 1;i < tabIds.length;i++){
                        chrome.tabs.remove(tabIds[i],() => {
                            if(chrome.runtime.lastError){
                                console.log('remove tab wrong: '+chrome.runtime.lastError.message);
                            }
                        });
                    }
                }
            }
        }

        set.clear();
        mp.clear();
        map.clear();
    });
}