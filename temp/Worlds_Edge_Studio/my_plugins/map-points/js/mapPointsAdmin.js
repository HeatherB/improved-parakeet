var mapPointsAdmin = {

    init: function() {
        let popup_wrapper = document.getElementById('map_point_selection_wrapper');
        if(popup_wrapper) {
            mapPointSelector();
        }

        function mapPointSelector() {
            let ltp_post_id = popup_wrapper.getAttribute('data-thispost')
            let close_btn = document.getElementById('close_map_point_selection');
            let map_sheer = document.getElementById('map_sheer');
            let select_map_point_btns = document.querySelectorAll('.mappoint_btn');
            let map_img = document.getElementById('scaled_map_image');
            let admin_bar = document.getElementById('wpadminbar');
            let elemWidth = map_img.naturalWidth;
            let elemHeight = map_img.naturalHeight;

            eventListeners();

            function assignPoint() {    
                clearExisting();   
                /* map marker is a span element, span is 30px by 30px */
                /* span will drop at it's 0,0 point */
                /* pull back and up by half the width and height to 'drop' at center */
                let half_span = 15;
                let pad_top = parseInt(window.getComputedStyle(popup_wrapper).getPropertyValue('padding-top'));
                let clo_height = parseInt(close_btn.offsetHeight);
                let po_height = parseInt(popup_wrapper.getElementsByTagName('p')[0].offsetHeight);
                let adbar_height = parseInt(admin_bar.offsetHeight)
                let subtractHeight = pad_top + clo_height + po_height + adbar_height + half_span;

                let pad_left = parseInt(window.getComputedStyle(popup_wrapper).getPropertyValue('padding-left'));
                let subtractWidth = pad_left + half_span;

                let pointX = event.clientX - subtractWidth;
                let pointY = event.clientY - subtractHeight;
                
                let span = document.createElement('span');
                    span.classList.add('tempMarker');

                span.style.top = ((pointY / elemHeight) * 100) +'%';
                span.style.left = ((pointX / elemWidth) * 100) + '%';

                popup_wrapper.querySelector('.scaled_map_image').append(span);

                let selected_point = document.querySelector('.selected_point');
                let field_x = selected_point.querySelector(`[data-name="map_point_x"] input[type="number"]`);
                let field_y = selected_point.querySelector(`[data-name="map_point_y"] input[type="number"]`);

                field_x.value = ((pointX / elemWidth) * 100);
                field_y.value = ((pointY / elemHeight) * 100);
            }

            function closeMap() {
                popup_wrapper.classList.remove('popped');
            }

            function clearExisting() {
                /* open map selection, clear existing actives */
                let existing_point = popup_wrapper.querySelector('.tempMarker');
                if(existing_point) {
                    existing_point.parentNode.removeChild(existing_point);
                }   
            }

            function pickup_interaction(dataAction,dataString,dataID) {
                jQuery(document).ready(function($) {
                    var data = {
                        'action': dataAction,
                        'passed': JSON.stringify([dataString, dataID]),
                    };

                    // since 2.8 ajaxurl is always defined in the admin header and points to admin-ajax.php
                    jQuery.post(ajaxurl, data, function(response) {
                        console.log('Got this from the server: ' + response);
                    });
                });
            }

            function selectMapPoint() {
                /* open map selection, clear existing actives */
                clearExisting();

                /* assign image to use */
                let name_portion_to_remove = '-288x123';
                let probable_map_img = event.target.closest('[data-name="map_group"]').querySelector('[data-name=image]').src;
                let full_size_map_img = '';
                if(probable_map_img) {
                    full_size_map_img = probable_map_img.replace(name_portion_to_remove,'');
                    map_img.src = full_size_map_img;
                }

                let active_point = document.querySelector('.selected_point');
                if(active_point) {
                    active_point.classList.remove('selected_point');
                }

                popup_wrapper.classList.add('popped');
                let top = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
                popup_wrapper.style.top = top + 'px';
                event.target.closest('tr').classList.add('selected_point');
            }
            function eventListeners() {
                document.addEventListener('click', function(e) {
                    let el = e.target;
                    if (el.matches('.mappoint_btn')) {
                        selectMapPoint();
                    }
                });
                document.addEventListener('change', function(e) {
                    let el = e.target;
                    if(el.matches(`[data-name="video_id"] input[type="text"]`)) {
                    }
                });
                close_btn.addEventListener('click', closeMap, false);
                map_sheer.addEventListener('click', closeMap, false);
                map_img.addEventListener('click', assignPoint, false);
            }
        }

        
    },
   
        
}

window.addEventListener('load', (event) => {
    mapPointsAdmin.init();
});
