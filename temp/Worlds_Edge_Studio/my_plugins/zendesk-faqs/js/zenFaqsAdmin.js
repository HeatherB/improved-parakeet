var zenFaqsAdmin = {

    ui: {

        editMsgWrapper : document.getElementById('editting_msg_wrapper'),
        categoryList : document.querySelector("#article_category_list form"),
        requestedCategory : document.querySelector('input[name="list-categories"]'),
        categorySelection : document.querySelector('input[name="list-categories"]:checked'),
        allFAQs : document.querySelectorAll('input[name="edit-this-faq"]'),
        articles : document.querySelectorAll('input.zendesk_faq_selection[type="text"]'),
        zenFaqUl : document.getElementById('zenFAQ'),
        faqContainer : document.querySelector('.faqSelector'),
        formTableCells : document.querySelectorAll('#zendesk_form_table tbody td'),
        noSelectionMsg : "Please select an FAQ to edit.",
        altSelectionMsg : "You may only edit the selected FAQ.",
    },

    urls: {
        url_fetch_categories : 'https://support.ageofempires.com/api/v2/help_center/en-us/categories',
        url_fetch_articles : 'https://support.ageofempires.com/api/v2/help_center/en-us/articles/',
        url_fetch_page : 'https://support.ageofempires.com/api/v2/help_center/en-us/articles.json?page=',
    },

    data: {
        requested_page : 0,
        total_pages : 0,
    },

    addMoreArticles: function() {
        /* fetch list of available articles from Zendesk */
        let moreArticlesURL = zenFaqsAdmin.urls.url_fetch_page + zenFaqsAdmin.data.requested_page;
        if(zenFaqsAdmin.ui.requestedCategory) {
            moreArticlesURL = 'https://support.ageofempires.com/api/v2/help_center/en-us/categories/'+ zenFaqsAdmin.ui.requestedCategory +'/articles.json?page=' + zenFaqsAdmin.data.requested_page;
        }

        zenFaqsAdmin.fetchTheThings(moreArticlesURL, "addmore");
    },

    loadingMoreArticles: function(data) {
        zenFaqsAdmin.data.requested_page = data.page;
        zenFaqsAdmin.data.total_pages = data.page_count;
        let loadingMoreLI = document.getElementById('load-more');

        if(
            "IntersectionObserver" in window &&
            "IntersectionObserverEntry" in window &&
            "intersectionRatio" in window.IntersectionObserverEntry.prototype
        ) {
            let observer = new IntersectionObserver(entries => {
                if(entries[0].isIntersecting) {
                    zenFaqsAdmin.data.requested_page++;
                    zenFaqsAdmin.addMoreArticles();
                }
            });
            if(zenFaqsAdmin.data.requested_page >= zenFaqsAdmin.data.total_pages) {
                observer.unobserve(loadingMoreLI);
                loadingMoreLI.innerHTML = ". . .end of article list. . .";
            } else {
                observer.observe(loadingMoreLI);
            }
        }
    },

    captureOption: function(e) {
        /* interact with list of available articles from Zendesk */
        e.preventDefault();
        e.stopPropagation();

        let updateThisFAQ = document.querySelector('input[name="edit-this-faq"]:checked');

        for (let i = 0; i < e.target.parentNode.children.length; i++) {
          e.target.parentNode.children[i].classList = '';
        }
        e.target.classList = 'selected';

        if(updateThisFAQ) {
            zenFaqsAdmin.hideEditMsg();
            let form_faq_id = document.getElementById("zendesk_faq_id" + updateThisFAQ.value);
            let form_faq_title = document.getElementById("faq_title" + updateThisFAQ.value);
            let form_faq_preview = document.getElementById("faq_copy_preview" + updateThisFAQ.value);

            /* edit selected FAQ selection */
            form_faq_id.value = e.target.dataset.value;
            form_faq_title.innerHTML = e.target.innerHTML;
            form_faq_preview.innerHTML = e.target.dataset.body;
        } else {
            zenFaqsAdmin.showEditMsg(zenFaqsAdmin.ui.noSelectionMsg);
        }

    },

    /* on page load, present list of articles to select from */
    buildAvailable: function(data) {
    /* display list of available articles from Zendesk */
        data.articles.map(function(faq) {
                let selectLI = document.createElement('li');
                selectLI.dataset.value = faq.id;
                selectLI.dataset.body = faq.body;
                selectLI.innerHTML = faq.title;
                selectLI.onclick = zenFaqsAdmin.captureOption;
                zenFaqsAdmin.ui.zenFaqUl.prepend(selectLI);
        });

        /* create autoload */
        zenFaqsAdmin.loadingMoreArticles(data);
    },

    appendAvailable: function(data) {
        let loadingMoreLI = document.getElementById('load-more');
        let cloneLoading = loadingMoreLI.cloneNode(true);
        loadingMoreLI.parentNode.removeChild(loadingMoreLI);

        data.articles.map(function(faq) {
                let selectLI = document.createElement('li');
                selectLI.dataset.value = faq.id;
                selectLI.dataset.body = faq.body;
                selectLI.innerHTML = faq.title;
                selectLI.onclick = zenFaqsAdmin.captureOption;
                zenFaqsAdmin.ui.zenFaqUl.append(selectLI);
        });

        zenFaqsAdmin.ui.zenFaqUl.appendChild(cloneLoading);
        /* recreate autoload */
        zenFaqsAdmin.loadingMoreArticles(data);
    },

    updateSelections: function(data) {
        let selectedFAQ = document.querySelector('#zendesk_form_table td.selected');
        if(selectedFAQ) {
            selectedFAQ.querySelector('.faq_title').innerHTML = data.article.title;
            selectedFAQ.querySelector('.preview_copy').innerHTML = data.article.body;
        } else {
            let faq = data.article;
            let showThisFAQ = document.querySelector('input[value="' + faq.id + '"]').parentNode.querySelector('.edit-this-faq');
            if(showThisFAQ) {
                let form_faq_id = document.getElementById("zendesk_faq_id" + showThisFAQ.value);
                let form_faq_title = document.getElementById("faq_title" + showThisFAQ.value);
                let form_faq_preview = document.getElementById("faq_copy_preview" + showThisFAQ.value);

                /* edit selected FAQ selection */
                form_faq_title.innerHTML = faq.title;
                form_faq_preview.innerHTML = faq.body;
            }
        }
    },

    fetchTheThings: function(url, params) {
        let fetchURL = url;

        fetch(fetchURL)
            //transform data into json
            .then((resp) => resp.json())
            .then(function(data) {
                if(params == "refine") {
                    zenFaqsAdmin.refineAvailable(data);

                } else if(data.hasOwnProperty('articles') && params == "addmore") {
                    zenFaqsAdmin.appendAvailable(data);

                } else if(data.hasOwnProperty('articles')) {
                    zenFaqsAdmin.buildAvailable(data);

                } else if(data.hasOwnProperty('categories')) {
                    zenFaqsAdmin.buildCatgeories(data);
                    
                } else if(params == 'fetchset') {
                    zenFaqsAdmin.updateSelections(data);
                }
            })
            .catch(function(error) {
                console.log('fetch error ', error);
            })
    },

    refineSearch: function() {
        if(event.currentTarget.classList.contains('editting')) {
            // were already using
            event.currentTarget.checked = false;
            event.currentTarget.classList.remove('editting');
            zenFaqsAdmin.fetchTheThings(zenFaqsAdmin.urls.url_fetch_articles);
        } else {
            // were not
            event.currentTarget.classList.add('editting');
            zenFaqsAdmin.fetchTheThings(zenFaqsAdmin.urls.url_fetch_categories + '/'+ event.target.value +'/articles', "refine");
        }
    },

    buildCatgeories: function(data) {
        data.categories.map(function(category) {
            let categoryInputLabel = document.createElement('label');
            let categoryInput = document.createElement('input');
            categoryInput.setAttribute('type', 'radio');
            categoryInput.setAttribute('name', 'list-categories');
            categoryInput.setAttribute('value', category.id);
            categoryInputLabel.innerHTML = category.name;
            categoryInput.onclick = zenFaqsAdmin.refineSearch;
            categoryInputLabel.innerHTML = category.name;

            categoryInputLabel.prepend(categoryInput);
            zenFaqsAdmin.ui.categoryList.append(categoryInputLabel);
        });
    },

    refineAvailable: function(data) {
        //capture loading line
        let loadingMoreLI = document.getElementById('load-more');
        let cloneLoading = loadingMoreLI.cloneNode(true);
        cloneLoading.innerHTML = "loading . . .';"
        // clear current results
        zenFaqsAdmin.ui.zenFaqUl.innerHTML = '';
        zenFaqsAdmin.ui.zenFaqUl.append(cloneLoading);
        zenFaqsAdmin.buildAvailable(data);
        zenFaqsAdmin.ui.faqContainer.scrollTop = 0;
    },

    showEditMsg: function(editMsg) {
        zenFaqsAdmin.ui.editMsgWrapper.innerHTML = editMsg;
        zenFaqsAdmin.ui.editMsgWrapper.classList.add('show');
    },

    hideEditMsg: function() {
        zenFaqsAdmin.ui.editMsgWrapper.innerHTML = '';
        zenFaqsAdmin.ui.editMsgWrapper.classList.remove('show');
    },

    clearArticle: function() {
        let selectedFAQ = document.querySelector('#zendesk_form_table td.selected');
        selectedFAQ.querySelector('.faq_title').innerHTML = '';
        selectedFAQ.querySelector('.preview_copy').innerHTML = '';
    },

    userInteractions() {
        /* show selected faq */
        zenFaqsAdmin.ui.allFAQs.forEach(function(interactionFAQ) {
            interactionFAQ.addEventListener('click', event => {

                if(event.currentTarget.classList.contains('editting')) {
                    // were already editing
                    event.currentTarget.checked = false;
                    event.currentTarget.classList.remove('editting');
                    event.currentTarget.closest("td").classList.remove('selected');
                } else {
                    // were not 
                    zenFaqsAdmin.ui.formTableCells.forEach(function(formTableCell) {
                        formTableCell.classList.remove('selected');
                    });
                    event.currentTarget.closest("td").classList.add('selected');
                    event.currentTarget.classList.add('editting');
                    zenFaqsAdmin.hideEditMsg();
                }
            });
        });

        /* allow user to direct edit faq id by entering the field */
        /* must select faq to edit first */
        zenFaqsAdmin.ui.articles.forEach(function(article) {
            article.addEventListener('keydown', event => {
                let updateThisFAQ = article.parentNode.querySelector('input[name="edit-this-faq"]:checked');
                if(updateThisFAQ) {
                    if(event.which === 9 || event.which === 13) {
                        /* track enter/return, tab, and paste */
                        /* do not sumbit form */
                        event.preventDefault();
                        event.stopPropagation();
                        article.value = event.currentTarget.value;
                        if(article.value) {
                            zenFaqsAdmin.fetchTheThings(zenFaqsAdmin.urls.url_fetch_articles +  [event.target.value], "fetchset");
                        } else {
                            zenFaqsAdmin.clearArticle();
                        }
                        zenFaqsAdmin.hideEditMsg();
                    } 
                } else {
                    event.preventDefault();
                    event.stopPropagation();
                    zenFaqsAdmin.showEditMsg(zenFaqsAdmin.ui.altSelectionMsg);
                }
            });
        });
    },

    checkExisting: function() {
        let article_ids = [].slice.call(zenFaqsAdmin.ui.articles);
            article_ids = article_ids.map(article_id => article_id.value);
            article_ids = article_ids.filter(article_id => article_id.length > 0);

        if(article_ids) {
            /* display details for them */
            for(let a = 0; a < article_ids.length; a++) {
                zenFaqsAdmin.fetchTheThings(zenFaqsAdmin.urls.url_fetch_articles + article_ids[a], "fetchset");
            }
        }
    },

    init: function() {
    	if(document.getElementById("zendesk_faq_adminMenu_wrapper")) {
    		/* first load, build the list of articles */
	        zenFaqsAdmin.fetchTheThings(zenFaqsAdmin.urls.url_fetch_articles);
	        /* allow direct edit/fetch of article id */
	        zenFaqsAdmin.userInteractions();
	        /* pull availbe list of categories to sort by */
	        zenFaqsAdmin.fetchTheThings(zenFaqsAdmin.urls.url_fetch_categories);
	        /* if faqs have already been setup previously */
	        zenFaqsAdmin.checkExisting();

    	}
        
    },
        
}

window.addEventListener('load', (event) => {
    zenFaqsAdmin.init();
});
