// 按行匹配文本
const readline = require('linebyline')
const fs = require('fs')
const path = require('path')

const DIS_FILE = path.join(__dirname, './dist_file/partten-done.txt')
const SRC_FILE = path.join(__dirname, './src_file/test-partten.vue')
// 匹配正则
const patten = /(i18n\.[0-9a-z-A-Z.]+)/
let content = []

const rl = readline(SRC_FILE)
rl.on('line', function (line, lineCount, byteCount) {
  console.log(`${lineCount}, ${line}`)
  if (line.match(patten)) {
    const str = `${line.match(patten)[1]}, ${line.trim()}` // 返回匹配的文本和当前行
    content.push(str)
  }
}).on('error', function (e) {
  // something went wrong
  console.log(`something wrong, ${e}`)
}).on('end', function () {
  content = content.join('\n')
  fs.writeFileSync(DIS_FILE, content, 'utf8')
  console.log('end')
})
