let isEnabled = true;

function scrubAd() {
  const videoPlayer = document.querySelector("video");
  while (!videoPlayer.paused) {
    videoPlayer.currentTime = videoPlayer.duration;
    videoPlayer.pause();
  }
  chrome.storage.sync.get({ adsSkipped: 0, timeSaved: 0 }, function (data) {
    chrome.storage.sync.set({
      adsSkipped: data.adsSkipped + 1,
      timeSaved: data.timeSaved + videoPlayer.duration,
    });
  });
}

function handleMutation(mutations) {
  if (!isEnabled) return;
  for (const mutation of mutations) {
    if (mutation.type === "attributes" && mutation.attributeName === "class") {
      const targetElement = mutation.target;
      if (targetElement.classList.contains("ad-showing")) {
        scrubAd();
      }
    }
    const skipButton1 = document.querySelector("#skip-button\\:5 button");
    const skipButton2 = document.querySelector("#skip-button\\:6 button");
    const skipButton3 = document.querySelector("#skip-button\\:q button");

    if (skipButton1 && skipButton1.offsetParent !== null) {
      skipButton1.click();
    } else if (skipButton2 && skipButton2.offsetParent !== null) {
      skipButton2.click();
    } else if (skipButton3 && skipButton3.offsetParent !== null) {
      skipButton3.click();
    }
  }
}

function startObserving() {
  const targetNode = document.getElementById("movie_player");
  if (targetNode) {
    const config = { attributes: true, childList: true, subtree: true };
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
