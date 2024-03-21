const fs = require('fs')
const path = require('path')

const fileDir = process.argv[2]
const fileName = process.argv[3]
const fileEncode = process.argv[4]
const fileExt = process.argv[5]
const user = process.argv[6]
const filePath = path.join(fileDir, fileName)
const {throttle} = require('C:\\Users\\Administrator\\Documents\\code\\file-header\\throttle.js')
const isLess = num => num < 10 ? ('0' + num) : num

const timeFormat = now => {
  return `${now.getFullYear()}-${ isLess(now.getMonth() + 1) }-${isLess(now.getDate())} ${isLess(now.getHours())}:${isLess(now.getMinutes())}:${isLess(now.getSeconds())}`
}


console.log(`path: ${filePath}, encode: ${fileEncode}, ext: ${fileExt}`)

try {

  throttle().then(mainR => {
    if (!mainR){
      console.log('app-未通过',mainR)
      return
    }else{
      console.log('app-通过',mainR)
      const source = fs.readFileSync(filePath, {
        encoding: fileEncode
      })
      let sourceStr = source.toString()

      const editor =
          sourceStr.match(/(@LastEditors: )(.*)/) ? sourceStr.match(/(@LastEditors: )(.*)/)[0] : false

      const time =
          sourceStr.match(/(@LastEditTime: )(.*)/) ? sourceStr.match(/(@LastEditTime: )(.*)/)[0] : false

      const date = timeFormat(new Date())

      if (!editor || !time) {

        let header;
        if (['js', 'ts','jsx', 'tsx'].includes(fileExt)) {
          header = `/*\n * @Author: ${user}\n * @Date: ${date}\n * @LastEditors: ${user}\n * @LastEditTime: ${date}\n * @Description: desc\n */\n`;
        } else if (['vue', 'html'].includes(fileExt)) {
          header = `<!--\n * @Author: ${user}\n * @Date: ${date}\n * @LastEditors: ${user}\n * @LastEditTime: ${date}\n * @Description: desc\n -->\n`;
        } else {
          // For other file types, you can define a default header here.
          header = `/*\n * @Author: ${user}\n * @Date: ${date}\n * @LastEditors: ${user}\n * @LastEditTime: ${date}\n * @Description: desc\n */\n`;
        }

        sourceStr = header + sourceStr

      } else {

        sourceStr = sourceStr.replace(editor, `@LastEditors: ${user}`)
        sourceStr = sourceStr.replace(time, `@LastEditTime: ${date}`)

      }

      fs.writeFileSync(filePath, sourceStr, { encoding: fileEncode })
    }
  })



} catch (e) {
  console.log(e)
}
