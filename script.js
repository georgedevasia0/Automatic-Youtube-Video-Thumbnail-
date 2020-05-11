var section = document.getElementById('main');
var container = document.getElementById('result');
var videoURL = document.getElementById('video-url');
var getURL = document.getElementById('submit');
var focusInput = document.getElementById('focus-input');

focusInput.addEventListener('click', setFocus);

function setFocus(e) {
  videoURL.focus();
  e.preventDefault();
}

function parseURL(url) {
  url.match(/(http:|https:|)\/\/(player.|www.|m.)?(vimeo\.com|youtu(be\.com|\.be|be\.googleapis\.com))\/(video\/|embed\/|watch\?v=|v\/)?([A-Za-z0-9._%-]*)(\&\S+)?/);

  if (RegExp.$3.indexOf('youtu') > -1) {
    var type = 'youtube';
  } else if (RegExp.$3.indexOf('vimeo') > -1) {
    var type = 'vimeo';
  }

  return {
    type: type,
    id: RegExp.$6
  };
}

var appendThumb = (function (e) {
  var videoDetails = parseURL(videoURL.value);
  var videoType = videoDetails.type;
  var videoID = videoDetails.id;

  if (videoType == 'youtube') {
    var thumbSRC = 'https://img.youtube.com/vi/' + videoID + '/maxresdefault.jpg';
  }
  else if (videoType == 'vimeo') {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "https://vimeo.com/api/v2/video/" + videoID + ".json", true);
    xhr.onload = function (e) {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          var data = xhr.responseText;
          var parsedData = JSON.parse(data);
          thumbSRClarge = parsedData[0].thumbnail_large;
          thumbSplit = thumbSRClarge.split(/\d{3}(?=.jpg)/);
          thumbSRC = thumbSplit[0] + '1280x720' + thumbSplit[1];
          thumbIMG.src = thumbSRC;
          thumbLINK.href = thumbSRC;
        } else {
          console.error(xhr.statusText);
        }
      }
    };
    xhr.onerror = function (e) {
      console.error(xhr.statusText);
    };
    xhr.send(null);
  }

  container.innerHTML = "";
  var headline = document.createElement('h2');
  if ((videoType == 'youtube') || (videoType == 'vimeo')) {
    headline.innerHTML = "";
  }
  var paragraph = document.createElement('p');
  paragraph.setAttribute('class', 'additional');
  if ((videoType == 'youtube') || (videoType == 'vimeo')) {
    paragraph.innerHTML = "";
  }
  if ((videoType == 'youtube') || (videoType == 'vimeo')) {
    var thumbIMG = document.createElement('img');
    if (videoType == 'youtube') {
      thumbIMG.src = thumbSRC;
    }
    thumbIMG.alt = "Thumbnail of Video";
    thumbIMG.setAttribute('class', 'mb-5');
  }
  if ((videoType == 'youtube') || (videoType == 'vimeo')) {
    var thumbLINK = document.createElement('a');
    if (videoType == 'youtube') {
      thumbLINK.href = thumbSRC;
    }
    thumbLINK.title = "Download Thumbnail";
    thumbLINK.text = "Download Thumbnail";
    thumbLINK.setAttribute('class', 'download btn btn-danger col-lg-3');
    thumbLINK.setAttribute('target', '_blank');
    thumbLINK.setAttribute('download', 'thumbnail');
  }
  container.appendChild(headline);
  if ((videoType == 'youtube') || (videoType == 'vimeo')) {
    container.appendChild(thumbIMG);
  }
  container.appendChild(thumbLINK);
  container.appendChild(paragraph);
  section.appendChild(container);
  e.preventDefault();
});

getURL.addEventListener('click', appendThumb);
