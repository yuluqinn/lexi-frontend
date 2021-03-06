/**
 * Created by joachim on 6/6/17.
 */

var USER = "unknown";

window.browser = (function () {
    return window.msBrowser ||
        window.chrome ||
        window.browser;
})();

// Speed up calls to hasOwnProperty
var hasOwnProperty = Object.prototype.hasOwnProperty;


function check_user_login() {
    var userId;
    browser.storage.sync.get('lexi_user', function(uId) {
        console.log(uId);
        if (isEmpty(uId)) {
            console.log("User not logged on. Requesting credentials...");
            browser.runtime.sendMessage({type:'request_login'}, function () {
                // TODO work with response here, check if login actually worked -- update: actually we can assume this,
                // login form would otherwise not let user through to here
                // console.log("Sending message to request login...");
                // browser.runtime.sendMessage({type:'user_logged_on'}, function () {
                //     return true;
                // });
            });
        } else {
            userId = uId.lexi_user.userId;
            console.log("User ID: "+userId);
            // here we can assume user is logged on just fine
            browser.runtime.sendMessage({type:'user_logged_on'}, function () {
                return true;
            });
        }
    })
}

// from https://stackoverflow.com/questions/4994201/is-object-empty
function isEmpty(obj) {

    // null and undefined are "empty"
    if (obj == null) return true;

    // Assume if it has a length property with a non-zero value
    // that that property is correct.
    if (obj.length > 0)    return false;
    if (obj.length === 0)  return true;

    // If it isn't an object at this point
    // it is empty, but it can't be anything *but* empty
    // Is it empty?  Depends on your application.
    if (typeof obj !== "object") return true;

    // Otherwise, does it have any properties of its own?
    // Note that this doesn't handle
    // toString and valueOf enumeration bugs in IE < 9
    for (var key in obj) {
        if (hasOwnProperty.call(obj, key)) return false;
    }

    return true;
}

// var lexi_has_been_injected = false;
if (typeof lexi_has_been_injected == 'undefined') {
    check_user_login();
    var lexi_has_been_injected = true;
} else {
    console.log("Lexi has already been used in this tab.")
}

browser.storage.sync.get('lexi_user', function (usr_object) {
    USER = usr_object.lexi_user.userId;
    console.log("Started lexi extension. User: "+USER);
});
