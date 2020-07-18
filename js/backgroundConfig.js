/**
 * Author: 风飞的沙
 * QQ: 490728892
 * Declaration: develop the extension just interesting
 * Not for profit!Not for money!
 * Important: just limited to the id "沁禁琐幽" adn "我家大月" use the extension!!!
 */
//extension name
let extensionName = 'hansan';
//extension id
let extensionId;
// tabs.onCreated tab id
let tabId;
// the url of hansan live room
let hansanRoom = "https://live.bilibili.com/21999349";
// room number of hansan live room 
let hansanRoomNumber = "21999349";
// gift room url rule
let giftRoomMatch =  "live.bilibili";
// the tabId of opened hansan live page
let hansanTabId;
// the extension start or stop flag
let HANSAN = true;


/**
 * extension onInstalled
 * get extension id when then extension is installed
 */
chrome.runtime.onInstalled.addListener(() => {
    chrome.management.getAll((extensions) => {
        if(extensions && extensions.length > 0){
            for(const extension of extensions){
                if(extension.name == extensionName){
                    extensionId = extension.id;
                }
            }
        }
    })
});

/**
 * page.html match rules
 */
chrome.declarativeContent.onPageChanged.removeRules(undefined,function(){
    chrome.declarativeContent.onPageChanged.addRules([{
        conditions:[
            new chrome.declarativeContent.PageStateMatcher({ 
                pageUrl:{
                    urlMatches: "live.bilibili",
                    schemes: ["https","http"]
                }
            })
        ],
        actions:[
            new chrome.declarativeContent.ShowPageAction()
        ]
    }])
});