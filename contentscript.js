chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.header) {
            $('.preprint-header').css('background-color', request.header);
            $('.preprint-advisory').css('background-color', request.header);
            $('.subject-item > .btn-primary:hover').css('background-color', request.header);
        }
        if (request.text) {
            $('.preprint-advisory').css('color', request.text);
            $('.navbar-nav > li > a').css('color', request.text);
            $('.navbar-title').css('color', request.text);
            $('.preprint-header').css('color', request.text);
        }
        if (request.navbar) {
            $('.subject-item > .btn-primary').css('background-color', request.navbar);
            $('.preprint-navbar').css('background-color', request.navbar);
        }
        if (request.logo) {
            $('.navbar-image').css('background-image', `url(${request.logo})`);
        }
        if (request.banner) {
            $('.preprint-brand').css('background-image', `url(${request.banner})`);
        }
    }
)
