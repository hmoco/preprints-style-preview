chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        for (var property in request) {
            document.body.style.setProperty(property, request[property]);
            console.log(request)
        }
    }
)
