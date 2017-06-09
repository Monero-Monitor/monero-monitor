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

function openSE() {
  // Switch to SE tab:
  closeAll();
  document.getElementById('se-tab').style.display = 'block';
  updateSEFeed();
}

function openMining() {
  // Switch to Mining tab:
  closeAll();
  document.getElementById('mining-tab').style.display = 'block';
  updateMiningStats();
}

function openPodcast() {
  // Switch to Mining tab:
  closeAll();
  document.getElementById('podcast-tab').style.display = 'block';
  loadPodcastXML();
}

function closeAll(){
  document.getElementById('network-tab').style.display = 'none';
  document.getElementById('markets-tab').style.display = 'none';
  document.getElementById('reddit-tab').style.display = 'none';
  document.getElementById('se-tab').style.display = 'none';
  document.getElementById('mining-tab').style.display = 'none';
  document.getElementById('podcast-tab').style.display = 'none';
}
