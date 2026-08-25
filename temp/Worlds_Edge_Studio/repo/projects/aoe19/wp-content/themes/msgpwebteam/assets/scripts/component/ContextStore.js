
export default class ContextStore {
    constructor() {
        this.ui = {
            $windowsButtons: $('.btn-context-store'),
        }
        this._addEventHandlers();
    }
    _addEventHandlers() {
        let self = this;
        this.ui.$windowsButtons.on('click', function (event) {

        event.preventDefault();
        let prodId = $(event.target).parent().data("productId") || $(event.target).data("productId");

        if (prodId == null || prodId == "") {
            self._launchStoreUrl(event);
        }

        /*eslint-disable */
        launchProductPurchase({
            productId: prodId,
            storeDomain: "www.xbox.com",
            styleOverrides: {
                "z-index": 1,
                "position": "fixed",
                "top": "50%",
                "left": "50%",
                "margin-left": 0,
                "transform": "translate(-50%,-50%)",
            },
        })
            .then((result) => {
                console.log('purchase result: ' + JSON.stringify(result));
                if (result.status && result.status == "UserNotSignedIn") {
                    self._launchStoreUrl(event);
                }
            })
            .catch((error) => { 
                console.log('purchase error: '+error);
                self._launchStoreUrl(event);
            });
        /*eslint-enable */
        //return false;

        });
    }

    _launchStoreUrl(event) {
        var storeUrl = $(event.target).parent().data("productUrl") || $(event.target).data("productUrl");
        if (storeUrl != "") {
            location.href = storeUrl;
        }
    }
}