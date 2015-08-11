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
  // console.log(info);
  var totalCoins = coinsFromAtomic(info.alreadyGeneratedCoins);
  chrome.storage.sync.set({ totalCoins: totalCoins });
  
  document.getElementById('difficulty').textContent = numberWithCommas(info.difficulty);
  document.getElementById('blockheight').textContent = info.height;
  document.getElementById('hashrate').textContent = (info.instantHashrate/1000000).toFixed(3) + ' Mh/s';
  document.getElementById('totalsupply').textContent = numberWithCommas(totalCoins.toFixed(3)) + ' XMR';
  document.getElementById('blockreward').textContent = coinsFromAtomic(info.reward).toFixed(3) + ' XMR';
  document.getElementById('blocktime').textContent = unixTimeToDate(info.timestamp);
  
  var a_height = document.createElement('a');
  a_height.href = 'http://chainradar.com/xmr/block/' + info.height;
  a_height.target = '_blank';
  a_height.class = 'title';
  
  var a_hashrate = document.createElement('a');
  a_hashrate.href = 'http://minexmr.com/pools.html';
  a_hashrate.target = '_blank';
  a_hashrate.class = 'title';
  
  document.getElementById('blockheight').appendChild(a_height).appendChild(a_height.previousSibling);
  document.getElementById('hashrate').appendChild(a_hashrate).appendChild(a_hashrate.previousSibling);
}