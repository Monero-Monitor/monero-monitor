function unixTimeToDate(timestamp){
  var a = new Date(timestamp * 1000);
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var yr = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var hr = a.getHours();
  var min = '0' + a.getMinutes();
  var sec = '0' + a.getSeconds();
  var time = date+' '+month+' '+yr+', '+hr+':'+min.substr(-2)+':'+sec.substr(-2);
  return time;
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function coinsFromAtomic(atomic) {
    return atomic / 1000000000000;
}