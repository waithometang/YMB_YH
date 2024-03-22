import { app, BrowserWindow, Menu, ipcMain } from 'electron'

// import DbUtil from '../renderer/DB/DbUtil.js'
// DbUtil.initTables()
/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 900,
    useContentSize: true,
    width: 1400,
    fullscreen: true,
    frame: false,
    show: false,
  })

  Menu.setApplicationMenu(null)

  mainWindow.loadURL(winURL)

  mainWindow.on('ready-to-show', function () {
    mainWindow.show() // 初始化后再显示
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })
  // mainWindow.webContents.openDevTools();  //打开DevTool工具
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

// const ipc = require('electron').ipcMain
const dialog = require('electron').dialog
ipcMain.on('open-file-dialog', function (event,tag) {
  dialog.showOpenDialog({
    properties: ['openFile'],  //'openDirectory'
    title:'请选择导入文件（仅限excel）',
    filters: [
      {name: 'excel', extensions: ['xlsx','xls']}
    ]
  }, function (files) {
    if (files) event.sender.send('selected-file-'+tag, files)
  })
})
ipcMain.on('min', e=> mainWindow.minimize());
ipcMain.on('max', e=> {
    if (mainWindow.isMaximized()) {
        mainWindow.unmaximize()
    } else {
        mainWindow.maximize()
    }
});
ipcMain.on('close', e=> mainWindow.close());
ipcMain.on('fullscreen', function(event){
  let newFullscreen=!mainWindow.isFullScreen()
  mainWindow.setFullScreen(newFullscreen)
  event.sender.send('on-fullscreen', newFullscreen)
})


/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
