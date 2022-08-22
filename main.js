const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const cdthumb = $('.cd .cd-thumb')
const titleSong = $('#player header h2')
const audio = $('.audio')
const btnPlay = $('#player .btn-play-music')
const pause = $('#player .control .icon-pause');
const play = $('#player .control .icon-play');
const progress = $('#progress')
const nextBtn = $('.btn-next')
const preBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playlist = $('.playlist')

const app = {
    currentIndex : 0 ,
    // trạng thái bài hát : tắt (false)
    isPlaying : false,
    isRandom : false,
    isRepeat : false,
    songs : [
        {
            name:'Ato Hitotsu',
            singer:'funkyMonkeyBaby',
            path: './assets/music/AtoHitotsu-FunkyMonkeyBabys_344nf.mp3',
            image:'./assets/img/atohitotsu.jpg'
        },
        {
            name:'Lemon',
            singer:'Kenshi Yonezu',
            path:'./assets/music/Lemon-KenshiYonezu-5411306.mp3',
            image:'./assets/img/Lemon.png'        
        },
        {
            name:'Buoc Qua Mua Co Don',
            singer:'Vu',
            path:'./assets/music/Buoc Qua Mua Co Don - Vu.mp3',
            image:'./assets/img/buocquamuacodon.jpg'
        },
        {
            name:'Gone',
            singer:'ROSE',
            path:'./assets/music/Gone-ROSE.mp3',
            image:'./assets/img/gone.jpg'
        },
        {
            name:'Viva La Vida',
            singer:'ROSE',
            path:'./assets/music/ROSÉ - Viva La Vida.mp3',
            image:'./assets/img/viva la vida.jpg'
        }
    ],
    defineProperties : function () {
        // định nghĩa thuộc tính currentSong cho Object app
        Object.defineProperty(this,'currentSong',{
            get : function () {
                return this.songs[this.currentIndex]
            } 
        })
    },
    loadCurrentSong : function () {
        titleSong.innerText = this.currentSong.name;
        cdthumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path;
    },
    preSong : function () {
        this.currentIndex -- ;
        if(this.currentIndex < 0){
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong();
    },
    nextSong : function () {
        this.currentIndex++;
        if(this.currentIndex >= this.songs.length)
        {
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },
    randomSong : function () {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
        }while(newIndex === this.currentIndex)
        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },
    scrollintoview : function () {
        setTimeout(function(){
            $('.song.active').scrollIntoView({
                behavior:'smooth',
                block : 'nearest'
            })
        },300)
    },
    render : function () {
        const htmls = this.songs.map(function (song, index) {
            return `
                <div class="song ${index === app.currentIndex ? 'active' :''}" data-index="${index}">
                    <div class="song-icon" style="background-image:url('${song.image}')"></div>
                    <div class="song-body">
                        <h3 class="song-title">${song.name}</h3>
                        <p class="song-author">${song.singer}</p>
                    </div>
                    <div class="song-more">
                        <i class="fas fa-ellipsis-h"></i>                
                    </div>
                </div>
            `
        });
        playlist.innerHTML = htmls.join('')
    },
    handleEvents : function () {
        const _this = this;
        const cdthumbHeight = cdthumb.offsetHeight ;
        // sự kiện trượt bài hát
        document.onscroll = function () {
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newcdthumbHeight = cdthumbHeight - scrollTop ; 
            const newcdthumbWidth = scrollTop / cdthumbHeight;

            cdthumb.style.width = 100 - newcdthumbWidth*100 + '%';
            cdthumb.style.minHeight = newcdthumbHeight + 'px';
            cdthumb.style.opacity = newcdthumbHeight / cdthumbHeight ;
        }

        // xoay đĩa cd 
        const cdthumbAnimation = cdthumb.animate([
            {transform:'rotate(360deg)'}
        ],{
            duration:10000,
            iterations:Infinity
        })
        cdthumbAnimation.pause();

        // sự kiện play bài hát
        btnPlay.onclick = function () {
            // play music
            if(_this.isPlaying){
                _this.isPlaying = false;
                pause.style.display = 'block';
                play.style.display = 'none';
                audio.pause();
                cdthumbAnimation.pause();
            }
            // pause music
            else {
                _this.isPlaying = true;
                pause.style.display = 'none';
                play.style.display = 'block';
                audio.play();
                cdthumbAnimation.play();
            }
        }

        // thanh input tiến độ chạy 
        // sự kiện timeupdate : tiến độ bài hát thay đổi
        audio.ontimeupdate = function () {
            if(audio.duration){
                const percentSong = Math.floor(audio.currentTime / audio.duration * 100);
                progress.value = percentSong;
            }
        }
        // tua bài hát
        progress.onchange = function () {
            const seekTime = progress.value * audio.duration / 100;
            audio.currentTime = seekTime
        }

        // next bài hát
        nextBtn.onclick = function () {
            if(_this.isRandom){
                _this.randomSong();
                _this.isPlaying = false;
                btnPlay.click();
                _this.render();
                _this.scrollintoview();
            }
            else {
                _this.nextSong();
                _this.isPlaying = false;
                btnPlay.click();
                _this.render();
                _this.scrollintoview();
            }
        }
        // pre bài hát
        preBtn.onclick = function () {
            if(_this.isRandom){
                _this.randomSong();
                _this.isPlaying = false;
                btnPlay.click();
                _this.render();
                _this.scrollintoview();
            }
            else {
                _this.preSong();
                _this.isPlaying = false;
                btnPlay.click();
                _this.render();
                _this.scrollintoview();
            }
        }
        // bật tắt random bài hát 
        randomBtn.onclick = function () {
            if(_this.isRandom){
                randomBtn.classList.remove('active')
                _this.isRandom = false;
            }
            else {
                randomBtn.classList.add('active')
                _this.isRandom = true;
            }
        }

        // bật tắt repeat bài hát 
        repeatBtn.onclick = function () {
            if(_this.isRepeat)
            {
                repeatBtn.classList.remove('active')
                _this.isRepeat = false;
            }
            else{
                repeatBtn.classList.add('active')
                _this.isRepeat = true;
            }
        }
        // khi hết bài 
        audio.onended = function () {
            if(_this.isRepeat){
                audio.play()
            }
            else{
                nextBtn.click();
            }
        }
        // khi click vào playlist 
        playlist.onclick = function (e) {
            const songNode = e.target.closest('.song:not(.active)')
            if(songNode){
                _this.currentIndex = Number(songNode.dataset.index);
                _this.loadCurrentSong();
                _this.render();
                _this.isPlaying = false;
                btnPlay.click();
            }
        }
    },
    start : function () {
        this.defineProperties();
        this.loadCurrentSong();
        this.render();
        this.handleEvents();
    }
}

app.start()