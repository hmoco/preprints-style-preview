function renderStatus(statusText) {
    document.getElementById('status').textContent = statusText;
}


document.addEventListener('DOMContentLoaded', function() {
    $('#submit-button').click(function() {
        let theme = {};
        $('.form-input').each((i, elem) => {
            let val = $(elem).val();
            if (val) {
                theme[$(elem).attr('name')] = val;
            }
        })
        chrome.tabs.query({currentWindow: true, active: true}, tabs => {
            chrome.tabs.sendMessage(tabs[0].id, theme, function() {
                renderStatus('Updated!');
            });
        });
    });
})
