function openNetwork() {
  // Switch to Network tab:
  closeAll();
  document.getElementById('network-tab').style.display = 'block';
  updateNetworkStats();
}

function openMarkets() {
  // Switch to Markets tab:
  closeAll();
  document.getElementById('markets-tab').style.display = 'block';
  updateMarketsStats();
}

function openReddit() {
  // Switch to Reddit tab:
  closeAll();
  document.getElementById('reddit-tab').style.display = 'block';
  updateRedditFeed();
}

function openMining() {
  // Switch to Mining tab:
  closeAll();
  document.getElementById('mining-tab').style.display = 'block';
  updateMiningStats();
}

function closeAll(){
  document.getElementById('network-tab').style.display = 'none';
  document.getElementById('markets-tab').style.display = 'none';
  document.getElementById('reddit-tab').style.display = 'none';
  document.getElementById('mining-tab').style.display = 'none';
}
  