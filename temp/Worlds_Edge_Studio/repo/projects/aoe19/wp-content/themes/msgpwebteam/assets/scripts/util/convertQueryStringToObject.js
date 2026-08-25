/**
 * convertQueryStringToObject
 * @description: Accepts query string and returns an object of name / value pairs.
 * @param: 'str' is optional, defaults to location.search
 * @return: {}
 */

const convertQueryStringToObject = function(str) {
	//ex: '?foo=bar&abc=123&bool=true&quxzot'
	let qs = str || decodeURIComponent(location.search.substring(1)); //decode and remove leading '?'
	let pairs = qs.split('&'); //['foo=bar','abc=123','bool=true','quxzot']
	let result = {};
	if (!qs) {return null;}
	pairs.forEach(function(pair) {
		pair = pair.split('=');
		let key = pair[0];
		let val = pair[1] || null;
		if (val !== null) {
			//convert numbers first
			if (!isNaN(Number(val))) {
        val = Number(val);
      }
			//then convert booleans
			else if (val === 'true') {
        val = true;
      }
			else if (val === 'false') {
        val = false;
      }
		}
		result[key] = val;
	});
  //ex: {foo: 'bar', abc: 123, bool: true, quxzot: null}
	return result;
};

export default convertQueryStringToObject;
