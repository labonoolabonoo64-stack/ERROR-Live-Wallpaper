const { app, BrowserWindow, screen, ipcMain } = require("electron");
const { execFile } = require("child_process");
const path = require("path");

app.commandLine.appendSwitch("autoplay-policy", "no-user-gesture-required");
app.commandLine.appendSwitch("disable-features", "HardwareMediaKeyHandling");

let win;

function workerScript() {
  return path.join(__dirname, "wallpaper.ps1");
}

function makeWallpaper() {
  const display = screen.getPrimaryDisplay();
  const { width, height } = display.bounds;
  win = new BrowserWindow({
    x: 0, y: 0, width, height,
    frame: false,
    transparent: false,
    resizable: false,
    movable: false,
    fullscreen: false,
    skipTaskbar: true,
    focusable: false,
    show: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      backgroundThrottling: false
    }
  });
  win.setMenuBarVisibility(false);
  win.loadFile("index.html");
  win.once("ready-to-show", () => {
    win.showInactive();
    win.setAlwaysOnBottom(true);
    // Move the Electron window behind desktop icons.
    execFile("powershell.exe", ["-NoProfile","-ExecutionPolicy","Bypass","-File",workerScript(), String(win.getNativeWindowHandle().readInt32LE(0))], {windowsHide:true});
  });
  win.on("closed", () => win = null);
}

app.whenReady().then(makeWallpaper);

app.on("window-all-closed", (e) => e.preventDefault());
app.on("before-quit", () => {
  if (win) win.destroy();
});

ipcMain.on("quit-app", () => app.quit());
