document.addEventListener("DOMContentLoaded", function() {
var lazyloadImages = document.querySelectorAll("img.lazy");    
var lazyloadThrottleTimeout;

function getCurrentLoadedChapter() {
  const element = document.getElementById("img-container")
  let html = element.lastElementChild.getAttribute("src");
  console.log(html)
  let currentChapter = splitChapterUrl(html)
  return currentChapter;
}

function splitChapterUrl(arg) {
  console.log(arg)
  // ../../static/images/1/8-b.png
  const regex = /.*\/(\d+\/\d+\-[ab])\.png/;
  const found = arg.match(regex);
  console.log(found);
  return found[1];
}

function getPageUrl(arg) {
  const url = fetch('/api/nextpage?current='+arg)
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data);
      generateNewPageUrl(data.url);
  })
    .catch((error) => {
      console.error('Error:', error);
  });
}

function generateNewPageUrl(next_url) {
  const container = document.getElementById("img-container");
  var image = document.createElement("img");
  image.setAttribute("src", next_url);
  image.classList.add("lazy")
  container.appendChild(image)
}


// 2 stage lazy loader for js, 
// first fetches image url and creates data-src + lazy
// second stage removes lazy and does lazy load

function lazyload() { // need to fix this, need to add delay between lazy loading a new image (500ms-ish)
  if(lazyloadThrottleTimeout) {
    clearTimeout(lazyloadThrottleTimeout);
  }

  lazyloadThrottleTimeout = setTimeout(function() {
    var scrollLeft = window.pageXOffset;
    lazyloadImages.forEach(function(img) {
        if(img.offsetLeft < (window.innerHeight + scrollLeft)) { // needs to be only left movement, and try to make arrows scroll
          console.log()
          // replace below lines with api to fetch the next set of pages/page
          // track current chapter/page
          // api needs to be given page x, return y (python)
          // create new dom for every set of loaded pages (3?)
          // hide until loaded?
          let currentChapter = getCurrentLoadedChapter();
          let pageUrl = getPageUrl(currentChapter);
          console.log(pageUrl);
          // img.src = img.dataset.src;
          // img.classList.remove('lazy');
        }
    });
    if(lazyloadImages.length == 0) { 
      document.removeEventListener("scroll", lazyload);
      window.removeEventListener("resize", lazyload);
      window.removeEventListener("orientationChange", lazyload);
    }
  }, 20);
}

document.addEventListener("scroll", lazyload);
window.addEventListener("resize", lazyload);
window.addEventListener("orientationChange", lazyload);
});
