const theme = {};
const map_ = {
    header: 'theme-color1',
    text: 'theme-color2',
    navbar: 'theme-color3',
    logo: 'theme-logo',
    banner: 'theme-banner'
}
const cssCached = [];

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
    let properties = {};
    let cssNeeded = [];
    for (var key in theme) {
        properties[`--${map_[key]}`] = theme[key];
        cssNeeded.push(`${map_[key]}.css`);
    }
    console.log(cssNeeded);
    console.log(properties);
    chrome.tabs.query({currentWindow: true, active: true}, tabs => {
        chrome.tabs.sendMessage(tabs[0].id, properties, function() {
            renderStatus('Updated!');
            for (var cssFile of cssNeeded) {
                if (cssCached.indexOf(cssFile) === -1) {
                    chrome.tabs.insertCSS(tabs[0].id, {file: `css/${cssFile}`});
                    cssCached.push(cssFile);
                }
            }
        });
    });
}

function loadImage(id) {
    $(`#${id}`).change(() => {
        let data = new FormData();
        data.append('file', $(`#${id}`)[0].files[0]);
        fetch('https://file.io/?expires=1', {
            body: data,
            method: 'POST',
        }).then(resp => {
            return resp.json();
        }).then(json => {
            updateTheme(id, `url(${json.link})`);
        });
    });
}

document.addEventListener('DOMContentLoaded', function() {
    loadImage('banner');
    loadImage('logo');

    chrome.tabs.query({currentWindow: true, active: true}, tabs => {
        let url = tabs[0].url;
        if (url.indexOf('preprints') < 0) {
            $('#warning').removeClass('hidden');
            $('#picker').addClass('hidden');
        }
    });

    $('.form-input').colorpicker({
        container: $('#colorpicker')
    });

    $('input').change(function() {
        updateTheme();
    });
})
