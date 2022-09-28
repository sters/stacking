// Modules to control application life and create native browser window
const {app, BrowserWindow, BrowserView} = require('electron')
const path = require('path')

const appViews = [];

function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile('../renderer/index.html')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  mainWindow.on('resize', () => {
    appViews.forEach((view) => {
      resizeAppView(mainWindow, view);
    })
  });

  setupAppView(mainWindow, 'https://electronjs.org');
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed
// // , except on macOS.There, it's common
// // for applications and their menu bar to stay active until the user quits
// // explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

function setupAppView(mainWindow, url) {
  const view = new BrowserView({
    webPreferences: {
      nodeIntegration: false
    }
  });
  appViews.push(view)
  mainWindow.addBrowserView(view);

  resizeAppView(mainWindow, view);
  view.webContents.loadURL(url);
}

function resizeAppView(mainWindow, view) {
  const bound = mainWindow.getBounds();
  view.setBounds({ x: 50, y: 1, width: bound.width - 50, height: bound.height });
}
