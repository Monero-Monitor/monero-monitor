function updateMarketsStats() {
  // Get Poloniex XMR Ticker info:
  var polo = new XMLHttpRequest();
  polo.open("GET", "https://poloniex.com/public?command=returnTicker", true);
  polo.onreadystatechange = function() {
    if (polo.readyState == 4) {
      var resp = JSON.parse(polo.responseText);
      setPoloInfo(resp);
      
      chrome.storage.sync.get({
        totalCoins: 0,
      }, function(items) {
        var lastBTCtoXMR = resp.BTC_XMR.last;
        var marketCapBTC = lastBTCtoXMR * items.totalCoins;
        getBTCrates(lastBTCtoXMR,marketCapBTC);
      });
    }
  }
  polo.send();
}

function setPoloInfo(info) {
  var N_markets = 17;
  var market_str = ['btc_xmr',   'usdt_xmr',   'xmr_bbr',   'xmr_bcn',   'xmr_blk',   'xmr_btcd',   'xmr_dash',   'xmr_diem',   'xmr_dsh',   'xmr_hyp',   'xmr_ifc',   'xmr_ltc',   'xmr_maid',   'xmr_mnta',   'xmr_nxt',   'xmr_qora',   'xmr_xdn'];
  var markets = [info.BTC_XMR,info.USDT_XMR,info.XMR_BBR,info.XMR_BCN,info.XMR_BLK,info.XMR_BTCD,info.XMR_DASH,info.XMR_DIEM,info.XMR_DSH,info.XMR_HYP,info.XMR_IFC,info.XMR_LTC,info.XMR_MAID,info.XMR_MNTA,info.XMR_NXT,info.XMR_QORA,info.XMR_XDN];
  for (i = 0; i < N_markets; i++) {
    var rate_vol = Number(markets[i].baseVolume);
    if (rate_vol > 0) {
      // Only show markets that have volume / returned data:
      document.getElementById(market_str[i] + '-line').style.display = '';
      var rate = Number(markets[i].last);
      var rate_pct = markets[i].percentChange * 100;
      document.getElementById(market_str[i]).textContent = rate.toFixed(8);
      document.getElementById(market_str[i] + '_vol').textContent = rate_vol.toFixed(2);
      document.getElementById(market_str[i] + '_pct').textContent = '(' + rate_pct.toFixed(2) +'%)';
      if (markets[i].percentChange >= 0) {
        document.getElementById(market_str[i] + '_pct').style.color = "#00bb00";
      } else {
        document.getElementById(market_str[i] + '_pct').style.color = "#bb0000";
      }
      
      
      // Link to Market:
      var a = document.createElement('a');
      a.href = 'https://poloniex.com/exchange#' + market_str[i];
      a.target = '_blank';
      a.class = 'marketlink';
      document.getElementById(market_str[i] + '-link').appendChild(a).appendChild(a.previousSibling);
      
    } else {
      // Hide markets with not volume or data returned:
      document.getElementById(market_str[i] + '-line').style.display = 'none';
    }
  }
}

function getBTCrates(lastBTCtoXMR,marketCapBTC) {
  var coindesk = new XMLHttpRequest();
  coindesk.open("GET", "https://api.coindesk.com/v1/bpi/currentprice.json", true);
  coindesk.onreadystatechange = function() {
    if (coindesk.readyState == 4) {
      var resp = JSON.parse(coindesk.responseText);
      
      var rateBTC = lastBTCtoXMR;
      var rateUSD = lastBTCtoXMR * resp.bpi.USD.rate_float;
      var rateGBP = lastBTCtoXMR * resp.bpi.GBP.rate_float;
      var rateEUR = lastBTCtoXMR * resp.bpi.EUR.rate_float;
      
      var marketCapUSD = marketCapBTC * resp.bpi.USD.rate_float;
      var marketCapGBP = marketCapBTC * resp.bpi.GBP.rate_float;
      var marketCapEUR = marketCapBTC * resp.bpi.EUR.rate_float;
      
      console.log(lastBTCtoXMR);
      console.log(rateUSD);
      console.log(rateGBP);
      console.log(rateEUR);
      
      document.getElementById('BTCtoXMR').textContent = Number(lastBTCtoXMR).toFixed(5);
      document.getElementById('USDtoXMR').textContent = rateUSD.toFixed(5);
      document.getElementById('GBPtoXMR').textContent = rateGBP.toFixed(5);
      document.getElementById('EURtoXMR').textContent = rateEUR.toFixed(5);
      
      document.getElementById('CapBTC').textContent = numberWithCommas(marketCapBTC.toFixed(2));
      document.getElementById('CapUSD').textContent = numberWithCommas(marketCapUSD.toFixed(2));
      document.getElementById('CapGBP').textContent = numberWithCommas(marketCapGBP.toFixed(2));
      document.getElementById('CapEUR').textContent = numberWithCommas(marketCapEUR.toFixed(2));
    }
  }
  coindesk.send();
}