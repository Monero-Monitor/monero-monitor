function updateSEFeed() {
  chrome.storage.sync.get({
    seNumPosts: 10,
    seOrdering: 'active'
  }, function(items) {
    // Get Blockchain Explorer Info:
    var se = new XMLHttpRequest();
    var url = "https://api.stackexchange.com/2.2/questions";
    if (items.seOrdering == "featured" || items.seOrdering == "unanswered")
      url += "/" + items.seOrdering;
    url += "?site=monero.stackexchange&order=desc&sort=";
    var sort = {
      active: "activity",
      featured: "activity",
      hot: "hot",
      week: "week",
      month: "month",
      newest: "creation",
      votes: "votes",
      unanswered: "votes"
    };
    url += sort[items.seOrdering];
    se.open("GET", url, true);
    se.onreadystatechange = function() {
      if (se.readyState == 4) {
        // JSON.parse does not evaluate an attacker's scripts.
        var resp = JSON.parse(se.responseText);
        for (i = 0; i < 30; i++) {
          if (i < resp.items.length && i < items.seNumPosts) {
            writeSELine(resp.items[i], i);
          } else {
            document.getElementById('se-line' + i).style.display = 'none';
          }
        }
      }
    }
    se.send();
  });
}

function writeSELine(info, i) {
  // vote(s)
  var span_vote = document.getElementById('se-vote-' + i);
  span_vote.innerHTML = info.score + '<br><span style="font-size:80%;" >vote' + (info.score != 1 ? 's' : '') + '</span>';

  // answer(s)
  var div_answer = document.getElementById('se-answer-'+ i);
  div_answer.innerHTML = info.answer_count + '<br><span style="font-size:80%;" >answer' + (info.answer_count != 1 ? 's' : '') + '</span>';
  if (info.answer_count > 0)
    div_answer.style.color = "#4c9067";
  if (info.is_answered)
    div_answer.style["background-color"] = "#e4f9d3";

  // view(s)
  var span_view = document.getElementById('se-view-' + i);
  span_view.innerHTML = info.view_count + '<br><span style="font-size:80%;" >view' + (info.view_count != 1 ? 's' : '') + '</span>';

  // bounty
  if (info.bounty_amount) {
    var span_bounty = document.getElementById('se-bounty' + i);
    span_bounty.innerHTML = '+' + info.bounty_amount;
    span_bounty.style.display = 'inline';
  }

  // title
  var span_title = document.getElementById('se-title-' + i);
  if (info.title.length > 100) {
    span_title.textContent = info.title.substr(0,99) + '...';
  } else {
    span_title.textContent = info.title;
  }
  var a_t = document.createElement('a');
  a_t.href = info.link;
  a_t.target = '_blank';
  a_t.class = 'title';
  span_title.appendChild(a_t).appendChild(a_t.previousSibling);

  // tags
  var span_tags = document.getElementById('se-tag-' + i);
  span_tags.innerHTML = '';
  for (var j = 0; j < info.tags.length; ++j) {
    span_tags.innerHTML += '<span class="se-tag"><a target="_blank" href="https://monero.stackexchange.com/questions/tagged/' + info.tags[j]+ '">' + info.tags[j] + '</a></span> ';
  }

  // time & author
  var div_time_author = document.getElementById('se-time-author-' + i);
  var t_created = info.creation_date;
  var t_current = new Date().getTime() / 1000;
  var n_secs = (t_current - t_created).toFixed(0);
  div_time_author.innerHTML = 'asked ';
  if (n_secs < 60) {
    div_time_author.innerHTML += n_secs + ' second' + (n_secs > 1 ? 's' : '');
  } else if (n_secs < 3600) {
    var n_mins = (n_secs / 60).toFixed(0);
    div_time_author.innerHTML += n_mins + ' minute' + (n_mins > 1 ? 's' : '');
  } else if (n_secs < 172800) {
    var n_hrs = (n_secs / 3600).toFixed(0);
    div_time_author.innerHTML += n_hrs + ' hour' + (n_hrs > 1 ? 's' : '');
  } else {
    var n_days = (n_secs / 86400).toFixed(0);
    div_time_author.innerHTML += n_days + ' day' + (n_days > 1 ? 's' : '');
  }
  div_time_author.innerHTML += ' ago by ';

  // author
  var reputation = info.owner.reputation;
  if (reputation > 10000) {
    reputation = Math.floor(reputation / 100);
    reputation /= 10;
    reputation += 'k';
  }
  div_time_author.innerHTML += '<a class="se-time-author" target="_blank" href="' + info.owner.link + '">' + info.owner.display_name + '</a> <strong>' + reputation + '</strong>';
}

function nextSEPage() {
  // Specify ordering
  chrome.storage.sync.get({
    seOrdering: 'active'
  }, function(items) {
    var url = "https://monero.stackexchange.com/";
    if (items.seOrdering == "hot" || items.seOrdering == "week" || items.seOrdering == "month")
      url += "?tab=";
    else
      url += "questions?sort=";
    url += items.seOrdering;
    chrome.tabs.create({'url': url});
  });
}
