const electron = require('electron');
const path = require('path');
const app = electron.app;
const proto = electron.protocol;
const BrowserWindow = electron.BrowserWindow;

// Our internal protocol
const protocol = "tox";

// Allow right click context menu.
require('electron-context-menu')({
  showInspectElement: false,
});

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow () {
  // Create the browser window.
  /*mainWindow = new BrowserWindow({
    width: 960,
    height: 500,
    center: true,
    autoHideMenuBar: true,
  });*/
  mainWindow = new BrowserWindow({
    width: 500,
    height: 250,
    center: true,
    autoHideMenuBar: true,
    resizable: false,
  });

  mainWindow.title = "Tox";
  /*mainWindow.setMinimumSize(750, 300);*/
  mainWindow.setMinimumSize(500, 250);
  //mainWindow.setMenu(null);

  proto.registerFileProtocol(protocol, (request, callback) => {
    const url = request.url.substr(protocol.length + 3);
    mainWindow.webContents.send('protocol-activated', url);
    
    if (url == 'main-window') {
      mainWindow.setSize(960, 500);
      mainWindow.setMinimumSize(750, 300);
      mainWindow.setResizable(true);
      mainWindow.loadURL(`file://${__dirname}/views/${url}.html`);
      return;
    }
    
    //mainWindow.loadURL(`file://${__dirname}/views/${url}`);
    //callback({ path: path.normalize(__dirname + '/views/' + url) });
    console.log('Successfuly registered protocol `' + protocol + '://' + url + '`', __dirname + '/' + url);
  }, (err) => {
    if (err) {
      console.error('Failed to register internal protocol.', err);
    }
  });

  // and load the index.html of the app.
  mainWindow.loadURL(`file://${__dirname}/views/index.html`);

  // Open the DevTools.
  //mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })

  var wc = mainWindow.webContents;
  wc.on('will-navigate', function (e, url) {
    // If internal URI, return;
    if (url.indexOf(protocol) == 0) {
      return;
    }

    if (url != wc.getURL()) {
      e.preventDefault();
      require('electron').shell.openExternal(url);
    }
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
});
