const map_ = {
    header: '--theme-color1',
    text: '--theme-color2',
    navbar: '--theme-color3',
    logo: '--theme-logo',
    banner: '--theme-banner'
}

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        for (var property in request) {
            document.body.style.setProperty(map_[property], request[property], 'important');
        }
    }
)
