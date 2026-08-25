
export default class ZenFaqs {

  constructor () {
    if(document.getElementById('zenfaq')) {
      console.log('zenfaq should build');
      this._init()
    } else {
      console.log('not  zenfaq');
    }
    
  }

  _init(){    
    this.constants = {
      zenArticleIds : document.querySelectorAll('#zenfaq .cordian'),
      urlBase : 'https://support.ageofempires.com/api/v2/help_center/en-us/articles/',
      domWrapper : document.getElementById('zenfaq'),
      loopPass : 0,
    }

    if(this.constants.zenArticleIds.length > 0) {
      console.log('articles found, move forward with script');
      this._fetchZen();
      this.constants.zenArticleIds[0].classList.add('open');
    } else {
      console.log('articles length zero or less');
    }
  }

  _createNode(element) {
      return document.createElement(element);
  }

  _fetchZen() {
    let self = this;

    self.constants.zenArticleIds.forEach(function(zenArticleId) {

        let constructedURL = self.constants.urlBase + zenArticleId.dataset.zenid;

        fetch(constructedURL)
          // transform data into json
          .then((resp) => resp.json())
          .then(function(data) {
            // modify data
             let thisCordian = document.querySelector("[data-zenid='" + data.article.id + "']");
             thisCordian.querySelector('.title').innerHTML = data.article.title;
             thisCordian.querySelector('.words').innerHTML = data.article.body;
          })
          .catch(function(error) {
            // errors here
          })
      })
  }

}