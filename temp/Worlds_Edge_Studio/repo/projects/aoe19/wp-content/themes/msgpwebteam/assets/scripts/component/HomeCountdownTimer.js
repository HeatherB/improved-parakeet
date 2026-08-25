import { Settings, DateTime } from 'luxon';
import LiveIcon from './LiveIcon';

export default class HomeCountdownTimer {
   
    constructor() {
       this.init();
    }
 
    init() {
        // Test if the elements below exist which are needed to run the 
        // HomeCountdownTimer 
        // (like if it's "25:18:09:04" meaning that there are
        // 25 days, 18 hours, 09 mins, and 04 secs left).
        
        // Date for regex must be the like this example 
        // (2 digit year, month, day and 4 digit military time which includes hours and seconds): 
        // 2021-04-10-0900
        const dateFormatTest = /^\d{4}-\d{2}-\d{2}-\d{4}$/;
        // Format for timezone must be something like "America/Los_Angeles" - see:
        // https://en.m.wikipedia.org/wiki/List_of_tz_database_time_zones
        const timezoneFormatTest = /^([a-zA-Z]|_)+\/([a-zA-Z]|_)+$/;
        // If all the HTML elements and regex tests below don't exist or match
        // then return from function

        const heroNavMobileUlPhpEnd = document.querySelector('nav.heronav-m > ul.fan-preview.zerotime.phpend') || null;
        const fanPreviewSandbtnPhpEnd = document.querySelector('ul.fan-preview .sandbutton.timeup.phpend') || null;

        if(heroNavMobileUlPhpEnd && fanPreviewSandbtnPhpEnd) {
            new LiveIcon('ul.fan-preview .sandbutton.timeup.phpend');
            return;
        }

        if(  
            !document.querySelector('#countdown-timer-future-date') ||
            dateFormatTest.test(document.querySelector('#countdown-timer-future-date').getAttribute('data-future-date-time')) === false ||
            timezoneFormatTest.test(document.querySelector('#countdown-timer-future-date').getAttribute('data-future-date-time-zone')) === false ||
            !document.querySelector('#countdown-timer-future-date #countdown-timer-days') ||
            !document.querySelector('#countdown-timer-future-date #countdown-timer-hrs') ||
            !document.querySelector('#countdown-timer-future-date #countdown-timer-mins') ||
            !document.querySelector('#countdown-timer-future-date #countdown-timer-secs') 
        ) {
            return;
        }

        const countTimerFutureDateVal = document.querySelector('#countdown-timer-future-date').getAttribute('data-future-date-time');
        
        // Get string like "2021-04-10T09:00" below
        const chosenDateCorrectFormat = countTimerFutureDateVal.slice(0, 10) + 'T' + countTimerFutureDateVal.slice(-4, -2) + ':' + countTimerFutureDateVal.slice(-2);

        const chosenTimeZone = document.querySelector('#countdown-timer-future-date').getAttribute('data-future-date-time-zone');

        // Set default timezone using "luxon" npm package above
        Settings.defaultZoneName = chosenTimeZone;

        // Use "DateTime" from "luxon" npm package above 
        const futureDateToUtcZeroDateObj = DateTime.fromISO(chosenDateCorrectFormat);
        const futureDateToUtcZeroDateStr = futureDateToUtcZeroDateObj.toString();
        const futureDateToUtcZeroDate = new Date(futureDateToUtcZeroDateStr);

        // Time measurements
        const second = 1000;
        const minute = second * 60;
        const hour = minute * 60;
        const day = hour * 24;
        const thirtyMinutes = minute * 30;

        let countDown = futureDateToUtcZeroDate.getTime();

        if(!heroNavMobileUlPhpEnd && !fanPreviewSandbtnPhpEnd) {
            let countdownInterval = setInterval(() => {
    
                let now = new Date().getTime();
    
                let distance = countDown - now;
    
                /**
                 * Start getting days, hours, minutes, seconds 
                 * and adding a '0' in front' if there's one digit (like "09" seconds instead of "9" seconds)
                 */
                let days = ( String( Math.floor(distance / (day))).length < 2 ) ? '0' + ( Math.floor(distance / (day)) ) : String(Math.floor(distance / (day)) );
    
                let hours = ( String ( Math.floor((distance % (day)) / (hour)) ).length < 2 ) ? '0' + ( Math.floor((distance % (day)) / (hour)) ) : String(Math.floor((distance % (day)) / (hour)) );
                
                let minutes = ( String( Math.floor((distance % (hour)) / (minute)) ).length < 2 ) ? '0' + ( Math.floor((distance % (hour)) / (minute)) ) : String( Math.floor((distance % (hour)) / (minute)) ); 
                
                let seconds = ( String( Math.floor((distance % (minute)) / second) ).length < 2 ) ? '0' +  ( Math.floor((distance % (minute)) / second) ) : String( Math.floor((distance % (minute)) / second) );
                /**
                 * End getting days, hours, minutes, seconds 
                 */
    
                // Get elems for days, hrs, mins, secs
                let daysElem = document.getElementById('countdown-timer-future-date').querySelector('#countdown-timer-days');
                let hrsElmen = document.getElementById('countdown-timer-future-date').querySelector('#countdown-timer-hrs');
                let minsElem = document.getElementById('countdown-timer-future-date').querySelector('#countdown-timer-mins');
                let secsElem = document.getElementById('countdown-timer-future-date').querySelector('#countdown-timer-secs');
    
                // Set element values as current days, hrs, mins, seconds until 
                // #countdown-timer-future-date[data-future-date-time] future time is reached by
                // #countdown-timer-future-date[data-future-date-time-zone] timezone
                daysElem.innerText = days;
                hrsElmen.innerText = hours;
                minsElem.innerText = minutes;  
                secsElem.innerText = seconds;
    
                let timeupActions = (distance) => {
                    let futureTimeupElem = document.getElementById('countdown-timer-future-date').getAttribute('data-future-timeup-element') || null;
    
                    if( 
                        futureTimeupElem
                    ) {
                        let dataFutureTimeUpElement = document.getElementById('countdown-timer-future-date').getAttribute('data-future-timeup-element');
                        let getElementsToAddTimeupClassTo = document.querySelectorAll(dataFutureTimeUpElement);
                        let heroNavMobileUl = document.querySelector('nav.heronav-m > ul.fan-preview') || null;

                        if(!document.querySelector(dataFutureTimeUpElement).querySelector('.anim-liveicon')) {
                            new LiveIcon(futureTimeupElem);
                        }
    
                        if(distance < 0) {
                            daysElem.innerText = '00';
                            hrsElmen.innerText = '00';
                            minsElem.innerText = '00';  
                            secsElem.innerText = '00';                        
                        }
    
                        if(getElementsToAddTimeupClassTo.length) {
    
                            if(getElementsToAddTimeupClassTo.length === 1) { 
                                getElementsToAddTimeupClassTo.classList.add('timeup');
                                getElementsToAddTimeupClassTo.setAttribute('href', 'https://fanpreview.ageofempires.com/');
                                getElementsToAddTimeupClassTo.querySelector('.sandbutton-text').textContent = 'Tune In';
                                
                                // No time left                    
                                if(distance < 0) {
                                    if(heroNavMobileUl) {
                                        heroNavMobileUl.classList.add('zerotime');
                                    }
                                } 
    
                            } else {
                                for(let i = 0; i < getElementsToAddTimeupClassTo.length; i++) {
                                    getElementsToAddTimeupClassTo[i].classList.add('timeup');
                                    getElementsToAddTimeupClassTo[i].setAttribute('href', 'https://fanpreview.ageofempires.com/');
                                    getElementsToAddTimeupClassTo[i].querySelector('.sandbutton-text').textContent = 'Tune In';
                     
                                    // No time left    
                                    if(distance < 0) {
                                        if(heroNavMobileUl) {
                                            heroNavMobileUl.classList.add('zerotime');
                                        }
                                    }
                                }
                            }
    
                        }
    
                        if(distance < 0) {
                            const countdownTimerWrapper = document.querySelector('#fan-preview-countdown-timer') || null;
                            if(countdownTimerWrapper) {
                                countdownTimerWrapper.classList.add('hide');
                            }
            
                            clearInterval(countdownInterval);
    
                        }
    
                    }
                };
                // 30min or less left and before zero time
                if(distance <= thirtyMinutes && distance > 0) {
                    timeupActions(distance);
                }
                // Zero time left
                else if(distance < 0) {
                    timeupActions(distance);
                }
    
            }, 0);
        }

    }   
 }