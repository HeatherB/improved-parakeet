
var translatorAdmin = {

    init: function() {

    	let translation_service = document.getElementById('my_admin_translator');
    	let translation_service_identy = document.querySelector('.translate_something_wrapper');
    	let build_for_real_btn = document.getElementById('populate_translations');

        if(translation_service_identy) {
        	attachListeners();
        	if(translation_service) {
        		build_for_real_btn.disabled = true;
        		checkLocked();
        	}
        }

		function checkLocked() {
			let content_locks = document.querySelectorAll('#my_admin_translator .locked input[type="checkbox"]');
			content_locks.forEach(content_lock => {
				content_lock.disabled = true;
			});
		}

		function toggleEntryLock(e) {
			if(e.currentTarget.parentNode.classList.contains('locked')) {
				e.currentTarget.parentNode.classList.remove('locked');
				e.currentTarget.parentNode.querySelector('input[type="checkbox"]').disabled = false;
				let unlockThisTrans = 'isLock_' + e.currentTarget.parentNode.dataset.lang;
				console.log('unlockThisTrans ', unlockThisTrans);
				alt_post('unlock_trans', unlockThisTrans);
			} else {
				e.currentTarget.parentNode.classList.add('locked');
				e.currentTarget.parentNode.querySelector('input[type="checkbox"]').disabled = true;
				let lockThisTrans = 'isLock_' + e.currentTarget.parentNode.dataset.lang;
				console.log('lockThisTrans ', lockThisTrans);
				alt_post('lock_trans', lockThisTrans);
			}
		}

		function unlockBtn() {
			//let build_for_real_btn = document.getElementById('populate_translations');
			let selected_languages = document.querySelectorAll('.requested_lang:checked');
			if(selected_languages.length > 0) {
				build_for_real_btn.disabled = false;
			} else {
				build_for_real_btn.disabled = true;
			}
		}

		function fetchFake() {
			console.log('fetchFake');
			alt_post('pva_create', 'fake_create');
		}

		function fetchTranslations() {
			/* kill request translation button and show loading icon */
			document.getElementById('populate_translations').disabled = true;
			let selected_languages = document.querySelectorAll('.requested_lang:checked');
			let requested_languages = [];

			//let objGroup = [];
			var obj = {};
			let piecemealReturn = [];
			let rebuiltReturn = [];
			/* for singular line translate, always set isEdit to true */
			let is_edited = true;

			selected_languages.forEach(requestedLanguage => {
				requested_languages.push(requestedLanguage.value);
				let langName = 'found_' + requestedLanguage.value;
				obj[langName] = langName;
				
			});
			
			let requested_src_url = document.getElementById('request_src_url').value;

			let my_admin_translator_request_response_container = document.getElementById('my_admin_translator_request_response');
			my_admin_translator_request_response_container.innerHTML = '';
			my_admin_translator_request_response_container.classList.remove('fail');
			my_admin_translator_request_response_container.classList.remove('success');
			
			function rebuiltSuccess(rebuiltReturn) {
				setTimeout(function() {
			        document.getElementById('populate_translations').disabled = false;
					my_admin_translator_request_response_container.classList.remove('fail');
					my_admin_translator_request_response_container.classList.add('success');
					my_admin_translator_request_response_container.innerHTML = 'Your translation request was successful.';
			    }, 5000);

				alt_post('pva_create', JSON.stringify(rebuiltReturn));
			}

			function rebuildByLang(piecemealReturn) {
				//console.log('rebuild lang ', piecemealReturn);
				piecemealReturn.forEach(function(piecemeal) {
					//piecemeals.forEach(function(piecemeal) {
						
						var existing = rebuiltReturn.filter(function(v,i) {
							return v.to == piecemeal.to;
						});
						
						if(existing.length) {
							var existingIndex = rebuiltReturn.indexOf(existing[0]);
							var entries = Object.entries(piecemeal);
							rebuiltReturn[existingIndex][entries[1][0]] = entries[1][1];
							
						} else {
							rebuiltReturn.push(piecemeal);
						}
					//});
				});
				rebuiltSuccess(rebuiltReturn);
			}

			const urlBase = 'https://webapi.ageofempires.com/api/Translator';
			let group_to_trans = [requested_title,requested_content];
			//let extra_lang_to = [];
			//let this_key = '';

			let requested_meta_keys = Object.keys(requested_meta);
			//console.log('requested_meta_keys ', requested_meta_keys);
			let saved_keys = ["title","content"];

			for(const [key, value] of Object.entries(requested_meta)) {
				if(value[0] !== '') {
					saved_keys.push(key);
					group_to_trans.push(value.toString());
				}
			}

			/* bypass cors for local */
			var thid = 'https://boiling-plateau-94619.herokuapp.com/';
    		var targetUrl = 'https://webapi.ageofempires.com/api/Translator';
			/* end bypass cors for local */


			for(let translation_loop = 0; translation_loop < group_to_trans.length; translation_loop++) {

				let request_data = {
					"RequestText":group_to_trans[translation_loop],
				    "FromLanguage": "en",
				    "ToLanguage": requested_languages.join(", "),
				    "HasHtml": true,
				    "isEdit": true,
				    "SourceUrl": requested_src_url
				}

				fetch(urlBase, {
				//fetch(thid + targetUrl, {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify(request_data),
					})
					// transform data into json
					.then((resp) => resp.json())
					.then(function(data) {
						if(data.hasOwnProperty('responseText') && data['responseText']) {
							//console.log(' basic data[responseText] ', data['responseText']);
							// rewrite text labels 
							for(r = 0; r < data['responseText'].length; r++) {
								if (data['responseText'][r].hasOwnProperty("text")) {
									//console.log(' basic data[responseText][r] ', data['responseText'][r]);
									if(translation_loop == 0) {
										//console.log('loop 1 ', data['responseText'][r].text);
										data['responseText'][r].title = data['responseText'][r].text;
							    		delete data['responseText'][r].text;
							    		delete data['responseText'][r].transliteration;
							    		piecemealReturn.push(data['responseText'][r]);
									} else if(translation_loop == 1) {
										//console.log('loop 2 ', data['responseText'][r].text);
										data['responseText'][r].content = data['responseText'][r].text;
										delete data['responseText'][r].text;
							    		delete data['responseText'][r].transliteration;
							    		piecemealReturn.push(data['responseText'][r]);
									} else {
										//console.log('other loops ', data['responseText'][r].text);
										data['responseText'][r][saved_keys[translation_loop]] = data['responseText'][r].text;
										delete data['responseText'][r].text;
							    		delete data['responseText'][r].transliteration;
							    		piecemealReturn.push(data['responseText'][r]);
									}
									
							  	}
							}

							// on final loop, move to next step 
							if(translation_loop == group_to_trans.length - 1) {
								rebuildByLang(piecemealReturn);
							}

						} // end property check

					})
					.catch(function(error) {
						// errors here
						my_admin_translator_request_response_container.classList.remove('success');
						my_admin_translator_request_response_container.classList.add('fail');
						my_admin_translator_request_response_container.innerHTML = 'Your translation request was unsuccessful, ' + error;
						console.log('fetch error ' , error);
					})
			} // end for loop
			
		}

		function alt_post(dataAction,dataString) {
			jQuery(document).ready(function($) {
				var data = {
					'action': dataAction,
					'transData': dataString
				};

				// since 2.8 ajaxurl is always defined in the admin header and points to admin-ajax.php
				jQuery.post(ajaxurl, data, function(response) {
					console.log('Got this from the server: ' + response);
				});
			});
		}

		function translateThis() {
			let returnedStringContainer = document.getElementById('returned_translation');
			let capturedString = document.getElementById('translateThis').value;
			let response_wrapper = document.querySelector('.returned_translation_wrapper');
			let response_wrapper_msg = document.getElementById('returned_translation');
			let requested_src_url = document.getElementById('request_src_url').value;

			let lang_name = '';			
			let selected_languages = document.querySelectorAll('.requested_lang:checked');
			let requested_languages = [];
			selected_languages.forEach(requestedLanguage => requested_languages.push(requestedLanguage.value));

			/* russian */
			const ru = {"Ё":"YO","Й":"I","Ц":"TS","У":"U","К":"K","Е":"E","Н":"N","Г":"G","Ш":"SH","Щ":"SCH","З":"Z","Х":"H","Ъ":"'","ё":"yo","й":"i","ц":"ts","у":"u","к":"k","е":"e","н":"n","г":"g","ш":"sh","щ":"sch","з":"z","х":"h","ъ":"'","Ф":"F","Ы":"I","В":"V","А":"a","П":"P","Р":"R","О":"O","Л":"L","Д":"D","Ж":"ZH","Э":"E","ф":"f","ы":"i","в":"v","а":"a","п":"p","р":"r","о":"o","л":"l","д":"d","ж":"zh","э":"e","Я":"Ya","Ч":"CH","С":"S","М":"M","И":"I","Т":"T","Ь":"'","Б":"B","Ю":"YU","я":"ya","ч":"ch","с":"s","м":"m","и":"i","т":"t","ь":"'","б":"b","ю":"yu"};

			/* german */
			const de = {"ä":"a","Ä":"a","Ö":"o","ö":"o","ü":"u","Ü":"u","ß":"ss","ẞ":"ss"};

			function transliterateDE(word){
			  return word.split('').map(function (char) { 
			    return de[char] || char; 
			  }).join("");
			}

			function transliterateRU(word){
			  return word.split('').map(function (char) { 
			    return ru[char] || char; 
			  }).join("");
			}

			/* fake for local */
			/*response_wrapper.classList.add('success');
			response_wrapper.classList.remove('fail');
			let h4 = document.createElement('h4');
			h4.innerHTML = 'ZN';
			response_wrapper_msg.append(h4);
			

			retainHTML = capturedString.replace(/[<>&\n]/g, function(x) {
			    return {
			        '<': '&lt;',
			        '>': '&gt;',
			        '&': '&amp;',
			       '\n': '<br />'
			    }[x];
			});

			let pre = document.createElement('pre');
			pre.innerHTML = retainHTML;
			response_wrapper_msg.append(pre);

			*/


			/* end fake for local */

			/* bypass cors */
			var thid = 'https://boiling-plateau-94619.herokuapp.com/';
    		var targetUrl = 'https://webapi.ageofempires.com/api/Translator';
			/* end bypass cors */

			let request_data = {
				"RequestText":capturedString,
			    "FromLanguage": "en",
			    "ToLanguage": requested_languages.join(", "),
			    "HasHtml": true,
			    "isEdit": true,
			    "SourceUrl": requested_src_url
			}


			//fetch(thid + targetUrl, {
			fetch('https://webapi.ageofempires.com/api/Translator', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(request_data),
			})
			.then((resp) => resp.json())
			.then(function(data) {
				if(data.hasOwnProperty('responseText') && data['responseText']) {
					response_wrapper.classList.add('success');
					response_wrapper.classList.remove('fail');

					for(r = 0; r < data['responseText'].length; r++) {
						if (data['responseText'][r].hasOwnProperty("to")) {
							for(const [key,value] of Object.entries(lang_list)) {
								console.log('key ', key);
								console.log('data[responseText][r].to ', data['responseText'][r].to);
								if(`${key}` == data['responseText'][r].to) {
									lang_name = `${value}`;
								} else {
									if((`${key}` == 'zh_cn') && (data['responseText'][r].to == 'zh-Hans')) {
										lang_name = '中文 (中国)';
									}
									if((`${key}` == 'zh_tw') && (data['responseText'][r].to == 'zh-Hant')) {
										lang_name = '中文 (台灣)';
									}
									if((`${key}` == 'pt_pt') && (data['responseText'][r].to == 'pt-PT')) {
										lang_name = 'Português';
									}
									if((`${key}` == 'pt_br') && (data['responseText'][r].to == 'pt')) {
										lang_name = 'Português BR';
									}
								}
							}

							let h4 = document.createElement('h4');
							h4.innerHTML = lang_name;
							response_wrapper_msg.append(h4);
						}
						if (data['responseText'][r].hasOwnProperty("text")) {
							let pre = document.createElement('pre');

							if(data['responseText'][r].to == 'ru') {
								let spanTransliterate  = document.createElement('pre');
									spanTransliterate.classList.add('transliteration');
								 /*russian - transliterate to latin character set for url use */
								spanTransliterate.innerHTML = 'Transliteration: ' + transliterateRU(data['responseText'][r].text);
								response_wrapper_msg.append(spanTransliterate);
							}

							if(data['responseText'][r].to == 'de') {
								let spanTransliterate  = document.createElement('pre');
									spanTransliterate.classList.add('transliteration');
								 /*german - transliterate to latin character set for url use */
								spanTransliterate.innerHTML = 'Transliteration: ' + transliterateDE(data['responseText'][r].text);
								response_wrapper_msg.append(spanTransliterate);
							}

							retainHTML = data['responseText'][r].text.replace(/[<>&\n]/g, function(x) {
							    return {
							        '<': '&lt;',
							        '>': '&gt;',
							        '&': '&amp;',
							       '\n': '<br />'
							    }[x];
							});

							pre.innerHTML = retainHTML;
							response_wrapper_msg.append(pre);
						}
					}
				}
			})
			.catch(function(error) {
				// errors here
				response_wrapper.classList.remove('success');
				response_wrapper.classList.add('fail');
				response_wrapper_msg.innerHTML = error;
				console.log('fetch error ' , error);
			})
		} 


        function attachListeners() {
			let build_for_real_btn = document.getElementById('populate_translations');
			if(build_for_real_btn) {
				build_for_real_btn.addEventListener('click', fetchTranslations, false);
				//build_for_real_btn.addEventListener('click', fetchFake, false);
			}

			let lockable_entries = document.querySelectorAll('#my_admin_translator .icon');
			if(lockable_entries) {
				lockable_entries.forEach(lockable_entry => {
					lockable_entry.addEventListener('click', toggleEntryLock, false);
				});
			}

			let lang_selectors = document.querySelectorAll('#my_admin_translator .requested_lang');
			if(lang_selectors) {
				lang_selectors.forEach(lang_selector => {
					lang_selector.addEventListener('change', unlockBtn, false);
				});
			}

			let singular_translate_btn = document.getElementById('translateThisBTN');
			if(singular_translate_btn) {
				singular_translate_btn.addEventListener('click', translateThis, false);
			}
		}
			
    }, // end init
   
        
}

window.addEventListener('load', (event) => {
    translatorAdmin.init();
});
