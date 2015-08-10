function updateNetworkStats() {
  // Get Blockchain Explorer Info:
  var bchain = new XMLHttpRequest();
  bchain.open("GET", "http://chainradar.com/api/v1/mro/status", true);
  bchain.onreadystatechange = function() {
    if (bchain.readyState == 4) {
      setChainInfo(JSON.parse(bchain.responseText));
    }
  }
  bchain.send();
}

function setChainInfo(info) {
  // Use parsed data to update Network information:
  console.log(info);
  document.getElementById('difficulty').textContent = numberWithCommas(info.difficulty);
  document.getElementById('blockheight').textContent = info.height;
  document.getElementById('hashrate').textContent = (info.instantHashrate/1000000).toFixed(3) + ' Mh/s';
  document.getElementById('totalsupply').textContent = numberWithCommas(coinsFromAtomic(info.alreadyGeneratedCoins).toFixed(3)) + ' XMR';
  document.getElementById('blockreward').textContent = coinsFromAtomic(info.reward).toFixed(3) + ' XMR';
  document.getElementById('blocktime').textContent = unixTimeToDate(info.timestamp);
}