// adding a new bookmark row to the popup
import {getActiveTabURL} from "./utils.js";

const addNewBookmark = (bookmarksElement, bookmark) => {
    const bookmarkTitleElment = document.createElement("div");
    const NewBookmarkElement = document.createElement("div");
    const controlElement = document.createElement("div");
    bookmarkTitleElment.textContent = bookmark.desc;
    bookmarkTitleElment.className = "bookmark-title";

    controlElement.className = "bookmark-controls";

    NewBookmarkElement.id = "bookmark-" + bookmark.time;
    NewBookmarkElement.className = "bookmark";
    NewBookmarkElement.setAttribute("timestap", bookmark.time);

    setBookmarkAttributes("play", onPlay ,controlElement );
    setBookmarkAttributes("delete", onDelete, controlElement)

    NewBookmarkElement.appendChild(bookmarkTitleElment);
    NewBookmarkElement.appendChild(controlElement);
    bookmarksElement.appendChild(NewBookmarkElement);
};

const viewBookmarks = (currentBookmark=[]) => {
    const bookmarksElement = document.getElementById("bookmarks");
    bookmarksElement.innerHTML =  "";

    if(currentBookmark.length >0 ){
        for(let i = 0; i < currentBookmark.length; i++){
            const bookmark = currentBookmark[i];
            addNewBookmark(bookmarksElement, bookmark);

        }
    }else{
        bookmarksElement.innerHTML = "<i class='row'>No bookmark to show</i>";

    }
};

const onPlay = async e => {

    const bookmarkTime = e.target.parentNode.parentNode.getAttribute("timestamp");
    const activeTab = await getActiveTabURL();
    chrome.tabs.sendMessage(activeTab.id,{
        type : "PLAY",
        value: bookmarkTime
    })
};

const onDelete = async e => {
    const activeTab = await getActiveTabURL();
    const bookmarkTime = e.target.parentNode.parentNode.getAttribute("timestamp");
    const bookmarkElementToDelete = document.getElementById("bookmark-" + bookmarkTime);

    bookmarkElementToDelete.parentNode.removeChild(bookmarkElementToDelete)
    chrome.tabs.sendMessage(activeTab.id,{
        type : "DELETE",
        value: bookmarkTime
    }, viewBookmarks)
};

const setBookmarkAttributes =  (src, eventListener, controlParentElement) => {
    const controlElement = document.createElement("img");
    controlElement.src = "assets/" + src + ".png";
    controlElement.title = src;
    controlElement.addEventListener("click", eventListener);
    controlParentElement.appendChild(controlElement);
};

document.addEventListener("DOMContentLoaded", () => {
const activeTab = getActiveTabURL();
const queryParameters = activeTab.url.split("?")[1];
const urlParameters = new URLSearchParams(queryParameters);

const currentVideo = urlParameters.get("v");
if(activeTab.url.includes("youtube.com/watch") && currentVideo){
    chrome.storage.sync.get([currentVideo] , (data) => {
        const currentVideoBookmarks = data[currentVideo] ? JSON.parse(data[currentVideo]) : [];
        //viewBookmarks
        viewBookmarks(currentVideoBookmarks);
    })
}else{
    const container = document.getElementsByClassName("container")[0];
    container.innerHTML = "<div class='title'>This is not a Youtube Page</div>";


}
});
