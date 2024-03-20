import { app, BrowserWindow } from 'electron'

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
  })

  // 使用 loadFile 加载 electron/index.html 文件
  mainWindow.loadURL("http://localhost:5173/")
}

// 在应用准备就绪时调用函数
app.whenReady().then(() => {
  createWindow()
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
