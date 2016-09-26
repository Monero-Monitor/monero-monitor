var xhrAddressPoll;
var addressTimeout;

function updateMiningStats() {
  var poolApi = '';
  var address = '';
  var mining = false;

  // Load mining settings from Chrome Storage, and then load mining stats:
  chrome.storage.sync.get({
    enableMining: false,
    miningAddress: '',
    miningPool: ''
  }, function(items) {
    mining = items.enableMining;
    address = items.miningAddress;
    if (items.miningPool == 0) {
      poolApi = 'http://pool.minexmr.com:8080';
    } else if (items.miningPool == 1) {
      poolApi = 'http://monero.crypto-pool.fr:8090';
    } else if (items.miningPool == 2) {
      poolApi = 'https://monerohash.com/api';
    } else if (items.miningPool == 3) {
      poolApi = 'https://api.moneropool.com';
    } else if (items.miningPool == 4) {
      poolApi = 'http://mine.moneroworld.com:8117';
    } else if (items.miningPool == 5) {
      poolApi = 'http://46.165.232.77:8117'; // cryptmonero.com
    } else if (items.miningPool == 6) {
      poolApi = 'http://xmr.prohash.net:8117';
    } else if (items.miningPool == 7) {
      poolApi = 'http://xmrapi.alimabi.cn:80';
    }

    if (mining == true && items.miningPool > 0) {
      if (xhrAddressPoll) xhrAddressPoll.abort();
      if (addressTimeout) clearTimeout(addressTimeout);

      function fetchAddressStats(longpoll){
        xhrAddressPoll = $.ajax({
          url: poolApi + '/stats_address',
          data: {
            address: address,
            longpoll: longpoll
          },
          dataType: 'json',
          cache: 'false',
          success: function(data){

            var addr_balance = coinsFromAtomic(0);
            var addr_hashes = 0;
            var addr_lastshare = 0;
            var addr_paid = coinsFromAtomic(0);
            var addr_hashrate = '0 H/s';

            if (data.stats) {

              // Replace mining info defaults if possible:
              if (data.stats.balance) { addr_balance = coinsFromAtomic(data.stats.balance); }
		      if (data.stats.hashes) { addr_hashes = data.stats.hashes; }
		      if (data.stats.lastShare) { addr_lastshare = data.stats.lastShare; }
	  	      if (data.stats.paid) { addr_paid = coinsFromAtomic(data.stats.paid); }

              // Recent payments and total:
              if (data.payments) {
  				var t_current = new Date().getTime() / 1000;
	  	        var payment;
	  	        var paymentParts;
	  	        var t_payment;
	  	        var t_since_payment;
	  	        document.getElementById("paymentstable").innerHTML = '<tr class="paymentline"><td class="paymenttime" id="payment-time">Date:</td><td class="paymentamount" id="payment-amount">Amount</td><td class="paymentmixin" id="payment-mixin">Mixin</td></tr>';
	  	        for (i = 0; i < (data.payments.length/2); i++) {
	  	          payment = data.payments[2*i];
	  	          paymentParts = payment.split(':');
	  	          t_payment = data.payments[2*i+1];
	  	          t_since_payment = t_current - t_payment;
	  	          if ((i < 5) && (t_since_payment <= 7*86400)){
	  	            var link = 'http://chainradar.com/xmr/transaction/' + paymentParts[0];
	  	            var addRow = '<tr class="paymentline" id="payment-line-' +  i + '"><td class="paymenttime" id="payment-time-' +  i + '"><a target="_blank" class="marketlink" href="' + link + '">' + unixTimeToDate(t_payment) + '</a></td><td class="paymentamount" id="payment-amount-' +  i + '">' + coinsFromAtomic(paymentParts[1]).toFixed(12) + '</td><td class="paymentmixin" id="payment-mixin-' +  i + '">' + paymentParts[3] + '</td></tr>';
	  	            $('#paymentstable').append(addRow);
	  	          }
	  	        }
	  	      }

              // Mining hashrate
	  	      if (data.stats.hashrate) {
		        var hashrate = data.stats.hashrate;
                if (isNaN(hashrate)) {
                  addr_hashrate = hashrate;
                } else {
                  if (hashrate < 1000) {
    	  	        addr_hashrate = hashrate.toFixed(2) + ' H/sec';
      	  	      } else if (addr_hashrate < 3600) {
    	    	    addr_hashrate = (hashrate / 1000).toFixed(2) + ' kH/sec';
      	  	      } else {
    	            addr_hashrate = (hashrate / 1000000).toFixed(2) + ' MH/sec';
      	  	      }
                }
  	  	      }

            }

            // Fill in mining information
            document.getElementById('m-address').textContent = address.substr(0,47) + ' ' + address.substr(48,95);
            document.getElementById('m-balance').textContent = addr_balance.toFixed(12) + ' XMR';
            document.getElementById('m-lastshare').textContent = unixTimeToDate(addr_lastshare);
            document.getElementById('m-paid').textContent = addr_paid.toFixed(6) + ' XMR';
            document.getElementById('m-hashes').textContent = numberWithCommas(addr_hashes);
            document.getElementById('m-hashrate').textContent = addr_hashrate;

            fetchAddressStats(true);
          },
          error: function(e){
	        document.getElementById('m-address').textContent = 'Unable to connect to pool. It may be offline.';
            document.getElementById('m-hashrate').textContent = '0 H/sec';
	        document.getElementById('m-balance').textContent = '0.00000000 XMR';
	        document.getElementById('m-lastshare').textContent = 'N/A';
	        document.getElementById('m-paid').textContent = '0.00000000 XMR';
	        document.getElementById('m-hashes').textContent = '0';

            if (e.statusText === 'abort') return;
            if (addressTimeout) clearTimeout(addressTimeout);
            addressTimeout = setTimeout(function(){
              fetchAddressStats(false);
            }, 5000);
          }
        });
      }
    }
    fetchAddressStats(false);
  });
}
