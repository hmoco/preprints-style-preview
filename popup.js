const theme = {};
const map_ = {
    header: 'theme-color1',
    text: 'theme-color2',
    navbar: 'theme-color3',
    link: 'theme-color4',
    contrast: 'theme-color5',
}
const cssCached = [];

const defaults = {
    color1: '#337ab7',
    color2: '#FFF',
    color3: '#263947',
};

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

    chrome.tabs.query({currentWindow: true, active: true}, tabs => {
        chrome.tabs.sendMessage(tabs[0].id, properties, function() {
            for (var cssFile of cssNeeded) {
                if (cssCached.indexOf(cssFile) === -1) {
                    chrome.tabs.insertCSS(tabs[0].id, {file: `css/${cssFile}`});
                    cssCached.push(cssFile);
                }
            }
        });
    });
}

function prepareCSSDownload(){
    $.get(window.origin+'/css/full.css').then(data => {
        var currentCSS = createPreprintCSS(data);

        var blob = new Blob([currentCSS], {type: "text/text"});
        var url  = URL.createObjectURL(blob);

        document.getElementById("download-full-css").href=url;
    });
}

function createPreprintCSS(preprintCSS){
    let properties = {};

    for (let key in theme) {
        properties[`${map_[key]}`] = theme[key];
    }
    for (let color in defaults){
        if (!Object.keys(properties).includes('theme-' + color)) {
            properties['theme-'+color] = defaults[color];
        }
    }

    properties['theme-color5'] = properties['theme-color5'] ? properties['theme-color5'] : properties['theme-color4'] ? properties['theme-color4'] : properties['theme-color3'];
    properties['theme-color4'] = properties['theme-color4'] ? properties['theme-color4'] : properties['theme-color2'];

    for (let key in properties) {
        preprintCSS = preprintCSS.replace(new RegExp(key, 'g'), properties[key]);
    }

    return preprintCSS;
}

document.addEventListener('DOMContentLoaded', function() {

    chrome.tabs.query({currentWindow: true, active: true}, tabs => {
        let url = tabs[0].url;
        if (url.indexOf('preprints') < 0) {
            $('.warning').toggleClass('hidden');
        }
    });

    $('.form-input').colorpicker({
        container: $('#colorpicker')
    });

    $('input').change(function() {
        updateTheme();
        prepareCSSDownload();
    });

    $('.more-text-button').on('click', function() {
        $('.more-text').toggleClass('hidden');
    });

});

