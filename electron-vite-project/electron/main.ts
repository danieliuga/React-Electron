import { app, BrowserWindow, Menu, Notification, shell } from 'electron'
import path from 'node:path'
import Store from 'electron-store'

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.js
// │
process.env.DIST = path.join(__dirname, '../dist')
process.env.VITE_PUBLIC = app.isPackaged ? process.env.DIST : path.join(process.env.DIST, '../public')


let win: BrowserWindow | null
// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']

function createWindow() {
  win = new BrowserWindow({
    width: 2100,
    height: 1500,
    icon: path.join(process.env.VITE_PUBLIC, 'electron-vite.svg'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  })

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString())
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(process.env.DIST, 'index.html'))
  }

  // Nuevo
  win.once('ready-to-show', () => {
    win?.show();
    win?.setFullScreen(true);
  });

}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})
//Nuevo
app.whenReady().then(() => {
  createWindow()
  const template = [
    {
      label: 'Salir',
      submenu: [
        {
          label: 'Exit',
          accelerator: 'Ctrl+H',
          click: () => {
            app.quit()
          }
        },
        {
          label: 'Reload',
          accelerator: 'Ctrl+R',
          click: () => {
            win?.webContents.reload();
          }
        },
        {
          label: 'More',
          submenu: [
            {
              label: 'Inspecciona',
              accelerator: 'Ctrl+Shift+I',
              click: () => {
                win?.webContents.openDevTools();
              }
            }
          ]
        },
        {
          label: 'Volver al Inicio',
          click: () => {
            win?.close();
            createWindow();
          },
        },
      ]
    },
    {
      label: 'Funciones',
      submenu: [
        {
          label: 'URL',
          click: () => {
            const currentURL = win?.webContents.getURL();
            console.log('URL actual:', currentURL);
          }
        },
        {
          label: 'Title',
          click: () => {
            const pageTitle = win?.webContents.getTitle();
            console.log('Titulo de la pagina actual:', pageTitle);
          }
        },
        {
          label: 'Window size',
          click: () => {
            const size = win?.getSize();
            console.log('Tamano de la ventana:', size);
          }
        },
        {
          label: 'Style Page',
          submenu: [
            {
              label: 'Black',
              click: () => {
                const cssCode = 'body { background-color: #000000 ; }';
                win?.webContents.insertCSS(cssCode);
              }
            },
            {
              label: 'White',
              click: () => {
                const cssCode = 'body { background-color: #FFFFFF; }';
                win?.webContents.insertCSS(cssCode);
              }
            }
          ],
        },
      ]
    },
    {
      label: 'Funciones 2',
      submenu: [
        {
          label: 'Go Back',
          click: () => {
            win?.webContents.goBack();
          }
        },
        {
          label: 'Git Hub',
          click: () => {
            win?.webContents.loadURL('https://github.com/');
          }
        },
        {
          label: 'YouTube',
          click: () => {
            win?.webContents.loadURL('https://www.youtube.com/');
          }
        },
      ]
    },
    {
      label: 'Buscar',
      submenu: [
        {
          label: 'Buscar URL',
          accelerator: 'Ctrl+B',
          click: async () => {
            win?.webContents.loadURL('https://www.google.com/');
          }
        },
      ]
    },
    {
      label: 'MyTravelport',
      submenu: [
        {
          label: 'Slack',
          click: async () => {
            win?.webContents.loadURL('https://app.slack.com/client/E037L6F8U15/C05DQU5BFFG');
          }
        },
        {
          label: 'Outlook',
        }
      ]
    }
  ]
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
  const notification = new Notification({
    title: 'Notification',
    body: 'Dani Iuga ha entrado a la aplicación'
  })
  notification.show()
  //shell.openExternal('http://localhost:5173/');

})

//Nuevo
const store = new Store();
const num1 = 3;
const num2 = 3;
store.set('Suma', num1 + num2);
console.log(store.get('Suma'));

