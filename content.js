let isEnabled = true;
let videoPlayer = null;
let adModule = null;
let adData = { adsSkipped: 0, timeSaved: 0 };

function scrubAd() {
  if (!videoPlayer) {
    videoPlayer = document.querySelector("video");
  }
  if (videoPlayer && !videoPlayer.paused) {
    videoPlayer.currentTime = videoPlayer.duration;
    videoPlayer.pause();
    adData.adsSkipped++;
    adData.timeSaved += videoPlayer.duration;
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

function updateStorage() {
  chrome.storage.sync.set(adData);
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
          updateStorage();
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
    console.error("Target node not found");
  }
}

chrome.storage.sync.get("enabled", function (data) {
  isEnabled = data.enabled !== false;
  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", startObserving);
  else startObserving();
});

// setInterval(updateStorage, 60000);
// window.addEventListener("unload", updateStorage);
