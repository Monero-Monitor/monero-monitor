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
  var totalCoins = coinsFromAtomic(info.alreadyGeneratedCoins);
  getBTCrates(totalCoins);
  
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

function getBTCrates(totalCoins) {
  var coindesk = new XMLHttpRequest();
  coindesk.open("GET", "https://api.coindesk.com/v1/bpi/currentprice.json", true);
  coindesk.onreadystatechange = function() {
    if (coindesk.readyState == 4) {
      var deskresp = JSON.parse(coindesk.responseText);
      getHistoricalBTC(totalCoins,deskresp);
    }
  }
  coindesk.send();
}

function getHistoricalBTC(totalCoins,deskresp) {
  var USDtoBTC_now = deskresp.bpi.USD.rate_float;
  
  // Get BTXC Historical data from Coindesk:
  var coindesk = new XMLHttpRequest();
  coindesk.open("GET", "https://api.coindesk.com/v1/bpi/historical/close.json?for=yesterday", true);
  coindesk.onreadystatechange = function() {
    if (coindesk.readyState == 4) {
      var resp = JSON.parse(coindesk.responseText);
      var bpi = resp.bpi;
      var day = Object.keys(bpi)[0];
      var USDtoBTC_open = bpi[day];
      var percentUSDtoBTC = (USDtoBTC_now)/USDtoBTC_open;
      
      // Get XMR historical data from Poloniex:
      var t_today = new Date();
      var t_starttoday = t_today.setUTCHours(0,0,0,0) / 1000;
      var polo = new XMLHttpRequest();
      polo.open("GET", "https://poloniex.com/public?command=returnChartData&currencyPair=BTC_XMR&start=" + (t_starttoday) + "&end=9999999999&period=300", true);
      polo.onreadystatechange = function() {
        if (polo.readyState == 4) {
          var poloresp = JSON.parse(polo.responseText);
          var BTCtoXMR_open = poloresp[0].open;
          var BTCtoXMR_now = poloresp[poloresp.length-1].close;
          
          // Calculate XMR Prices/Cap in various denominations:
          var USDtoXMR_open = USDtoBTC_open * BTCtoXMR_open;
          var rateBTC = BTCtoXMR_now;
          var rateUSD = BTCtoXMR_now * USDtoBTC_now;
          var rateGBP = BTCtoXMR_now * deskresp.bpi.GBP.rate_float;
          var rateEUR = BTCtoXMR_now * deskresp.bpi.EUR.rate_float;
          var marketCapUSD = rateUSD * totalCoins;
          
          // Fill in values on popup:
          document.getElementById('USDtoXMR').textContent = rateUSD.toFixed(4);
          document.getElementById('openUSDtoXMR').textContent = USDtoXMR_open.toFixed(4);
          document.getElementById('GBPtoXMR').textContent = rateGBP.toFixed(4);
          document.getElementById('EURtoXMR').textContent = rateEUR.toFixed(4);
          document.getElementById('BTCtoXMR').textContent = Number(rateBTC).toFixed(5);
          document.getElementById('CapUSD').textContent = '$' + numberWithCommas(marketCapUSD.toFixed(2));
          
          // XMR Percent Gain/Loss in USD:
          var percentUSDtoXMR = (rateUSD/USDtoXMR_open - 1) * 100;
          document.getElementById('percentUSDtoXMR').textContent = '(' + percentUSDtoXMR.toFixed(2) + '%)';
          if (percentUSDtoXMR >= 0) {
            document.getElementById('percentUSDtoXMR').style.color = "#00bb00";
          } else {
            document.getElementById('percentUSDtoXMR').style.color = "#bb0000";
          }
          
          // Show price info:
          document.getElementById('usdtable').style.display = 'inline-block';
          document.getElementById('captable').style.display = 'inline-block';
        }
      }
      polo.send();
    }
  }
  coindesk.send();
}