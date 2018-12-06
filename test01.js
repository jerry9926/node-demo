function getSyncTime() {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve(2)
		}, 2000)
	})
}
function getStartTime() {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve(3)
		}, 3000)
	})
}

async function getSyncData() {
  let time = await getSyncTime()
  console.log(time)
  let data = `endTime - startTime = ${time}`
  return Promise.resolve(data)
}

// getSyncData().then((data) => console.log('2,' + data))

async function getSyncData2() {
  let time, startTime
  let p1 = getSyncTime().then((data) => {
  	time = data	
  	console.log(`time = ${data}`)
  })
  let p2 = getStartTime().then((data) => {
  	startTime = data
  	console.log(`startTime = ${data}`)	
  })
  // p1 p2 并行执行
  await Promise.all([p1, p2])
  // p1 p2 都结束后继续
  let data = `endTime - ${startTime} = ${time}`
  return Promise.resolve(data)
}

getSyncData2().then((data) => console.log('2,' + data))