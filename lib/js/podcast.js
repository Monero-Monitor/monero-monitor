function loadPodcastXML() {
  var xml, xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      displayPodcastFeed(this);
    } else {
      return 0;
    }
  };
  xmlhttp.open("GET", "https://moneromonitor.libsyn.com/rss", true);
  xmlhttp.send();
}

function displayPodcastFeed(xml) {
  var i, xmlDoc, episodes, list, title, date, duration, link, url, item;
  xmlDoc = xml.responseXML;
  episodes = xmlDoc.getElementsByTagName("item");
  if (episodes.length > 0) {
    list = document.getElementById("podcast-list");
    list.innerHTML = "";
    for (i=0; i<episodes.length; i++) {
      image = episodes[i].getElementsByTagName("image")[0].getAttribute("href")
      title = episodes[i].getElementsByTagName("title")[0].innerHTML;
      date = episodes[i].getElementsByTagName("pubDate")[0].innerHTML;
      date = date.substring(0, date.length-15);
      duration = episodes[i].getElementsByTagName("duration")[0].innerHTML;
      link = episodes[i].getElementsByTagName("link")[0].innerHTML;
      url = link.substring(link.indexOf('http'), link.indexOf(']]'));
      item = document.createElement("div");
      item.className = 'podcast-episode';
      item.innerHTML = '<div class="episode-image"><img src="' + image +
        '"/></div><div class="episode-description"><a target="_blank" href="' + url + '">' +
        '<span style="color: #337ab7;">' + title + '</span><br>' + date + ' (' + duration + ')</a></div>';
      list.appendChild(item);
    }
  } else {
    console.log('There is an issue accessing the podcast feed.')
  }
}
