const $= document.querySelector.bind(document)
const $$= document.querySelectorAll.bind(document)
/** 
    1. Render songs
    2. Scroll top
    3. Play / pause / tua
    4. CD rotate
    5. Progress bar
    6.Next / Prev
    7. Ended song event
    8. Random / repeat
    9. Active song
    10. Scroll to Active song
    11.Choose song
*/
const PlAYER_STORAGE_KEY = "DUY";

const player = $(".player");
const cd = $(".cd");
const heading = $("header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const playBtn = $(".btn-toggle-play");
const playlist = $(".playlist");
const progress= $("#progress")
const nextBtn = $(".btn-next")
const prevBtn = $(".btn-prev")
const randomBtn = $(".btn-random")
const repeatBtn = $(".btn-repeat")

const app ={
    currentIndex: 0,
    isPlaying:false,
    isRandom:false,
    isRepeat:false,
    config: {},
    // (1/2) Uncomment the line below to use localStorage
     config: JSON.parse(localStorage.getItem(PlAYER_STORAGE_KEY)) || {},
    songs:
    [
        {
            name: 'Lalisa',
            singer:'LISA',
            path:'./assets/music/song1.mp3',
            image:"./assets/image/song1.jpg"
        },
        {
            name: 'How you like that',
            singer:'BLACKPINK',
            path:'./assets/music/song2.mp3',
            image:'./assets/image/song2.jpg'
        },
        {
            name: 'Song 3',
            singer:'LISA',
            path:'./assets/music/song1.mp3',
            image:'./assets/image/song1.jpg'
        },
        {
            name: 'Song 4',
            singer:'LISA',
            path:'./assets/music/song1.mp3',
            image:'./assets/image/song1.jpg'
        },
        {
            name: 'Song 5',
            singer:'LISA',
            path:'./assets/music/song1.mp3',
            image:'./assets/image/song1.jpg'
        },
        {
            name: 'Song 6',
            singer:'LISA',
            path:'./assets/music/song1.mp3',
            image:'./assets/image/song1.jpg'
        },
        {
            name: 'Song 7',
            singer:'LISA',
            path:'./assets/music/song1.mp3',
            image:'./assets/image/song1.jpg'
        },
        {
            name: 'Song 8',
            singer:'LISA',
            path:'./assets/music/song1.mp3',
            image:'./assets/image/song1.jpg'
        },
        {
            name: 'Song 9',
            singer:'LISA',
            path:'./assets/music/song1.mp3',
            image:'./assets/image/song1.jpg'
        },
        {
            name: 'Song 10',
            singer:'LISA',
            path:'./assets/music/song1.mp3',
            image:'./assets/image/song1.jpg'
        },
        {
            name: 'Song 11',
            singer:'LISA',
            path:'./assets/music/song1.mp3',
            image:'./assets/image/song1.jpg'
        },
        {
            name: 'Song 12',
            singer:'LISA',
            path:'./assets/music/song1.mp3',
            image:'./assets/image/song1.jpg'
        },
        {
            name: 'Song 13',
            singer:'LISA',
            path:'./assets/music/song1.mp3',
            image:'./assets/image/song1.jpg'
        }
    ],

    setConfig: function (key, value) {
        this.config[key] = value;
        // (2/2) Uncomment the line below to use localStorage
         localStorage.setItem(PlAYER_STORAGE_KEY, JSON.stringify(this.config));
      },

    render:function()
    {
        const htmls= this.songs.map((song, index) =>
        {
            return `
            <div class="song  ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                <div class="thumb" style="background-image: url('${song.image}')">
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>
            `
        })
        playlist.innerHTML=htmls.join('')
    },
    defineProperties: function()
    {
        Object.defineProperty(this,'currentSong',
        {
            get: function()
            {
                return this.songs[this.currentIndex]
            }
        })
    },
    handleEvents: function()
    {
        const cdWidth = cd.offsetWidth
        const _this = this;
        //xu ly thu nho avatar
        document.onscroll= function()
        {
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newWidth= cdWidth - scrollTop

            cd.style.width= newWidth>0 ? newWidth + 'px' : 0
            cd.style.opacity= newWidth / cdWidth
        }

        // Xử lý CD quay / dừng
        const cdThumbAnimate = cdThumb.animate([{ transform: "rotate(360deg)" }], {
            duration: 10000, // 10 seconds
            iterations: Infinity
        });
        cdThumbAnimate.pause() //default đĩa cd dừng
        console.log(cdThumbAnimate)

        //xu ly nut play
        playBtn.onclick=function()
        {
            if(_this.isPlaying)
            {
                audio.pause()
            }
            else
            {
                audio.play()
                
            }
        }

        //khi song dc play
        audio.onplay=function()
        {
            _this.isPlaying=true
            player.classList.add('playing')
            cdThumbAnimate.play()
        }

        //khi song bi pause
        audio.onpause=function()
        {
            _this.isPlaying=false
            player.classList.remove('playing')
            cdThumbAnimate.pause()
        }

        //tiến độ bài hát
        audio.ontimeupdate=function()
        {
            // console.log(audio.currentTime)
            // console.log(audio.duration) 
            // console.log(audio.currentTime / audio.duration * 100) //lấy % tiến độ bài hát\
            if (audio.duration)
            {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                progress.value= progressPercent //value="0" step="1" min="0" max="100" value ben html
            }
        }

        //xử lý tua
        progress.onchange = function(e)
        {
            // console.log(audio.duration / 100 * e.target.value)  //lấy % khi click value
            const seekTime =audio.duration / 100 * e.target.value
            audio.currentTime=seekTime
        }

        //nút next
        nextBtn.onclick= function()
        {
            if(_this.isRandom)
            {
                _this.playRandom()
            }
            else
            {
                _this.nextSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }
        
        //nút prev
        prevBtn.onclick= function()
        {
            if(_this.isRandom)
            {
                _this.playRandom()
            }
            else
            {
                _this.prevSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }

        //xử lý khi nút random dc bật / tắt
        randomBtn.onclick=function(e)
        {
            _this.isRandom = !_this.isRandom
            _this.setConfig("isRandom", _this.isRandom);
            randomBtn.classList.toggle('active',_this.isRandom) //class làm đỏ nút
        }

        //xử lý khi nút repeat dc bật / tắt
        repeatBtn.onclick=function(e)
        {
            _this.isRepeat = !_this.isRepeat
            _this.setConfig("isRepeat", _this.isRepeat);
            repeatBtn.classList.toggle('active',_this.isRepeat) //class làm đỏ nút
        }

        //xử lý khi song end
        audio.onended=function()
        {
            if(_this.isRepeat)
            {
                audio.play()
            }
            else
            {
                nextBtn.play()
            }
            console.log(123) //test
        }

        //choose song
        playlist.onclick=function(e)
        {
            const songNode = e.target.closest('.song:not(.active)')
            if( songNode || e.target.closest('.option'))
            {
                //xử lý khi click vào song
                if(songNode)
                {
                    // console.log(songNode.dataset.index) //test click index
                    _this.currentIndex =Number( songNode.dataset.index) //chuyển từ chuỗi thành số
                    _this.loadCurrentSong()
                    _this.render()
                    audio.play()
                }
                //xử lý khi click ...
                if (e.target.closest(".option")) {
                    //update thêm
                }

            }

        }


    },

    scrollToActiveSong: function()
    {
        setTimeout(() => {
            $(".song.active").scrollIntoView({
              behavior: "smooth",
              block: "nearest"
            });
          }, 300);
    },

    loadCurrentSong: function()
    {
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src=this.currentSong.path
    },

    loadConfig: function () {
        this.isRandom = this.config.isRandom;
        this.isRepeat = this.config.isRepeat;
    },

    nextSong: function()
    {
        this.currentIndex++
        if(this.currentIndex >= this.songs.length)
        {
            this.currentIndex=0
        }
        this.loadCurrentSong()
    },

    prevSong: function()
    {
        this.currentIndex--
        if(this.currentIndex < 0)
        {
            this.currentIndex=this.songs.length -1
        }
        this.loadCurrentSong()
    },

    playRandom: function()
    {
        let newIndex
        do{
            newIndex = Math.floor(Math.random() * this.songs.length) //math.floor làm tròn, random số * với độ dài songs
        } while ( newIndex === this.currentIndex) //tiếp tục lặp khi index bài cũ bằng index bài mới
        this.currentIndex = newIndex
        this.loadCurrentSong()
    },

    start: function()
    {
        this.loadConfig(); // Gán cấu hình từ config vào ứng dụng

        this.defineProperties() //dinh nghia thuoc tinh cho object
        this.handleEvents() //lang nghe va xu ly cac event
        this.loadCurrentSong() //load thong tin bai hat dau tien 
        this.render() //render bai hat

        // Hiển thị trạng thái ban đầu của button repeat & random
        randomBtn.classList.toggle("active", this.isRandom);
        repeatBtn.classList.toggle("active", this.isRepeat);
    }
}
app.start()