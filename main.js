const { app, BrowserWindow, ipcMain, nativeTheme } = require('electron');
const { startServer } = require('./server.js');
const path = require('path');

let window; 
let isCustomMaximized = false; 

async function main() {
    
    await app.whenReady();

    window = new BrowserWindow({
        width: 1000,
        height: 700,
        frame: false, 
        transparent: true, 
        backgroundColor: '#00000000', 
        webPreferences: {
            preload: path.join(__dirname, 'renderer.js'), 
            contextIsolation: true, 
        },
    });

    window.on('closed', () => {
        app.quit();
    });

    
    try {
        await startServer();
        console.log('Backend server started successfully.');
    } catch (error) {
        console.error('Failed to start backend server:', error);
    }


    window.loadFile(path.join(__dirname, './frontend/build/index.html'));
    window.loadURL('http://localhost:3000');

    if (nativeTheme.shouldUseDarkColors) {
        window.webContents.send('apply-dark-mode');
    }
}


ipcMain.on('window-minimize', () => {
    if (window) window.minimize();
});

ipcMain.on('window-maximize', () => {
    if (window) {
        if (isCustomMaximized) {
            
            window.setBounds({ width: 1000, height: 700, x: 100, y: 100 }); 
            isCustomMaximized = false;
        } else {
            
            window.maximize();
            isCustomMaximized = true;
        }
    }
});

ipcMain.on('window-close', () => {
    if (window) window.close();
});


main();
