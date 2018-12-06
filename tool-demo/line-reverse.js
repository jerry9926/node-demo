// 按行颠倒文本
const readline = require('linebyline')
const fs = require('fs')
const path = require('path')

const DIS_FILE = path.join(__dirname, './dist_file/linebyline-done.txt')
const SRC_FILE = path.join(__dirname, './src_file/linebyline.txt')
let content = []

const rl = readline(SRC_FILE)
rl.on('line', function (line, lineCount, byteCount) {
  console.log(`${lineCount}, ${line}`)
  content.unshift(line)
}).on('error', function (e) {
  // something went wrong
  console.log(`something wrong, ${e}`)
}).on('end', function () {
  content = content.join('\n')
  fs.writeFileSync(DIS_FILE, content, 'utf8')
  console.log('end')
})