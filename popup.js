const theme = {};

function renderStatus(statusText) {
    document.getElementById('status').textContent = statusText;
}

function updateTheme(attr, value) {
    if (attr && value) {
        theme[attr] = value;
    }
    $('.form-input').each((i, elem) => {
        let val = $(elem).val();
        if (val) {
            theme[$(elem).attr('name')] = val;
        }
    })
    console.log(theme)
    chrome.tabs.query({currentWindow: true, active: true}, tabs => {
        chrome.tabs.sendMessage(tabs[0].id, theme, function() {
            renderStatus('Updated!');
        });
    });
}

document.addEventListener('DOMContentLoaded', function() {
    $('.form-input').colorpicker({
        container: $('#colorpicker')
    });
    $('#banner').change(() => {
        let data = new FormData();
        data.append('file', $('#banner')[0].files[0]);
        fetch('https://file.io/?expires=1', {
            body: data,
            method: 'POST',
        }).then(resp => {
            return resp.json();
        }).then(json => {
            updateTheme('banner', json.link);
        });
    });
    $('#logo').change(() => {
        let data = new FormData();
        data.append('file', $('#logo')[0].files[0]);
        fetch('https://file.io/?expires=1', {
            body: data,
            method: 'POST',
        }).then(resp => {
            return resp.json();
        }).then(json => {
            updateTheme('logo', json.link);
        });
    });
    $('input').change(function() {
        updateTheme();
    });
})
