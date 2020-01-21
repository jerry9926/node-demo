
/**
 * wechat账单格式转alipay账单格式工具
 * 1. 把原来wechat账单手动转为xlsx格式
 * 2. 放到temp路径，修改IMPORT_PATH、DIST_PATH
 * 3. 运行 node demo.js
 * 4. 得到alipay账单格式的xlsx格式的文件
 * 5. 手动把xlsx格式的文件转为csv格式
 */
const path = require('path')
const fs = require('fs')
const iconv = require('iconv-lite')
const xlsx= require('node-xlsx')

const TEMP_PATH = path.join(__dirname, './temp/alipay_record_temp1.xlsx')
const IMPORT_PATH = path.join(__dirname, './temp/wechat_record(20191101-20191231).xlsx')
const DIST_PATH = path.join(__dirname, './dist/wechat_record(20191101-20191231).xlsx')

handle(TEMP_PATH, IMPORT_PATH, DIST_PATH)

function handle(tempPath, importPath, distPath) {
    const importData = readExcel(importPath)
    const mergeData = mergeExcel(importData, tempPath)
    writeExcel(mergeData, distPath)
}

/**
 * 解析wechat表格
 * 第17行开始
 * 每列数据
 * 0 时间
 * 2 交易对方
 * 3 商品
 * 5 金额
 * @param {*} filePath 
 */
function readExcel(filePath) {
    const tempFile = xlsx.parse(filePath)
    const sheetOne = tempFile[0]
    const res = []
    
    if (sheetOne && sheetOne.data) {
        if (sheetOne.data.length > 0) {
            sheetOne.data.map((item, index) => {
                if (item && item.length > 0) {
                    if (index >= 17) {
                        const data = []
                        data[10] = '支出'
                        data[15] = '已支出'

                        item.map((iitem, iindex) => {
                            // 时间
                            if (iindex === 0) {
                                data[2] = new Date(1900, 0, iitem - 0)
                                data[3] = new Date(1900, 0, iitem - 0)
                                data[4] = new Date(1900, 0, iitem - 0)
                            }
                            // 交易对方
                            if (iindex === 2) {
                                data[8] = iitem
                            }
                            // 金额
                            if (iindex === 5) {
                                data[9] = iitem
                            }

                            console.log(index, iindex, typeof iitem)
                            // 0/5 是 number
                            if (typeof iitem === 'string') {
                                // console.log(index, iindex)
                                // const bufChange = iconv.decode(iitem, 'gbk')
                                // item[iindex] = bufChange.toString()
                            }
                            
                        })

                        res.push(data)
                    }
                    // console.log(index, item)
                }
            })
        }
    }

    console.log('res=', res)

    return res
}

/**
 * 数据合并到alipay模板
 * 第5行开始
 * 每列数据
 * 2 创建时间
 * 3 付款时间
 * 4 最近修改时间
 * 8 商品名称
 * 9 金额
 * 10 收/支（支出）
 * 15 资金状态（已支出）
 */
function mergeExcel(data, filePath) {
    const tempFile = xlsx.parse(filePath)
    const sheetOne = tempFile[0]
    
    if (sheetOne && sheetOne.data) {
        if (sheetOne.data.length > 0) {
            sheetOne.data.map((item, index) => {
                if (item && item.length > 0) {
                    item.map((iitem, iindex) => {
                        if (typeof iitem === 'string') {
                            // const bufChange = iconv.decode(iitem, 'gbk')
                            // item[iindex] = bufChange.toString()
                        }
                    })
                }
                // console.log(index, item)
            })
            // 从第5行开始插入数据
            sheetOne.data.splice(5, 0, ...data)
            console.log('sheetOne.data', sheetOne.data)
        }
    }

    return tempFile
}



// 写入表格
function writeExcel(tempFile, filePath) {
    const fileName = filePath
    const buffer = xlsx.build(tempFile)
    fs.writeFile(fileName, buffer, function (err) {
        if (err) throw err
        console.log('File is created successfully.')
    })
}


/*
方法：用 const bufChange = myiconv.convert(iitem) 
效果：失败

// const Iconv  = require('iconv').Iconv
// const myiconv = new Iconv('GBK', 'UTF-8');

if (sheetOne && sheetOne.data) {
    if (sheetOne.data.length > 0) {
        sheetOne.data.map((item, index) => {
            if (item && item.length > 0) {
                item.map((iitem, iindex) => {
                    // console.log(index, iitem)

                    // const buf = Buffer.from(iitem, 'GBK')
                    if (typeof iitem === 'string') {
                        const bufChange = myiconv.convert(iitem)
                        // console.log(index, bufChange.toString())
                        item[iindex] = bufChange.toString()
                    }
                })
            }
            console.log(index, item)
        })
    }
}
*/