# GravityRage
1. A YouTube downloader GUI built with pywebview and yt-dlp

![demo image](./assets/demo1.png)

## How To Run
### development mode
- first install frontend packages
  - cd frontend
  - npm i 
- Run development server
  - npm run dev
  - (vite server looks like) &rarr; http://localhost:5173
- Launch App
  - cd backend
  - create virtual environment (use pycharm it automatically creates one for you) ❤️JetBrains
  - install packages
    - pip install -r requirements.txt
  - Run setup.py (if your frontend server is different then replace the url argument in webview.create_window with your frontend server url)
- Upgrading packages
  - pip install yt-dlp -U
- To freeze app using pyinstaller
  - To be updated 

## Known Issues
- [x] ~~Fix a minor bug: downloading two videos with the same ID causes their progress trackers to collide,
this will be addressed in a future release.~~

- [x] ~~if user changes quality then the downloaded video is not the same quality the user chose even if the
video's res is available ie due to init/variable being read during init phase and that being accessed everytime and not the current quality that the user selected!~~

- [ ] sometimes video download just doesn't start you might have to re-try.
  - SABR forcing error
  - formats skipped due to SABR


## Missing Features
- currently you cannot download age restricted videos
  - cookies auth has not been implemented yet

- [x] ~~youtube to mp3~~
- [x] direct app updates
- [ ] youtube tags extractor
- [ ] download thumbnails
- [ ] implement cookies auth (!⚠️ High Priority)
- [ ] add download feature for other platforms too (other than youtube) (!⚠️ High Priority)

![demo image](./assets/demo3.png)

![demo image](./assets/demo5.png)

## Tech stack used
1. Tailwind Css
2. pywebview (python lib)
3. React (vite) + Zustand
4. sqlite
5. yt-dlp (Core of the app)
6.

![demo image](./assets/demo4.png)


## Dev Notes
### ⚠️ 👽👽👽🧨🧨🧨🧨🧨🧨🧨🐦‍🔥 ALWAYS REMEMBER TO UPDATE THE __VERSION__ VARIABLE ELSE UPDATING FEATURE WILL NOT WORK ⚠️
- [x] implement updating feature to app
- [ ]

