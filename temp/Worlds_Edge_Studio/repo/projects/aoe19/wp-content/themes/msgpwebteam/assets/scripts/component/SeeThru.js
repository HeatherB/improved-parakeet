import seeThru from 'seethru';

export default class SeeThru {
    constructor() {
        this.init();
    }
    init() {
        function loadAsObjectURL(video, url) {

            var xhr = new XMLHttpRequest();
            xhr.responseType = 'blob';
            xhr.onload = function (response) {
                return video.src = URL.createObjectURL(xhr.response);
            };
            xhr.onerror = function () { /* Houston we have a problem! */ };
            xhr.open('GET', url, true);
            xhr.send();
            video.onload = function () { return URL.revokeObjectURL(video.src); };
        }
        var video = document.getElementById('seethru');
        video.addEventListener('loadedmetadata', function () {
            seeThru.create(video,{ width: 180, height: 180 });
        });
        loadAsObjectURL(video, 'https://www.ageofempires.com/wp-content/uploads/2017/10/badge-master-anim.mp4')
    }
}