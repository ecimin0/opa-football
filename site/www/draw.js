// function draw() {
//     var canvas = document.getElementById('canvas');
//     if (canvas.getContext) {
//       var context = canvas.getContext('2d');
//       canvas.width = window.innerWidth - 25;
//       canvas.height = window.innerHeight - 25;
      // context.fillStyle = "#FF0000";
      // context.fillRect(0,0,canvas.width,canvas.height);
      // context.clearRect(40,40,60,60);
      // context.strokeRect(45,45,50,50);
//     }
//   }

function setBg() {
  var dispCount = document.getElementById("counter");
  count = -1;
  dispCount.innerHTML = count;
  const randomColor = Math.floor(Math.random() * 16777215).toString(16).padStart(6, 0);
  document.body.style.backgroundColor = "#" + randomColor;
  randString = String(randomColor);
  color.innerHTML = "#" + randomColor;
  console.log(randomColor);
  var r = parseInt(randString.substr(0, 2), 16);
  var g = parseInt(randString.substr(2, 2), 16);
  var b = parseInt(randString.substr(4, 2), 16);
  var yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
  // var rcolor = document.getElementById("color");
  var h1s = document.getElementsByTagName("h1");
  var buttons = document.getElementsByTagName("button");
  var textColor = (yiq >= 128) ? 'black' : 'white';
  for (var i = 0; i < h1s.length; i++) {
    h1s[i].style.color = textColor;
  }
  for (var i = 0; i < buttons.length; i++) {
    buttons[i].style.color = textColor;
  }
  // buttons.style.color = textColor;
}


function nextBg() {
  currentColor = document.body.style.backgroundColor;
  // return currentColor;
  rgb = currentColor.substring(4, currentColor.length - 1).replace(/ /g, '').split(',');
  seed = Math.floor(Math.random() * 3);
  // return rgb[seed];
  rgb[seed] = parseInt(rgb[seed], 10) + 1
  return rgb;
}


let count = 0;
setBg(); // set background first time on page load
genNew.addEventListener("click", setBg);


document.addEventListener('click', updated);

function updated() {
  var dispCount = document.getElementById("counter");
  count++;
  dispCount.innerHTML = count;
  console.log(count)
}


const $button = document.querySelector("button");

let debounce = false;
$button.addEventListener("click", () => {
  if (debounce) return;
  debounce = true;
  buttonAnimate();
  createWave();
});

const buttonAnimate = () => {
  $button.classList.add("clicked");
  setTimeout(() => {
    $button.classList.remove("clicked");
    debounce = false;
  }, 500);
};

const createWave = () => {
  const wave = document.createElement("div");
  wave.classList.add("wave");
  document.body.appendChild(wave);
  setTimeout(() => wave.remove(), 7000);
};
