let isEnabled = true;
let videoPlayer = null;
let adModule = null;
let adData = { adsSkipped: 0, timeSaved: 0 };

function initializeData() {
  chrome.storage.sync.get("adData", function (data) {
    if (data && data.adData) {
      adData = data.adData;
    } else {
      adData = { adsSkipped: 0, timeSaved: 0 };
    }
  });
}

function scrubAd() {
  if (!videoPlayer) {
    videoPlayer = document.querySelector("video");
  }
  if (videoPlayer && !videoPlayer.paused) {
    videoPlayer.style.visibility = "hidden";
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
          videoPlayer.style.visibility = "";
          break;
        }
      }
    }
  });
}

function startObserving() {
  function attemptObserving() {
    const targetNode = document.getElementById("movie_player");

    if (targetNode) {
      const config = { attributes: true, childList: false, subtree: true };
      const observer = new MutationObserver(handleMutation);
      observer.observe(targetNode, config);
    } else {
      console.log("Waiting for target node movie_player...");
      setTimeout(attemptObserving, 100);
    }
  }
  attemptObserving();
}

chrome.storage.sync.get("enabled", function (data) {
  if (data && data.enabled !== undefined) {
    isEnabled = data.enabled;
  } else {
    isEnabled = true;
  }
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
