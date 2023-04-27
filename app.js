/*typewrite effect*/

let i = 0;
let txt = `Welcome to Dictionary.com !`;

function typeWriter() {
  if (i < txt.length) {
    document.getElementById("title").innerHTML += txt.charAt(i);
    i++;
    setTimeout(typeWriter, 50);
  }
}

/*dark-theme*/
let contrastToggle = false;
function toggleContrast() {
  contrastToggle = !contrastToggle;
  if (contrastToggle) {
    document.body.classList = " dark-theme";
  } else {
    document.body.classList.remove("dark-theme");
  }
}

/*API fetching*/
const dictionaryEl = document.querySelector(".dictionary--list");
window.onkeyup = keyUp;
let word = "";
let audios;

function keyUp(event) {
  let searchBtn = document.querySelector(".fa-magnifying-glass");
  word = event.target.value;
  searchBtn.addEventListener("click", () => {
    renderDictionary(word);
  });
  if (event.keyCode == 13) {
    renderDictionary(word);
  }
}

/*add in fade effect to show dictionary also its all lopsided*/

async function renderDictionary(word) {
  const loadingWrapper = document.querySelector(".loading");

  if (loadingWrapper) {
    loadingWrapper.classList.add("loading");
  }

  let dictionaryData;
  try {
    const rawData = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
    );
    dictionaryData = await rawData.json();
    console.log(dictionaryData[0]);
  } catch (error) {
    console.error("Failed to fetch dictionary data", error);
  }

  if (!loadingWrapper) {
    loadingWrapper.classList.remove("loading");
  }

  try {
    dictionaryEl.innerHTML = [dictionaryData[0]]
      .map((dictionary) => dictionaryHTML(dictionary))
      .join("");
  } catch (error) {
    dictionaryEl.innerHTML = `Can't find the meaning of "${word}". Please, try to search for another word.`;
  }
}


function dictionaryHTML(dictionary) {
  let array = dictionary.meanings[0].definitions;
  if (array.length >= 3) {
    return `
    <div class="dictionary--description">
      <div class="loading">
      <i class="fa-solid fa-spinner loading-spinner"></i>
    </div>
    <div class="dictionary--description">
    <div class="dictionary__word">
    <h2 class="word">${dictionary.word}</h3>
    <div class="dictionary__word__sound__icon">
         <a onclick=playSound(word)><i class="fa-solid fa-volume-high"></i></a>
    </div>
    <p class="word--pronunciation text--grey">[ ${dictionary.phonetics[0].text} ]</p>
</div>
<hr>
<div class="dictionary__word--definitions">
<p class="dictionary__word--class">${dictionary.meanings[0].partOfSpeech}</p>
<p class="text--grey">Definitions :</p>
<ol class="dictionary__word--definition--list">
  <li class="dictionary__definition">${dictionary.meanings[0].definitions[0].definition}</li> 
  <li class="dictionary__definition">${dictionary.meanings[0].definitions[1].definition}</li> 
  <li class="dictionary__definition">${dictionary.meanings[0].definitions[2].definition}</li> 
</ol>
</div>
<div class="dictionary__word--source">
<p class="text--grey">Source : </p>
<a href="${dictionary.sourceUrls[0]}" class="source--link">
  ${dictionary.sourceUrls[0]}
  <i class="fa-solid fa-arrow-up-right-from-square"></i>
</a>
</div>
</div>`;
  } else {
    return `
    <div class="dictionary--description">
        <div class="loading">
        <i class="fa-solid fa-spinner loading-spinner"></i>
   </div>
    <div class="dictionary--description">
    <div class="dictionary__word">
    <h2 class="word">${dictionary.word}</h3>
    <div class="dictionary__word__sound__icon">
         <a onclick=playSound(word)><i class="fa-solid fa-volume-high"></i></a>
    </div>
    <p class="word--pronunciation text--grey">[ ${dictionary.phonetics[0].text} ]</p>
</div>
<hr>
<div class="dictionary__word--definitions">
<p class="dictionary__word--class">${dictionary.meanings[0].partOfSpeech}</p>
<p class="text--grey">Definitions :</p>
<ol class="dictionary__word--definition--list">
  <li class="dictionary__definition">${dictionary.meanings[0].definitions[0].definition}</li> 
</ol>
</div>
<div class="dictionary__word--source">
<p class="text--grey">Source : </p>
<a href="${dictionary.sourceUrls[0]}" class="source--link">
  ${dictionary.sourceUrls[0]}
  <i class="fa-solid fa-arrow-up-right-from-square"></i>
</a>
</div>
 </div>`;
  }
}

/*playSound*/
  function playSound(word) {
    const url1 = `https://api.dictionaryapi.dev/media/pronunciations/en/${word}-au.mp3`;
    const url2 = `//ssl.gstatic.com/dictionary/static/sounds/20200429/${word}--_gb_1.mp3`;
    
    const audios = new Audio(url1);
    audios.onerror = function() {
      // The first audio failed to load, so try the second audio after a timeout
      setTimeout(() => {
        audios.src = url2;
        audios.onerror = function() {
          console.error("Failed to play audio for both URLs");
        };
        audios.play();
      }, 1000); // Delay the fallback logic by 1 second (1000 milliseconds)
    };
    
    audios.play();
  }
  
