# YouTube Ad Scrubber

## Overview

YouTube Ad Scrubber is a Chrome Extension designed to enhance your video watching experience on YouTube by automatically skipping ads in video players. As of 11/11/2023, it has been tested and confirmed to work on Chrome Version 119.0.6045.105. (Works on Opera GX as well, but metrics are not available)

## Features

- **Ad Skipping:** Automatically skips ads when they appear in the video player.
- **Counter Metrics:** Tracks and displays the number of ads skipped and the total time saved.
- **Toggle Functionality:** Easily enable or disable ad skipping directly from the extension popup.

## Installation

Clone the repository:

```bash
  git clone https://github.com/jcp215033/YTadBlock.git
```

Open Chrome and go to `chrome://extensions/`.
Enable Developer Mode by clicking the toggle switch next to "Developer mode".
Click the "Load unpacked" button and select the extension directory.

## Usage

After installation, the extension will automatically start working on YouTube. You can control its functionality using the popup which provides:

- A toggle switch to enable or disable the extension.
- A display showing the total number of ads skipped.
- A display showing the total time saved by skipping ads.

## Epilepsy Warning

This extension works by detecting if an ad is playing, skipping to the end, and clicking the skip button. Due to this method, the screen may flicker or flash when an ad is being skipped, which could potentially trigger photosensitive epilepsy. Please use with caution.

## Testing

You can test the functionality of this ad blocker on these videos:

- [Warriors & Lakers Instant Classic - 2021 Play-In Tournament 🔥| NBA Classic Game](https://www.youtube.com/watch?app=desktop&v=LPDnemFoqVk)
- [Kingdom of the Planet of the Apes - Official Teaser Trailer (2024)](https://www.youtube.com/watch?v=LXvQUfUOcYI)

## Contributing

YouTube Ad Scrubber is still in its early stages. If you encounter any bugs or issues, feel free to email me at juliancastro215033@gmail.com or [open an issue](https://github.com/jcp215033/YTadBlock/issues).

## License

This project is licensed under the [MIT License](LICENSE).

## Disclaimer

This extension is not affiliated with YouTube and is created for educational purposes. Please use responsibly.
