const fs = require('fs');
const fs2 = require('fs').promises;
const path = require('path');
const currentDate = new Date().toISOString();

const filePath = path.join(__dirname, 'date.json');

async function getDate() {
  try {
    const data = await fs2.readFile(filePath, 'utf-8');
    const jsonData = JSON.parse(data);
    console.log('Time from file:', jsonData.date);
    const oldTime = jsonData.date;
    const diff = Math.abs((new Date(currentDate) - new Date(oldTime)));
    if (diff >= 5000) {
      // console.log('通过', diff);
      await setDate();
      return true;
    } else {
      // console.log('不通过', diff);
      return false;
    }
  } catch (err) {
    // console.error('Error:', err);
    return null;
  }
}

async function setDate() {
  const contentToWrite = { date: currentDate };
  await fs.promises.writeFile(filePath, JSON.stringify(contentToWrite, null, 2));
  console.log('File created with current time:', currentDate);
  return true;
}

const throttle = async () => {
  let result = null;
  try {
    await fs2.access(filePath, fs.constants.F_OK);
    result = await getDate();
  } catch (err) {
    console.log('Error:', err);
    result = await setDate();
  }
  return result;
};

// throttle().then(res => {
//   console.log('throttle', res);
// });

module.exports = {
  throttle,
};
