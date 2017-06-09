function updateMarketsStats() {
  // Get Poloniex XMR Ticker info:
  var polo = new XMLHttpRequest();
  polo.open("GET", "https://poloniex.com/public?command=returnTicker", true);
  polo.onreadystatechange = function() {
    if (polo.readyState == 4) {
      var resp = JSON.parse(polo.responseText);
      setPoloInfo(resp);
    }
  }
  polo.send();
}

function setPoloInfo(info) {
  var market_str = ['btc_xmr',   'usdt_xmr',   'xmr_bcn',   'xmr_blk',   'xmr_btcd',   'xmr_dash',   'xmr_ltc',   'xmr_maid',   'xmr_nxt',   'xmr_zec'];
  var markets = [info.BTC_XMR,info.USDT_XMR,info.XMR_BCN,info.XMR_BLK,info.XMR_BTCD,info.XMR_DASH,info.XMR_LTC,info.XMR_MAID,info.XMR_NXT,info.XMR_ZEC];
  var N_markets = markets.length;
  for (i = 0; i < N_markets; i++) {
    var rate_vol = Number(markets[i].baseVolume);
    if (rate_vol > 0) {
      // Only show markets that have volume/returned data:
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
