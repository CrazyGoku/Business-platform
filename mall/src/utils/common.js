
export const time = function(timestamp) {
  if(timestamp){
    console.log(timestamp)
    timestamp = timestamp + ''
    var regTime = timestamp.replace(/\-/g, "/");
    var date = new Date(regTime)
    var Y = date.getFullYear() + '-'
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
    var D = date.getDate()
    return Y + M + D
  }
}

export const timeForMinute = function(timestamp) {
  console.log(timestamp)
  if(timestamp){
    var date = new Date(timestamp)
    var Y = date.getFullYear() + '-'
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
    var D = date.getDate() + ' '
    var H = date.getHours() + ':'
    var Minute = date.getMinutes() + ':'
    var S = date.getSeconds()
    var res =  Y + M + D + H + Minute + S
    var regTime = res.replace(/\-/g, "/");
    var datec =  new Date(regTime)
    console.log(datec)
    return datec.getFullYear() + '/' + (datec.getMonth() + 1 < 10 ? '0' + (datec.getMonth() + 1) : datec.getMonth() + 1) + '/'+datec.getDate() + ' ' +datec.getHours() + ':'+datec.getMinutes() + ':'+datec.getSeconds()
  }
}
