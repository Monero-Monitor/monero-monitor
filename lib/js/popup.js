document.addEventListener('DOMContentLoaded', function () {
  
  // Once ready, upload network stats:
  updateNetworkStats();
  
  // Activate only enabled tabs:
  if (chrome.storage.sync.get) {
    chrome.storage.sync.get({
      enableMining: false,
      enableReddit: true,
      redditOrdering: '/',
      enableSE: true,
      seOrdering: 'active',
      enableMarkets: true
    }, function(items) {
      if (items.enableMining == true) {
        document.getElementById('openMiningTabButton').style.display = 'inline';
      }
      if (items.enableReddit == false) {
        document.getElementById('openRedditTabButton').style.display = 'none';
      }
      if (items.enableSE == false) {
        document.getElementById('openSETabButton').style.display = 'none';
      }
      if (items.enableMarkets == false) {
        document.getElementById('openMarketsTabButton').style.display = 'none';
      }
      document.getElementById('reddit-link').innerHTML = '<a target="_blank" href="https://reddit.com/r/monero' + items.redditOrdering + '">/r/monero' + items.redditOrdering + '</a>';
      var description = {
          active: "Active",
          featured: "Featured",
          hot: "Hot",
          week: "Weekly hot",
          month: "Monthly hot",
          newest: "Newest",
          votes: "Most voted",
          unanswered: "Unanswered"
      };
      var url = "https://monero.stackexchange.com/";
      if (items.seOrdering == "hot" || items.seOrdering == "week" || items.seOrdering == "month")
        url += "?tab=";
      else
        url += "questions?sort=";
      url += items.seOrdering;
      document.getElementById('se-tab-header').innerHTML = description[items.seOrdering] + ' questions on <a target="_blank" href="' + url + '">StackExchange</a>:';
    });
  }
  
  // Add event listeners to navigation buttons and links:
  document.getElementById('openNetworkTabButton').addEventListener('click', openNetwork);
  document.getElementById('openMarketsTabButton').addEventListener('click', openMarkets);
  document.getElementById('openRedditTabButton').addEventListener('click', openReddit);
  document.getElementById('openSETabButton').addEventListener('click', openSE);
  document.getElementById('openMiningTabButton').addEventListener('click', openMining);
  document.getElementById('openPodcastTabButton').addEventListener('click', openPodcast);
  document.getElementById('next-reddit').addEventListener('click', nextRedditPage);
  document.getElementById('next-se').addEventListener('click', nextSEPage);
  document.getElementById('settings-menu').addEventListener('click', function() {
    if (chrome.runtime.openOptionsPage) {
      chrome.runtime.openOptionsPage();
    } else {
      window.open(chrome.runtime.getURL('/data/html/options.html'));
    }
  });
  
});