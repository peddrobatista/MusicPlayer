// vamos selecionar todas as tags ou elementos necessários

const wrapper = document.querySelector(".wrapper"),
musicImg = wrapper.querySelector(".img-area img"),
musicName  = wrapper.querySelector(".song-details .name"),
musicArtist = wrapper.querySelector(".song-details .artist"),
mainAudio = wrapper.querySelector("#main-audio"),
playPauseBtn = wrapper.querySelector(".play-pause"),
prevBtn = wrapper.querySelector("#prev"),
nextBtn = wrapper.querySelector("#next"),
progressArea = wrapper.querySelector(".progress-area"),
progressBar = wrapper.querySelector(".progress-bar"),
musicList = wrapper.querySelector(".music-list"),
showMoreBtn = wrapper.querySelector("#more-music"),
hideMusicBtn = musicList.querySelector("#close");

// carregar música aleatória na atualização da página
let musicIndex = Math.floor((Math.random() * allMusic.length) + 1);

window.addEventListener("load", () => {
    loadMusic(musicIndex); // chamando a função de carregar música assim que a janela for carregada
    playingNow();
})

// função carregar música
function loadMusic(indexNumb) {
    musicName.innerText = allMusic[indexNumb - 1].name;
    musicArtist.innerText = allMusic[indexNumb - 1].artist;
    musicImg.src = `images/${allMusic[indexNumb - 1].img}.jpg`;
    mainAudio.src = `songs/${allMusic[indexNumb - 1].src}.mp3`
}

// função play music
function playMusic() {
    wrapper.classList.add("paused");
    playPauseBtn.querySelector("i").innerText = "pause";
    mainAudio.play();
}

// função pause music
function pauseMusic() {
    wrapper.classList.remove("paused");
    playPauseBtn.querySelector("i").innerText = "play_arrow";
    mainAudio.pause();
}

// função próxima música
function nextMusic() {
    // aqui vamos apenas incrementar o índice em 1
    musicIndex++;
    // se musicIndex for maior que o comprimento do array, musicIndex será 1, então a primeira música será reproduzida
    musicIndex > allMusic.length ? musicIndex = 1 : musicIndex = musicIndex;
    loadMusic(musicIndex);
    playMusic();
    playingNow();
}

// função música anterior
function prevMusic() {
    // aqui vamos apenas decrementar o índice em 1
    musicIndex--;
    // se musicIndex for menor que 1 então musicIndex terá o tamanho do array então a última música irá tocar
    musicIndex < 1 ? musicIndex = allMusic.length : musicIndex = musicIndex;
    loadMusic(musicIndex);
    playMusic();
    playingNow();
}

// play ou evento de botão de música
playPauseBtn.addEventListener("click", () => {
    const isMusicPaused = wrapper.classList.contains("paused");
    // se isMusicPaused for verdadeiro então chama pauseMusic senão chama playmusic
    isMusicPaused ? pauseMusic() : playMusic();
    playingNow();
});

// evento do botão próxima música
nextBtn.addEventListener("click", () => {
    nextMusic(); // chamando a função próxima música
});

// evento do botão música anterior
prevBtn.addEventListener("click", () => {
    prevMusic(); // chamando a função próxima música
});

// atualizando a barra de progresso de acordo com o tempo atual da música
mainAudio.addEventListener("timeupdate", (e) => {
    const currentTime = e.target.currentTime; // pegando o tempo atual da música
    const duration = e.target.duration; // pegando a duração total da música
    let progressWidth = (currentTime / duration) * 100;
    progressBar.style.width = `${progressWidth}%`;

    let musicCurrentTime = wrapper.querySelector(".current"),
    musicDuration = wrapper.querySelector(".duration");

    mainAudio.addEventListener("loadeddata", () => {
        // atualiza a duração total da música
        let audioDuration = mainAudio.duration;
        let totalMin = Math.floor(audioDuration / 60);
        let totalSec = Math.floor(audioDuration % 60);
        if (totalSec < 10) {
            totalSec = `0${totalSec}`;
        }
        musicDuration.innerText = `${totalMin}:${totalSec}`;
    });

    // atualiza a reprodução do tempo atual da música
    let currentMin = Math.floor(currentTime / 60);
    let currentSec = Math.floor(currentTime % 60);
    if (currentSec < 10) {
        currentSec = `0${currentSec}`;
    }
    musicCurrentTime.innerText = `${currentMin}:${currentSec}`;
});

// vamos atualizar o tempo atual da música de acordo com a largura da barra de progresso
progressArea.addEventListener("click", (e) => {
    let progressWidthval = progressArea.clientWidth; // pegando a largura da barra de progresso
    let clickedOffSetX = e.offsetX; // pegando o valor offset x
    let songDuration = mainAudio.duration; // pegando a duração total da música

    mainAudio.currentTime = (clickedOffSetX / progressWidthval) * songDuration;
    playMusic();
});

// Vamos trabalhar na repetição, embaralhar a música de acordo com o ícone
const repeatBtn = wrapper.querySelector("#repeat-plist");
repeatBtn.addEventListener("click", () => {
    // primeiro obtemos o innerText do ícone então vamos mudar de acordo
    let getText = repeatBtn.innerText; // pegando o innerText do ícone
    // vamos fazer mudanças diferentes em cliques de ícones diferentes usando o botão
    switch(getText) {
        case "repeat": // se o ícone for repeat então mude para repeat_one
            repeatBtn.innerText = "repeat_one";
            repeatBtn.setAttribute("title", "Música em loop")
            break;
        case "repeat_one": // se o ícone for repeat_one então mude para shuffle
            repeatBtn.innerText = "shuffle";
            repeatBtn.setAttribute("title", "Reprodução aleatória")
            break;
        case "shuffle": // se o ícone for shuffle então mude para repeat
            repeatBtn.innerText = "repeat";
            repeatBtn.setAttribute("title", "Lista de Reprodução em loop")
            break;
    }
});

// acima apenas mudamos o ícone, agora vamos trabalhar no que fazer
// depois que a música acabou

mainAudio.addEventListener("ended", () => {
    // faremos de acordo com o ícone significa que, se o usuário tiver definido o ícone para repetir a música, repetiremos
    // a música atual e fará mais de acordo

    let getText = repeatBtn.innerText; // pegando o innerText do ícone
    // vamos fazer mudanças diferentes em cliques de ícones diferentes usando o botão
    switch(getText) {
        case "repeat": // se o ícone for repeat então simplesmente chamamos a função  nextMusic que será reproduzida
            nextMusic();
            break;
        case "repeat_one": // se o ícone for repeat_one então mudamos o tempo de reprodução atual da música para 0 que fará a musica ser reiniciada
            mainAudio.currentTime  = 0;
            loadMusic(musicIndex);
            playMusic(); // chamando a função playMusic
            break;
        case "shuffle": // se o ícone for shuffle então mude para repeat
            // gerando índice randômico entre o range máximo da comprimento do array
            let randIndex = Math.floor((Math.random() * allMusic.length) + 1);
            do {
                randIndex = Math.floor((Math.random() * allMusic.length) + 1);
            } while (musicIndex == randIndex); // este loop é executado até que o próximo número aleatório não seja o mesmo do índice de música atual
            musicIndex = randIndex; // passando randomIndex para musicIndex para que a música aleatória toque
            loadMusic(musicIndex); // chamando a função loadMusic
            playMusic(); // chamando a função playMusic
            playingNow();
            break;
    }
});

showMoreBtn.addEventListener("click", () => {
    musicList.classList.toggle("show");
});

hideMusicBtn.addEventListener("click", () => {
    showMoreBtn.click();
});

const ulTag = wrapper.querySelector("ul");

// Vamos criar li de acordo com o comprimento do array
for (let i = 0; i < allMusic.length; i++) {
    // Vamos passar o nome da música, artista do array para li
    let liTag =`
        <li li-index="${i + 1}">
            <div class="row">
                <span>${allMusic[i].name}</span>
                <p>${allMusic[i].artist}</p>
            </div>
            <audio class="${allMusic[i].src}" src="songs/${allMusic[i].src}.mp3"></audio>
            <span id="${allMusic[i].src}" class="audio-duration">3:40</span>
        </li>
    `;
    ulTag.insertAdjacentHTML("beforeend", liTag);
// Passando a duração da música para o li 
    let liAudioDuration = ulTag.querySelector(`#${allMusic[i].src}`);
    let liAudioTag = ulTag.querySelector(`.${allMusic[i].src}`);

    liAudioTag.addEventListener("loadeddata", () => {
        let audioDuration = liAudioTag.duration;
        let totalMin = Math.floor(audioDuration / 60);
        let totalSec = Math.floor(audioDuration % 60);
        if (totalSec < 10) { // adiciona 0 se o segundo for menor que 10
            totalSec = `0${totalSec}`;
        }
        liAudioDuration.innerText = `${totalMin}:${totalSec}`;
        // adicionando o atributo de duração t que usaremos abaixo
        liAudioDuration.setAttribute("t-duration", `${totalMin}:${totalSec}`);
    });
}
// Reproduzindo a música particular no clique
const allLiTags = ulTag.querySelectorAll("li");
function playingNow() {
    for (let j = 0; j < allLiTags.length; j++) {
        let audioTag = allLiTags[j].querySelector(".audio-duration");
        // vamos remover a classe de reprodução de todas as outras li, espere a última que for clicada
        if (allLiTags[j].classList.contains("playing")) {
            allLiTags[j].classList.remove("playing");
            // Vamos pegar o valor da duração do áudio e passar para .audio-duration innerText
            let adDuration = audioTag.getAttribute("t-duration");
            audioTag.innerText = adDuration; // passando o valor t-duraton para duração do áudio innerText
        }
        // se houver uma tag li cujo li-index seja igual a musicIndex então esta música está tocando agora e vamos estilizá-la
        if (allLiTags[j].getAttribute("li-index") == musicIndex) {
            allLiTags[j].classList.add("playing");
            audioTag.innerText = "Playing";
        }
    
        // Adicionando o atributo onclick em todas as tags li
        allLiTags[j].setAttribute("onclick", "clicked(this)");
    }
}
// Vamos tocar a música no li click
function clicked(element) {
    // obtendo o índice li da tag li clicada em particular
    let getLiIndex = element.getAttribute("li-index");
    musicIndex = getLiIndex; // passando o li-index para musicIndex
    loadMusic(musicIndex);
    playMusic();
    playingNow();
}