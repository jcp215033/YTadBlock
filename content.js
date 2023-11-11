let isEnabled = true;
let videoPlayer = null;
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
          break;
        }
      }

      const skipButtons = Array.from(document.querySelectorAll("[id]")).filter(
        (el) => el.id.startsWith("skip-button:")
      );

      for (const button of skipButtons) {
        if (button.offsetParent !== null) {
          button.click();
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
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", startObserving);
  } else {
    startObserving();
  }
});

setInterval(updateStorage, 60000);
window.addEventListener("unload", updateStorage);
