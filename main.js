/** Các bước
 * 1. Render songs
 * 2. Scroll Top
 * 3. Play / Pause / Seek
 * 4. CD rotate
 * 5. Next / Prev
 * 6. Random
 * 7. Next / Repeat when ended
 * 8. Active song
 * 9. Scroll active song when into view
 * 10. Play song when click
 *
 */
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = "Tien_Player";

const heading = $("header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");

const cd = $(".cd");

const playBtn = $(".btn-toggle-play");
const player = $(".player");

const progress = $("#progress");

const nextBtn = $(".btn-next");
const prevBtn = $(".btn-prev");

const randomBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");

const playList = $(".playlist");

const volumeIcon = $(".volume-icon");
const volumeBar = $(".volume-bar");
const volumeSub = $(".volume-bar__process");

const timeCur = $(".time-current");
const timeDur = $(".time-duration");


const app = {
  volumeStates: ["fa-volume-xmark", "fa-volume-low", "fa-volume-high"],
  currentVolume: 1,
  currentIndex: 0,
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
  config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
  setConfig: function (key, value) {
    this.config[key] = value;
    localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
  },
  songs: [
    {
      name: "Butter Cup",
      singer: "Con chồn",
      path: "./assets/music/buttercup.mp3",
      image: "./assets/img/camap.jpg",
    },
    {
      name: "Lão Ái Xử Trảm",
      singer: "Cao Tùng Anh",
      path: "./assets/music/laoaixutram.mp3",
      image: "./assets/img/caotunganh.jpg",
    },
    {
      name: "I love you more than I can say",
      singer: "Con chồn",
      path: "./assets/music/iloveyoumorethanicansay.mp3",
      image: "./assets/img/ngaingung.jpg",
    },
    {
      name: "Người âm phủ",
      singer: "OSAD x VRT",
      path: "./assets/music/nguoiamphu.mp3",
      image: "./assets/img/OSAD.jpg",
    },
    {
      name: "Kết Duyên",
      singer: "YuniBoo x Goctoi Mixer",
      path: "./assets/music/ketduyen.mp3",
      image: "./assets/img/hehe.jpg",
    },

    {
      name: "Buông đôi tay nhau ra - Cover",
      singer: "Vanh Leg",
      path: "./assets/music/buongdoitaynhaura.mp3",
      image: "./assets/img/img_vanhleg.jpg",
    },

    {
      name: "Tránh Duyên",
      singer: "Đình Dũng",
      path: "./assets/music/tranhduyen.mp3",
      image: "./assets/img/dinhdung.jpg",
    },
    {
      name: "Một Triệu Khả Năng",
      singer: "Htrol Remix",
      path: "./assets/music/mottrieukhanang.mp3",
      image: "./assets/img/cuu.jpg",
    },
    {
      name: "Đời anh xe ôm",
      singer: "Vanh Leg",
      path: "./assets/music/doianhxeom.mp3",
      image: "./assets/img/img_vanhleg.jpg",
    },
    {
      name: "Phai Dấu Cuộc Tình",
      singer: "Htrol Remix",
      path: "./assets/music/phaidaucuoctinh.mp3",
      image: "./assets/img/cat1.jpg",
    },
    {
      name: "Kém Duyên",
      singer: "RUM X NIT X DANGLING",
      path: "./assets/music/kemduyen.mp3",
      image: "./assets/img/kemduyen.jpg",
    },
    {
      name: "Động thăng thiên",
      singer: "Vanh Leg",
      path: "./assets/music/dongthangthien.mp3",
      image: "./assets/img/img_vanhleg.jpg",
    },
    {
      name: "Bán Duyên",
      singer: "Đình Dũng",
      path: "./assets/music/banduyen.mp3",
      image: "./assets/img/dinhdung.jpg",
    },
    {
      name: "Ánh Trăng Nói Hộ Lòng Tôi",
      singer: "Htrol Remix",
      path: "./assets/music/anhtrangnoiholongtoi.mp3",
      image: "./assets/img/cuu.jpg",
    },
    {
      name: "Quên Người Đã Quá Yêu",
      singer: "Hà Duy Thái",
      path: "./assets/music/quennguoidaquayeu.mp3",
      image: "./assets/img/haduythai.jpg",
    },
    {
      name: "Đếm Ngày Xa Em",
      singer: "Chu Duyên",
      path: "./assets/music/demngayxaem.mp3",
      image: "./assets/img/cuu.jpg",
    },
  ],
  render: function () {
    const htmls = this.songs.map((song, index) => {
      return `
                <div class="song ${
                  index === this.currentIndex ? "active" : ""
                }" data-index=${index}>
                    <div class="thumb" style="background-image: url('${
                      song.image
                    }')"></div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
                    `;
    });
    playList.innerHTML = htmls.join("");
  },
  loadConfig: function () {
    this.isRandom = this.config.isRandom;
    this.isRepeat = this.config.isRepeat;
  },
  defineProperties: function () {
    Object.defineProperty(this, "currentSong", {
      get: function () {
        return this.songs[this.currentIndex];
      },
    });
  },
  handleEvents: function () {
    const _this = this;
    const cdWidth = cd.offsetWidth;

    // Xử lý CD quay/dừng
    const cdThumbAnimate = cdThumb.animate(
      [
        // cdThumb.animate return 1 đối tượng animate
        { transform: "rotate(360deg)" },
      ],
      {
        duration: 20000, // tốc độ quay
        iterations: Infinity,
      }
    );
    cdThumbAnimate.pause();

    // xử lý phóng to / thu nhỏ CD
    document.onscroll = function () {
      const scrollTop = window.scrollY || document.documentElement.scrollTop; // lấy ra px của cửa sổ trình duyệt
      const newCdWidth = cdWidth - scrollTop;
      cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
      cd.style.opacity = newCdWidth / cdWidth;
    };

    // Tính toán thời gian trước khi bài hát bắt đầu
    audio.onloadedmetadata = function () {
      timeCur.textContent = _this.timeFormatter(this.currentTime);
      timeDur.textContent = _this.timeFormatter(this.duration);
    };

    // Xử lý khi Click Play
    playBtn.onclick = function () {
      if (_this.isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
    };

    // Khi bài hát được Play -  Xử lý lắng nghe event audio
    audio.onplay = function () {
      _this.isPlaying = true;
      player.classList.add("playing");
      cdThumbAnimate.play();
    };

    // Khi bài hát bị Pause - Xử lý lắng nghe event audio
    audio.onpause = function () {
      _this.isPlaying = false;
      player.classList.remove("playing");
      cdThumbAnimate.pause();
    };

    // Khi tiến độ bài hát thay đổi
    audio.ontimeupdate = function () {
      if (audio.currentTime) {
        const progressPercent = Math.floor(
          (audio.currentTime / audio.duration) * 100
        );
        progress.value = progressPercent;
        timeCur.textContent = _this.timeFormatter(this.currentTime);
      }
    };

    // Khi tua bài hát
    progress.onchange = function (e) {
      const seekTime = (e.target.value * audio.duration) / 100;
      audio.currentTime = seekTime;
    };

    // Khi bấm next bài hát
    nextBtn.onclick = function () {
      if (_this.isRandom) {
        _this.playRandomSong();
      } else {
        _this.nextSong();
      }
      audio.play();
      _this.render();
      _this.scrollToActiveSong();
    };

    // Khi bấm prev bài hát
    prevBtn.onclick = function () {
      if (_this.isRandom) {
        _this.playRandomSong();
      } else {
        _this.prevSong();
      }
      audio.play();
      _this.render();
      _this.scrollToActiveSong();
    };

    // Khi bấm nút random
    randomBtn.onclick = function (e) {
      _this.isRandom = !_this.isRandom;
      _this.setConfig("isRandom", _this.isRandom);
      randomBtn.classList.toggle("active", _this.isRandom);
    };

    // Xử lý khi audio kết thúc
    audio.onended = function () {
      if (_this.isRepeat) {
        audio.play();
      } else {
        nextBtn.click();
      }
    };

    // Xử lý khi repeat  1 bài hát
    repeatBtn.onclick = function (e) {
      _this.isRepeat = !_this.isRepeat;
      _this.setConfig("isRepeat", _this.isRepeat);
      repeatBtn.classList.toggle("active", _this.isRepeat);
    };

    // Lắng nghe hành vi Click vào playlist
    playList.onclick = function (e) {
      const songNode = e.target.closest(".song:not(.active)");
      if (songNode || e.target.closest(".option")) {
        // Trừ thằng song đang active

        // Xử lý khi Click vào songs
        if (songNode) {
          console.log(typeof songNode.dataset.index); // hoặc có thể dùng getAttribute('data-index')
          _this.currentIndex = Number(songNode.dataset.index); // Convert sang kiểu Number
          _this.loadCurrentSong();
          audio.play();
          _this.render();
        }

        // Xử lý khi Click vào option
        if (e.target.closest(".option")) {
        }
      }
    };

    // Điều chỉnh âm lượng volume
    volumeBar.onmousedown = function (e) {
      if (e.offsetX <= this.offsetWidth && e.offsetX >= 0) {
        const seekVolume = e.offsetX / this.offsetWidth;
        audio.volume = seekVolume;
        _this.isHoldVolume = true;
        volumeSub.style.width = seekVolume * this.offsetWidth + "px";
      }
    };

    // Thay đổi icon volume
    audio.onvolumechange = function (e) {
      if (this.muted) {
        _this.currentVolume = 0;
      } else {
        if (this.volume <= 0) {
          _this.currentVolume = 0;
        } else if (this.volume > 0.5) {
          _this.currentVolume = 2;
        } else {
          _this.currentVolume = 1;
        }
      }
      volumeIcon.innerHTML = `<i i class="fa-solid ${
        _this.volumeStates[_this.currentVolume]
      }" ></i > `;
    };

    // Click để tắt tiếng
    volumeIcon.onclick = function (e) {
      audio.muted = !audio.muted;
      if (audio.muted) {
        volumeSub.style.width = 0;
      } else {
        volumeSub.style.width = audio.volume * volumeBar.offsetWidth + "px";
      }
    };
  },
  loadCurrentSong: function () {
    heading.textContent = this.currentSong.name;
    cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
    audio.src = this.currentSong.path;
  },
  nextSong: function () {
    this.currentIndex++;
    if (this.currentIndex >= this.songs.length) {
      this.currentIndex = 0;
    }
    this.loadCurrentSong();
  },
  prevSong: function () {
    this.currentIndex--;
    if (this.currentIndex < 0) {
      this.currentIndex = this.songs.length - 1;
    }
    this.loadCurrentSong();
  },
  playRandomSong: function () {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * this.songs.length); // Làm tròn dưới không vượt quá số phần tử của songs
    } while (newIndex === this.currentIndex);

    this.currentIndex = newIndex;
    this.loadCurrentSong();
  },

  // Khởi tạo âm lượng mặc định
  initialVolume: function () {
    const defaultVolume = 0.2;
    audio.volume = defaultVolume;
    const volumeWidth = volumeBar.offsetWidth;
    volumeSub.style.width = volumeWidth * defaultVolume + "px";
  },

  // Time Format
  timeFormatter: function (timeElement) {
    const timeFloored = Math.floor(timeElement);
    const min = Math.floor(timeFloored / 60);
    const sec = timeFloored % 60;
    return `${min >= 10 ? min + "" : "0" + min}:${
      sec >= 10 ? sec + "" : "0" + sec
    } `;
  },
  scrollToActiveSong: function () {
    setTimeout(() => {
      $(".song.active").scrollIntoView({
        // Khi bị khuất màn hình thì sẽ đẩy lên cho nó chui vào trong DOM
        behavior: "smooth",
        block: "nearest",
      });
    }, 300);
  },

  start: function () {
    // Gán cấu hình từ Config vào object app
    this.loadConfig();

    // Định nghĩa các thuộc tính cho Object
    this.defineProperties();

    // Lắng nghe xử lý các sự kiện
    this.handleEvents();

    // Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
    this.loadCurrentSong();

    // Khởi tạo mức âm lượng mặc định
    this.initialVolume();

    // Render ra danh sách bài hát playlist
    this.render();

    // Hiển thị trạng thái ban đầu của button Repeat và Random
    randomBtn.classList.toggle("active", this.isRandom);
    repeatBtn.classList.toggle("active", this.isRepeat);
  },
};

app.start();
