function scrubAd() {
  const videoPlayer = document.querySelector("video");
  while (!videoPlayer.paused) {
    videoPlayer.currentTime = videoPlayer.duration;
    videoPlayer.pause();
  }
}

function handleMutation(mutations) {
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

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", startObserving);
} else {
  startObserving();
}
