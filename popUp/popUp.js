document.addEventListener("DOMContentLoaded", function () {
  const toggle = document.getElementById("toggle-extension");
  const adsSkippedDisplay = document.getElementById("ads-skipped");
  const timeSavedDisplay = document.getElementById("time-saved");

  chrome.storage.sync.get(
    ["enabled", "adsSkipped", "timeSaved"],
    function (data) {
      toggle.checked = data.enabled !== false;
      adsSkippedDisplay.textContent = data.adsSkipped || 0;
      timeSavedDisplay.textContent = formatTime(data.timeSaved || 0);
    }
  );

  toggle.addEventListener("change", function () {
    chrome.storage.sync.set({ enabled: toggle.checked });
    chrome.tabs.query({}, function (tabs) {
      for (let tab of tabs) {
        chrome.tabs.sendMessage(tab.id, { enabled: toggle.checked });
      }
    });
  });
});

function formatTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  seconds %= 3600;
  const minutes = Math.floor(seconds / 60);
  seconds = Math.floor(seconds % 60);

  return `${hours}h ${minutes}m ${seconds}s`;
}
