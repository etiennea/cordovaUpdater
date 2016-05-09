document.addEventListener("deviceready", function() {
    setTimeout(update, 200); //run at boot
    setInterval(update, 8 * 60 * 60 * 1000); //run daily
})

function update() {
    if (!window.localStorage.getItem('originalVersion')) { //store the version user started off with
        window.localStorage.setItem('originalVersion', window.version)
    }

    if (window.localStorage.getItem('downloadedVersion') && window.version !== window.localStorage.getItem('downloadedVersion')) {
        console.log('Needs redirect', window.version, window.localStorage.getItem('downloadedVersion'));
        window.location.href = window.localStorage.getItem('downloadedPath') + '/index.html';
        return;
    }

    $(function() {
        $.getJSON('https://s3-eu-west-1.amazonaws.com/YOURBUCKET/express/package.json', function(info) {

            console.log(info['version'], window.version);

            if (info['version'] === window.version) {
                console.log('No update needed');
            } else {
                console.log('Update needed');
                var sync = ContentSync.sync({
                    src: 'https://s3-eu-west-1.amazonaws.com/YOURBUCKET/builds/build.' + info['version'] + '.zip',
                    id: info['version']
                });
                //app.f7.showPreloader(['Downloading update <span id="pg"></span>%'])
                sync.on('progress', function(data) {
                    $('#pg').html(data.progress);
                });

                sync.on('complete', function(data) {
                    console.log(data.localPath)
                    window.localStorage.setItem('downloadedVersion', info['version']);
                    window.localStorage.setItem('downloadedPath', data.localPath);
                    window.location.href = data.localPath + '/index.html';
                });

                sync.on('error', function(e) {

                });

                sync.on('cancel', function() {

                });
            }
        });
    });
}
