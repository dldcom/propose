const PAGE_TEXT = {
  2: [{ text: "나는 2022년에 운명 같은 한 사람을 만났어", x: 10, y: 9.5, w: 80, size: 3.55 }],
  3: [{ text: "처음 만난 날에는 사진 찍는 것도 어색해 했었지만", x: 8, y: 83.5, w: 86, size: 3.4 }],
  4: [{ text: "하나 둘 추억을 쌓아가며", x: 23, y: 25, w: 54, size: 3.9 }],
  5: [{ text: "점점 더 가까워졌지", x: 55, y: 32.5, w: 34, size: 3.75, nowrap: true }],
  6: [{ text: "제주도에서\n동물과 놀았던 시간은", x: 24, y: 2.5, w: 52, size: 3.7 }],
  7: [{ text: "아직까지 잊을 수 없는 기억이고", x: 10, y: 7.5, w: 80, size: 3.55 }],
  8: [{ text: "너와 갔던 다른 여행들도", x: 25, y: 10.5, w: 50, size: 3.75 }],
  9: [{ text: "별 다른 계획 없이도", x: 28, y: 13.5, w: 44, size: 3.8 }],
  10: [{ text: "행복한 시간이었지", x: 30, y: 13.5, w: 40, size: 3.8 }],
  11: [{ text: "맛있는 음식을 먹으며 좋아하는 너를 보면", x: 10, y: 9.5, w: 84, size: 3.55 }],
  12: [{ text: "나도 덩달아 기분이 좋아졌어", x: 17, y: 17.5, w: 66, size: 3.65 }],
  13: [{ text: "힘들었던 연수도", x: 30, y: 15, w: 40, size: 3.8 }],
  14: [{ text: "우울했던 시기도 있었지만", x: 20, y: 14.5, w: 56, size: 3.65 }],
  15: [{ text: "함께여서 이겨낼 수 있었지", x: 27, y: 11, w: 60, size: 3.65 }],
  16: [{ text: "너와 만나고 꽃들은", x: 30, y: 8, w: 44, size: 3.75 }],
  17: [{ text: "3번이나 피고 졌지만", x: 29, y: 9.5, w: 46, size: 3.7 }],
  18: [{ text: "너는 변함없이 꽃처럼 예뻤지", x: 17, y: 9.5, w: 62, size: 3.65 }],
  19: [{ text: "사소한 것에 웃고 행복했던 시간도", x: 17, y: 8.5, w: 70, size: 3.55 }],
  20: [{ text: "이제는 다시 경험하지 못할\n학교에서의 시간도", x: 16, y: 6.5, w: 68, size: 3.55 }],
  21: [{ text: "많은 기억으로 남아있지만", x: 15, y: 7.5, w: 64, size: 3.65 }],
  22: [{ text: "그 중에서도 내가\n가장 오래 기억하고 싶은 건", x: 18, y: 12, w: 60, size: 3.6 }],
  23: [{ text: "너의 웃는 모습이야", x: 30, y: 38, w: 40, size: 3.9 }],
  24: [{ text: "너가 웃으면", x: 35, y: 32, w: 30, size: 4.05 }],
  25: [{ text: "내 세상까지 환해지는 것 같거든", x: 15, y: 12, w: 68, size: 3.65 }],
  26: [
    { text: "나는 그 웃음을 앞으로도 오래", x: 18, y: 6, w: 64, size: 3.55, duration: 2400 },
    { text: "아니 평생 곁에서 보고싶어.", x: 18, y: 17, w: 64, size: 3.55, duration: 2400 }
  ]
};
const BOUQUET_MEMORIES = [
  { asset: 5, x: 9, y: 20, w: 30, h: 52, r: -8 },
  { asset: 7, x: 31, y: 5, w: 30, h: 55, r: 0 },
  { asset: 6, x: 49, y: 22, w: 27, h: 50, r: 6 },
  { asset: 3, x: 59, y: 28, w: 27, h: 43, r: 9 }
];

const app = document.querySelector("#app");
const pages = [...document.querySelectorAll(".page")];
const introPage = document.querySelector("#introPage");
const storyPage = document.querySelector("#storyPage");
const bouquetPage = document.querySelector("#bouquetPage");
const confessionPage = document.querySelector("#confessionPage");
const letterPage = document.querySelector("#letterPage");
const startButton = document.querySelector("#startButton");
const assetStage = document.querySelector("#assetStage");
const textStage = document.querySelector("#textStage");
const petals = document.querySelector("#petals");
const bouquet = document.querySelector("#bouquet");
const bouquetText = document.querySelector("#bouquetText");
const confessionLine = document.querySelector("#confessionLine");
const introMusic = document.querySelector("#introMusic");
const backgroundMusic = document.querySelector("#backgroundMusic");
const letterMusic = document.querySelector("#letterMusic");
const setupMusicButton = document.querySelector("#setupMusicButton");
const fullscreenButton = document.querySelector("#fullscreenButton");

let currentPage = 1;
let typingToken = 0;
let autoAdvanceTimer = null;
let letterFadeTimer = null;
const audioFadeFrames = new Map();
const imagePreloads = new Map();
const queryParams = new URLSearchParams(location.search);
const instantPreview = queryParams.get("instant") === "1";
const videoMode = queryParams.get("video") === "1";
if (instantPreview) document.documentElement.classList.add("instant-preview");
if (videoMode) document.documentElement.classList.add("video-mode");
if (Number(new URLSearchParams(location.search).get("page")) > 1) document.documentElement.classList.add("direct-preview");

const wait = (ms) => new Promise((resolve) => window.setTimeout(resolve, ms));

const MUSIC_BPM = 58;
const MUSIC_BEAT = 60 / MUSIC_BPM;
const MUSIC_PAGE_BEATS = 5;
const MUSIC_PAGE_STEP = MUSIC_BEAT * MUSIC_PAGE_BEATS;
const SCENE_SWITCH_DELAY = 1300;
const FINAL_PAGE_WAIT = 6;
// The stage now fully fades out before its contents are replaced. 1.25 + 1.3 keeps the
// first visual arrival near the track's strong half-time pulse at 2.55 s.
const MUSIC_FIRST_CUE = 1.25;
const MUSIC_PAGE_CUES = (() => {
  const cues = {};
  let cue = MUSIC_FIRST_CUE;
  for (let page = 2; page <= 27; page += 1) {
    cues[page] = cue;
    if (page <= 26) cue += page === 26 ? FINAL_PAGE_WAIT : MUSIC_PAGE_STEP;
  }
  return cues;
})();

function musicIsPlaying() {
  return !backgroundMusic.paused && !backgroundMusic.ended;
}

function fadeAudioTo(audio, targetVolume, duration = 1200, pauseWhenSilent = false) {
  window.cancelAnimationFrame(audioFadeFrames.get(audio));
  const startVolume = audio.volume;
  const startedAt = performance.now();
  const tick = (now) => {
    const progress = Math.min(1, (now - startedAt) / duration);
    const eased = 1 - Math.pow(1 - progress, 3);
    audio.volume = startVolume + (targetVolume - startVolume) * eased;
    if (progress < 1) {
      audioFadeFrames.set(audio, window.requestAnimationFrame(tick));
    } else {
      audioFadeFrames.delete(audio);
      if (pauseWhenSilent && targetVolume === 0) audio.pause();
    }
  };
  audioFadeFrames.set(audio, window.requestAnimationFrame(tick));
}

function startIntroMusic() {
  introMusic.currentTime = 0;
  introMusic.volume = 0;
  introMusic.play().then(() => fadeAudioTo(introMusic, 0.35, 3100)).catch(() => {});
  setupMusicButton.classList.add("is-started");
}

async function toggleFullscreen() {
  const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement;
  try {
    if (fullscreenElement) {
      const exitFullscreen = document.exitFullscreen || document.webkitExitFullscreen;
      if (exitFullscreen) await exitFullscreen.call(document);
      return;
    }
    const requestFullscreen = document.documentElement.requestFullscreen || document.documentElement.webkitRequestFullscreen;
    if (!requestFullscreen) return;
    await requestFullscreen.call(document.documentElement);
    if (screen.orientation?.lock) screen.orientation.lock("landscape").catch(() => {});
  } catch (_) {}
}

function updateFullscreenButton() {
  const isFullscreen = Boolean(document.fullscreenElement || document.webkitFullscreenElement);
  fullscreenButton.textContent = isFullscreen ? "⛶ 전체화면 종료" : "⛶ 전체화면";
  fullscreenButton.setAttribute("aria-label", isFullscreen ? "전체화면 종료" : "전체화면으로 보기");
}

function startBackgroundMusic() {
  fadeAudioTo(introMusic, 0, 2500, true);
  // Start early enough that page 2 arrives on the track's first strong cue.
  backgroundMusic.currentTime = Math.max(0, MUSIC_FIRST_CUE - 0.53);
  backgroundMusic.volume = 0;
  backgroundMusic.play().then(() => fadeAudioTo(backgroundMusic, 0.35, 4140)).catch(() => {});
  letterMusic.volume = 0;
  letterMusic.currentTime = 0;
  letterMusic.play().then(() => {
    letterMusic.pause();
    letterMusic.currentTime = 0;
  }).catch(() => {});
}

function startLetterMusic() {
  window.clearTimeout(letterFadeTimer);
  fadeAudioTo(backgroundMusic, 0, 5170, true);
  letterMusic.currentTime = 0;
  letterMusic.volume = 0;
  letterMusic.play().then(() => {
    fadeAudioTo(letterMusic, 0.35, 5000);
    letterFadeTimer = window.setTimeout(() => fadeAudioTo(letterMusic, 0, 10000, true), 120000);
  }).catch(() => {});
}

function activatePage(element) {
  pages.forEach((page) => page.classList.toggle("is-active", page === element));
  app.classList.toggle("is-letter-reading", element === letterPage);
}

async function typeText(element, text, duration = 3200) {
  element.classList.remove("is-complete");
  element.textContent = text;
  void element.offsetWidth;
  element.classList.add("is-complete");
  await wait(instantPreview ? 0 : duration);
}

function makeTextBlock(block) {
  const element = document.createElement("p");
  element.className = `text-block${block.nowrap ? " is-nowrap" : ""}`;
  element.style.setProperty("--tx", `${block.x}%`);
  element.style.setProperty("--ty", `${block.y}%`);
  element.style.setProperty("--tw", `${block.w}%`);
  element.style.setProperty("--align", block.align || "center");
  element.style.setProperty("--ts", `${block.size || 3.5}vw`);
  element.style.setProperty("--text-fade-duration", `${block.duration || 3200}ms`);
  return element;
}

async function renderTextBlocks(container, blocks) {
  container.replaceChildren();
  for (const block of blocks) {
    const element = makeTextBlock(block);
    container.append(element);
    await typeText(element, block.text, block.duration || 3200);
    element.classList.add("is-complete");
  }
}

function createSceneAsset(asset, index) {
  const wrapper = document.createElement("div");
  const motion = document.createElement("div");
  const image = document.createElement("img");
  wrapper.className = `scene-asset ${asset.cutout ? "cutout" : "photo"}${asset.still ? " still" : ""}${asset.role ? ` ${asset.role}` : ""}`;
  wrapper.style.setProperty("--x", `${asset.x}%`);
  wrapper.style.setProperty("--y", `${asset.y}%`);
  wrapper.style.setProperty("--w", `${asset.w}%`);
  wrapper.style.setProperty("--h", `${asset.h}%`);
  wrapper.style.setProperty("--rotation", `${asset.r}deg`);
  wrapper.style.setProperty("--z", String(index + 2));
  wrapper.style.setProperty("--delay", `${Math.min(index * 0.11, 1.1)}s`);
  wrapper.style.setProperty("--drift-x", `${[-1.1, .8, -.6, 1.2, -.9][index % 5]}%`);
  wrapper.style.setProperty("--drift-y", `${[-1.3, -.7, -1.7, -.9][index % 4]}%`);
  wrapper.style.setProperty("--drift-rotation", `${[-.7, .55, -.35, .8][index % 4]}deg`);
  wrapper.style.setProperty("--drift-duration", `${4.8 + (index % 5) * .65}s`);
  image.src = `./assets_real_web/${asset.src}`;
  image.alt = "함께한 추억 사진";
  // Synchronous decoding can pause the main thread while many transparent
  // cutouts are inserted, which makes real-time video capture miss frames.
  image.decoding = "async";
  image.loading = "eager";
  motion.className = "asset-motion";
  motion.append(image);
  wrapper.append(motion);
  return wrapper;
}

function renderPetals() {
  petals.replaceChildren();
  for (let index = 0; index < 16; index += 1) {
    const petal = document.createElement("i");
    petal.style.setProperty("--left", `${4 + Math.random() * 92}%`);
    petal.style.setProperty("--delay", `${-Math.random() * 8}s`);
    petal.style.setProperty("--duration", `${6 + Math.random() * 5}s`);
    petals.append(petal);
  }
}

function preloadImage(source) {
  const existing = imagePreloads.get(source);
  if (existing) return existing;
  const image = new Image();
  image.decoding = "async";
  image.loading = "eager";
  image.src = `./assets_real_web/${source}`;
  const promise = typeof image.decode === "function"
    ? image.decode().catch(() => {})
    : new Promise((resolve) => {
        if (image.complete) resolve();
        else image.addEventListener("load", resolve, { once: true });
        image.addEventListener("error", resolve, { once: true });
      });
  imagePreloads.set(source, promise);
  return promise;
}

function preloadPage(pageNumber) {
  const layout = window.REAL_STORY_LAYOUT?.[String(pageNumber)] || [];
  if (pageNumber >= 2 && pageNumber <= 26) {
    return Promise.all(layout.map((asset) => preloadImage(asset.src)));
  }
  if (pageNumber === 16) {
    const sources = ["꽃다발아래.webp", "꽃다발위.webp", ...Array.from({ length: 10 }, (_, index) => `페이지14_${index + 1}.webp`)];
    return Promise.all(sources.map(preloadImage));
  }
  return Promise.resolve();
}

async function renderStoryPage(pageNumber) {
  const token = typingToken;
  const assetsReady = preloadPage(pageNumber);
  activatePage(storyPage);
  assetStage.classList.add("is-switching");
  textStage.classList.add("is-switching");
  petals.replaceChildren();
  await Promise.all([
    wait(instantPreview ? 0 : SCENE_SWITCH_DELAY),
    assetsReady
  ]);
  if (token !== typingToken) return;

  assetStage.replaceChildren();
  textStage.replaceChildren();
  const layout = window.REAL_STORY_LAYOUT?.[String(pageNumber)] || [];
  let bouquetMemoryGroup = null;
  layout.forEach((asset, index) => {
    const element = createSceneAsset(asset, index);
    if (pageNumber === 25 && asset.role?.includes("bouquet-memory")) {
      if (!bouquetMemoryGroup) {
        bouquetMemoryGroup = document.createElement("div");
        bouquetMemoryGroup.className = "bouquet-memory-group";
        assetStage.append(bouquetMemoryGroup);
      }
      bouquetMemoryGroup.append(element);
      return;
    }
    assetStage.append(element);
  });
  if (pageNumber === 25 && token === typingToken) {
    window.requestAnimationFrame(() => app.classList.add("is-light-reveal"));
  }
  assetStage.classList.remove("is-switching");
  preloadPage(pageNumber + 1);
  textStage.classList.remove("is-switching");
  await renderTextBlocks(textStage, PAGE_TEXT[pageNumber]);
  if (token === typingToken) {
    scheduleAutoAdvance(pageNumber);
  }
}

function createBouquetLayer(source, className) {
  const image = document.createElement("img");
  image.className = `bouquet-layer ${className}`;
  image.src = `./assets_real_web/${source}`;
  image.alt = "";
  return image;
}

async function renderBouquetPage() {
  activatePage(bouquetPage);
  bouquet.replaceChildren();
  bouquetText.replaceChildren();
  bouquet.append(createBouquetLayer("꽃다발아래.webp", "bouquet-bottom"));
  BOUQUET_MEMORIES.forEach((position, index) => {
    const image = createBouquetLayer(`페이지14_${position.asset}.webp`, "bouquet-person");
    image.style.setProperty("--bx", `${position.x}%`);
    image.style.setProperty("--by", `${position.y}%`);
    image.style.setProperty("--bw", `${position.w}%`);
    image.style.setProperty("--bh", `${position.h}%`);
    image.style.setProperty("--z", String(index + 5));
    image.style.setProperty("--delay", `${0.28 + index * 0.09}s`);
    image.style.setProperty("--br", `${position.r}deg`);
    bouquet.append(image);
  });
  bouquet.append(createBouquetLayer("꽃다발위.webp", "bouquet-top"));
  preloadPage(17);
  await renderTextBlocks(bouquetText, PAGE_TEXT[16]);
  scheduleAutoAdvance(6000);
}

async function renderConfessionPage() {
  activatePage(confessionPage);
  confessionLine.classList.add("is-typing");
  await typeText(confessionLine, "그래서 오늘 내 마음을 전해보려고 해", 3200);
  confessionLine.classList.remove("is-typing");
  scheduleAutoAdvance(5200);
}

async function renderLetterPage() {
  const scheduledPage = currentPage;
  await wait(instantPreview ? 0 : 620);
  if (currentPage !== scheduledPage || scheduledPage !== 27) return;
  activatePage(letterPage);
  startLetterMusic();
  if (videoMode) {
    window.setTimeout(() => {
      document.documentElement.dataset.videoDone = "true";
    }, 10000);
  }
}

function pageDuration(pageNumber) {
  if (pageNumber === 26) return FINAL_PAGE_WAIT * 1000;
  return pageNumber >= 2 && pageNumber < 26 ? MUSIC_PAGE_STEP * 1000 : 5200;
}

function scheduleAutoAdvance(pageNumber) {
  if (instantPreview || currentPage < 2 || currentPage >= 27) return;
  window.clearTimeout(autoAdvanceTimer);
  const scheduledPage = currentPage;
  let delay = pageDuration(pageNumber);
  const nextCue = MUSIC_PAGE_CUES[pageNumber + 1];
  if (musicIsPlaying() && nextCue) {
    const now = backgroundMusic.currentTime;
    let targetCue = nextCue;
    if (targetCue <= now + 0.35) {
      targetCue = MUSIC_FIRST_CUE + Math.ceil((now + 1.4 - MUSIC_FIRST_CUE) / MUSIC_PAGE_STEP) * MUSIC_PAGE_STEP;
    }
    delay = Math.max(350, (targetCue - now) * 1000);
  }
  autoAdvanceTimer = window.setTimeout(() => {
    if (currentPage === scheduledPage) renderPage(currentPage + 1);
  }, delay);
}

function renderPage(pageNumber) {
  window.clearTimeout(autoAdvanceTimer);
  app.classList.remove("is-light-reveal");
  typingToken += 1;
  currentPage = Math.max(1, Math.min(27, pageNumber));
  if (currentPage > 1) {
    setupMusicButton.classList.add("is-started");
    fullscreenButton.classList.add("is-hidden");
  }
  if (currentPage === 25 && musicIsPlaying()) fadeAudioTo(backgroundMusic, 0.42, 2070);
  if (currentPage === 27 && musicIsPlaying()) fadeAudioTo(backgroundMusic, 0.35, 1035);
  if (currentPage === 1) {
    activatePage(introPage);
    return;
  }
  if (currentPage >= 2 && currentPage <= 26) {
    renderStoryPage(currentPage);
    return;
  }
  if (currentPage === 27) {
    renderLetterPage();
    return;
  }
}

let storyStarted = false;

async function beginStory() {
  if (storyStarted) return;
  storyStarted = true;
  startButton.disabled = true;
  setupMusicButton.classList.add("is-started");
  fullscreenButton.classList.add("is-hidden");
  preloadPage(2);
  startBackgroundMusic();
  introPage.classList.add("is-fading-out");
  await wait(530);
  renderPage(2);
}

startButton.addEventListener("click", beginStory);

if (videoMode) {
  setupMusicButton.classList.add("is-started");
  fullscreenButton.classList.add("is-hidden");
  const scheduleVideoStart = () => window.setTimeout(beginStory, 5000);
  if (document.readyState === "complete") scheduleVideoStart();
  else window.addEventListener("load", scheduleVideoStart, { once: true });
}

setupMusicButton.addEventListener("click", startIntroMusic);
fullscreenButton.addEventListener("click", toggleFullscreen);
document.addEventListener("fullscreenchange", updateFullscreenButton);
document.addEventListener("webkitfullscreenchange", updateFullscreenButton);

window.addEventListener("pointermove", (event) => {
  app.style.setProperty("--pointer-x", `${event.clientX / innerWidth * 100}%`);
  app.style.setProperty("--pointer-y", `${event.clientY / innerHeight * 100}%`);
});

const requestedPage = Number(new URLSearchParams(location.search).get("page"));
if (requestedPage >= 1 && requestedPage <= 27) renderPage(requestedPage);
