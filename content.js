let isEnabled = true;
let videoPlayer = null;
let adModule = null;
let adData = { adsSkipped: 0, timeSaved: 0 };

function initializeData() {
  chrome.storage.sync.get("adData", function (data) {
    if (data.adData) adData = data.adData;
  });
}

function scrubAd() {
  if (!videoPlayer) {
    videoPlayer = document.querySelector("video");
  }
  if (videoPlayer && !videoPlayer.paused) {
    videoPlayer.currentTime = videoPlayer.duration;
    adData.adsSkipped++;
    adData.timeSaved += videoPlayer.duration;
    chrome.storage.sync.set({ adData: adData });
  }
}

function skipAd() {
  adModule = document.querySelector(".video-ads.ytp-ad-module");
  if (adModule && adModule.children.length > 0) {
    const skipButton = adModule.querySelector(
      ".ytp-ad-skip-button-modern.ytp-button"
    );
    if (skipButton) skipButton.click();
  }
}

function handleMutation(mutations) {
  if (!isEnabled) return;
  window.requestAnimationFrame(() => {
    for (const mutation of mutations) {
      if (
        mutation.type === "attributes" &&
        mutation.attributeName === "class"
      ) {
        const targetElement = mutation.target;
        if (targetElement.classList.contains("ad-showing")) {
          scrubAd();
          skipAd();
          break;
        }
      }
    }
  });
}

function startObserving() {
  const targetNode = document.getElementById("movie_player");
  if (targetNode) {
    const config = { attributes: true, childList: false, subtree: true };
    const observer = new MutationObserver(handleMutation);
    observer.observe(targetNode, config);
  } else {
    console.error("Target node movie_player not found");
  }
}

chrome.storage.sync.get("enabled", function (data) {
  isEnabled = data.enabled !== false;
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      startObserving();
      initializeData();
    });
  } else {
    startObserving();
    initializeData();
  }
});
