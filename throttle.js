const fs = require('fs');
const path = require('path');
const currentDate = new Date().toISOString();

const filePath = path.join(__dirname, 'date.json');
function getDate() {
  fs.readFile(filePath, 'utf-8', (readErr, data) => {
    if (readErr) {
      console.error('Error reading file:', readErr);
    } else {
      try {
        const jsonData = JSON.parse(data);
        console.log('Time from file:', jsonData.date);
        const oldTime = jsonData.date;
        const diff = Math.abs((new Date(currentDate) - new Date(oldTime)));
        if (diff >= 5000){
          console.log('通过',diff);
          setDate();
          return true;
        }else{
          console.log('不通过',diff)

          return false;
        }
      } catch (parseErr) {
        console.error('Error parsing JSON:', parseErr);
        return null;
      }
    }
  });
}
// 设置时间当前
function setDate() {
  const contentToWrite = { date: currentDate };
  fs.writeFile(filePath, JSON.stringify(contentToWrite, null, 2), (writeErr) => {
    if (writeErr) {
      console.error('Error creating file:', writeErr);
    } else {
      console.log('File created with current time:', currentDate);
    }
  });
}
exports.main = function() {
  // 检查文件是否存在并读取或创建文件
  fs.access(filePath, fs.constants.F_OK, (accessErr) => {
    if (accessErr) {
      // 文件不存在，创建新文件并写入当前时间
      return setDate();
    } else {
      // 文件存在，读取文件内容并解析JSON
      return getDate();

    }
  });
}
