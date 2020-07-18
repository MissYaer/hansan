let menus = [
    {
        id: "mainMenu", 
        title: "憨三",
        contexts: ["all"],
        onclick: function(info,tab){
            // console.log(info);
        }
    },
    { 
        id: "menuOne", 
        parentId: "mainMenu", 
        title: "去看憨三", 
        contexts: ["all"], 
        onclick: function(info,tab){
            if(tab.url.split('?')[0].includes(hansanRoom)){
                window.confirm("憨批，你已经在憨三直播间了");
                return;
            }else{
                window.open(hansanRoom);
            }
        }
    },
    { 
        id: "menuTwo", 
        parentId: "mainMenu", 
        title: "暂停憨三",
        contexts: ["all"],
        onclick: function(info,tab){
            if(tab.url.split('?')[0].includes(hansanRoom)){
                if(HANSAN){
                    chrome.contextMenus.update(info.menuItemId,{title: '启动憨三'});
                    HANSAN = false;
                }else{
                    chrome.contextMenus.update(info.menuItemId,{title: '暂停憨三'});
                    HANSAN = true;
                }
            }else{
                window.confirm('你先要去看憨三直播哦');
                return;
            }
        }
    },
    { 
        id: "notClickMe", 
        parentId: "mainMenu", 
        title: "别点我哦", 
        contexts: ["all"], 
        onclick: function(info,tab){
            let reply = window.prompt("请对暗号：天王盖地虎?");
            if(reply && reply.length > 0){
                if(reply.includes("小鸡炖蘑菇")){
                    window.confirm("哼，走开，你个无趣的人...");
                }else{
                    window.confirm("对不上暗号吧，弱鸡...")
                }
            }{
                return;
            }
        }
    },

];

/**
 * create the menus
 */
chrome.runtime.onInstalled.addListener(() => {
    for(i = 0;i < menus.length; i++){
        chrome.contextMenus.create(menus[i],() => {
            if(chrome.extension.lastError){
                console.log("hansan wrong: "+chrome.extension.lastError.message);
            }
        })
    }
})

/**
 * contextMenus onClick
 * hansanTabId 
 */
chrome.contextMenus.onClicked.addListener((info,tab) => {
    if(info.menuItemId == 'menuTwo'){
        if(hansanTabId){
            if(HANSAN){
                chrome.tabs.sendMessage(hansanTabId, {hansan: 'start'},{},(response) => {
                    if(chrome.runtime.lastError){
                        console.log(chrome.runtime.lastError.message);
                    }
                });
            }else{
                chrome.tabs.sendMessage(hansanTabId, {hansan: 'stop'},{},(response) => {
                    if(chrome.runtime.lastError){
                        console.log(chrome.runtime.lastError.message);
                    }
                });
            }
        }
    }
})
