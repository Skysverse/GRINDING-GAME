const {app, BrowserWindow, Menu} = require('electron');
const path = require('node:path');
app.setName('Emberfall');
app.whenReady().then(() => {
  Menu.setApplicationMenu(null);
  const win = new BrowserWindow({
    width:1440,height:900,minWidth:1024,minHeight:700,
    backgroundColor:'#0b1214',title:'Emberfall',
    webPreferences:{nodeIntegration:false,contextIsolation:true,sandbox:true}
  });
  win.webContents.on('before-input-event', (event, input) => {
    if (input.key === 'F11' && input.type === 'keyDown') {
      event.preventDefault();
      win.setFullScreen(!win.isFullScreen());
    }
  });
  win.loadFile(path.join(__dirname,'index.html'));
  win.webContents.setWindowOpenHandler(()=>({action:'deny'}));
  win.webContents.on('will-navigate',(event,url)=>{
    if(url !== require('node:url').pathToFileURL(path.join(__dirname,'index.html')).href) event.preventDefault();
  });
});
app.on('window-all-closed',()=>app.quit());
