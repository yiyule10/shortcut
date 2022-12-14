//原作者：Dwannn-（https://space.bilibili.com/1431569121）
//更新内容：签到功能修复
//修改者：YI封夕（https://space.bilibili.com/166721750）
//自动签到快捷指令实现教程：https://www.bilibili.com/video/BV1qg411173w/

const version = "2.7"

const name = "Genshin Daily"

let iCloud = FileManager.iCloud()
let file = FileManager.local()

const imgPath = iCloud.joinPath(iCloud.documentsDirectory(), name)
if (!iCloud.fileExists(imgPath) || !iCloud.isDirectory(imgPath)) { iCloud.createDirectory(imgPath) }
let imgIcon = [{"name":"resin","key":"lO1"},{"name":"task","key":"3ex"},{"name":"discount","key":"8w6"},{"name":"home","key":"GTK"},{"name":"recovery","key":"QyR"}]
for(var i=0;i<imgIcon.length;i++){
  if(!iCloud.readImage(iCloud.joinPath(imgPath, imgIcon[i].name + ".png"))){
    iCloud.writeImage(iCloud.joinPath(imgPath,imgIcon[i].name + ".png"),await getImage(`https://s1.ax1x.com/2022/05/06/Oud${imgIcon[i].key}.png`))}
}

const CookiePath = iCloud.joinPath(iCloud.documentsDirectory(), "Cookie1.txt")
  
if(config.runsInApp){
  
  if(! file.readString(CookiePath)){await alert()}else{
  
  message = "米游社实时便笺"
  options = ["更新Cookie","缓存数据","更新检测","设置背景","米游社签到","预览组件","退出"]
  const action = await generateAlert(message, options)
  if(action == 0){
  await alert()
}
  if(action == 1)
  {message = `⚠️⚠️⚠️\n此操作会删除所有缓存数据包括Cookie\n\n确认是否删除？`;
options = ["确认","取消"]
let warning = await generateAlert(message, options)
if(warning == 0){
  iCloud.remove(CookiePath);iCloud.remove(imgPath)}
}
  if(action == 2){  
const Json = await new Request("https://gitee.com/peter7/genshin/raw/master/updata.json").loadJSON()
if(Json[name].version === version){
  message = "暂无更新\n\n" + Json[name].version + Json[name].notes + Json[name].updateTime
}else{ message = "检测到新版本\n\n" + Json[name].version + Json[name].notes + Json[name].updateTime}
options = ["确认"]
let updata = await generateAlert(message, options)
if(Json[name].version != version){
  iCloud.writeString(iCloud.joinPath(iCloud.documentsDirectory(), name + ".js"), await new Request(Json[name].url).loadString())
let n = new Notification()
n.title = "更新脚本" + name
n.body = "更新成功。"
n.sound = "default"
await n.schedule()
}}
  if(action == 3){
  iCloud.writeImage(iCloud.joinPath(imgPath, "Genshin1.jpg"), await Photos.fromLibrary())
}
  if(action == 4){
let sign = await getSign()
  if(!sign.is_sign){
  let post = await postSign()
  }
  let gift = await getGift()
  let n = new Notification()
  n.title = gift.list[0].created_at
  n.subtitle = `「累计签到${gift.total}天」「本月签到${sign.total_sign_day}天」「漏签${sign.sign_cnt_missed}天」`
  n.body = `今天签到奖励：『${gift.list[0].name}*${gift.list[0].cnt}』`
n.sound = "complete"
await n.schedule()
}
  if(action == 5){
    message = "请选择预览大小"
    options = ["小组件","中组件","大组件"]
    let show = await generateAlert(message,options)
if(show == 0){let widget = await smallWidget()
widget.presentSmall()}
if(show == 1){let widget = await mediumWidget()
widget.presentMedium()}
if(show == 2){let widget = await largeWidget()
widget.presentLarge()}
  }
  if(action == 6) return
}
}


async function smallWidget(){
  let w = new ListWidget()
w.backgroundImage = iCloud.readImage(iCloud.joinPath(imgPath,"Genshin1.jpg"))
if(!iCloud.readString(CookiePath)){
  w.addText("添加Cookie后使用").centerAlignText()}
let data = await getDaily()
console.log(data)
var sign = await getSign()
console.log(sign)
  var stack = w.addStack()
  stack.centerAlignContent()
  var resinIcon = stack.addImage(iCloud.readImage(iCloud.joinPath(imgPath, "resin.png")))
resinIcon.imageSize = new Size(20,20)
var resinTitle = stack.addText("原粹树脂")
resinTitle.font = Font.boldRoundedSystemFont(12)
stack.addSpacer()
var signText = stack.addText(`${sign.total_sign_day}`)
signText.font = Font.boldRoundedSystemFont(10)
if(!sign.is_sign){
  signText.textColor = Color.orange()}
  
w.addSpacer()
var resinText = w.addText(`${data.current_resin}/${data.max_resin}`)
resinText.font = Font.boldRoundedSystemFont(28)
resinText.centerAlignText()
w.addSpacer()
if(data.resin_recovery_time != 0){
var afText = w.addText("预计全部恢复时间")
afText.font = Font.boldRoundedSystemFont(9)
}
var afTime = w.addText(await getClock(data.resin_recovery_time))
afTime.font = Font.boldRoundedSystemFont(11)
return w
}

async function mediumWidget(){
  let w = new ListWidget()
w.backgroundImage = iCloud.readImage(iCloud.joinPath(imgPath,"Genshin1.jpg"))
if(!iCloud.readString(CookiePath)){
  w.addText("添加Cookie后使用").centerAlignText()}
let data = await getDaily()
console.log(data)
var sign = await getSign()
console.log(sign)
var stack = w.addStack()

var resinStack = stack.addStack()
resinStack.centerAlignContent()
resinStack.layoutVertically()

var resinIcon = resinStack.addImage(iCloud.readImage(iCloud.joinPath(imgPath, "resin.png")))
resinIcon.imageSize = new Size(20,20)

var resinText = resinStack.addText(`${data.current_resin}/${data.max_resin}`)
resinText.font = Font.boldRoundedSystemFont(20)

var resinTime = resinStack.addText(`${await getClock(data.resin_recovery_time)}`)
resinTime.font = Font.mediumRoundedSystemFont(9)

stack.addSpacer()

var homeStack = stack.addStack()
homeStack.centerAlignContent()
homeStack.layoutVertically()

var homeIcon = homeStack.addImage(iCloud.readImage(iCloud.joinPath(imgPath, "home.png")))
homeIcon.imageSize = new Size(20,20)

var homeText = homeStack.addText(`${data.current_home_coin}/${data.max_home_coin}`)
homeText.font = Font.boldRoundedSystemFont(20)

const home_time = formatExpRemainTime(data.home_coin_recovery_time)
if(home_time[0] != "00"){
  var text = `${~~home_time[0]}时${~~home_time[1]}分后`
}else{
  var text = `${~~home_time[1]}分后`
}
if(data.home_coin_recovery_time == 0){
  var text = `宝钱已满`
}

var homeTime = homeStack.addText(text)
homeTime.font = Font.mediumRoundedSystemFont(9)

stack.addSpacer()

var userStack = stack.addStack()
userStack.layoutVertically()
  
 
  

w.addSpacer()

var stack = w.addStack()
stack.centerAlignContent()

var taskIcon = stack.addImage(iCloud.readImage(iCloud.joinPath(imgPath, "task.png")))
taskIcon.imageSize = new Size(20,20)
var taskText = stack.addText(`${data.finished_task_num}/${data.total_task_num}`)
taskText.font = Font.boldRoundedSystemFont(15)
if(!data.is_extra_task_reward_received){
  taskText.textColor = Color.orange()}

stack.addSpacer()

var disIcon = stack.addImage(iCloud.readImage(iCloud.joinPath(imgPath, "discount.png")))
disIcon.imageSize = new Size(20,20)
var disText = stack.addText(`${3-data.remain_resin_discount_num}/${data.resin_discount_num_limit}`)
disText.font = Font.boldRoundedSystemFont(15)

stack.addSpacer()

var recIcon = stack.addImage(iCloud.readImage(iCloud.joinPath(imgPath, "recovery.png")))
recIcon.imageSize = new Size(20,20)
var recTime = data.transformer.recovery_time
if(recTime.Day != 0){
  var text = `${recTime.Day}天`}
  if(recTime.Hour != 0){
  var text = `${recTime.Hour}时`}
  if(recTime.Minute != 0){
  var text = `${recTime.Minute}分`}
  if(recTime.Second != 0){
  var text = `${recTime.Second}秒`}
  if(recTime.reached){
    var text = `已冷却`}
  
  
var recText = stack.addText(text)
recText.font = Font.boldRoundedSystemFont(15)

w.addSpacer()

var stack = w.addStack()
stack.centerAlignContent()
var textStack = stack.addStack()
var text = textStack.addText(`探索派遣：${data.current_expedition_num}/${data.max_expedition_num}`)
text.font = Font.boldRoundedSystemFont(15)
stack.addSpacer()
var expStack = stack.addStack()
expStack.setPadding(0,0,0,0)
for(var i=0;i<data.expeditions.length;i++){
  var exp = data.expeditions[i]
const avatarSide = exp.avatar_side_icon.split("_")
const sideNum = avatarSide.length-1
var expAvatar = avatarSide[sideNum].split(".")[0]
if(expAvatar == "Bennett" && expAvatar == "Chongyun" && expAvatar == "Fischl" && expAvatar == "Sara" && expAvatar == "Keqing"){var percent = 100-exp.remained_time*(100/54000)
}else{var percent = 100-exp.remained_time*(100/72000)}
  if(! iCloud.readImage(iCloud.joinPath(imgPath, avatarSide[sideNum]))){
  
iCloud.writeImage(iCloud.joinPath(imgPath, avatarSide[sideNum]),await getImage(exp.avatar_side_icon))}

  var avatarStack = expStack.addStack()
  avatarStack.layoutVertically()
  var canvas = new DrawContext()
  canvas.size = new Size(128,128)
      canvas.opaque = false
      canvas.respectScreenScale = true
    let ctr = new Point(128/ 2, 128 / 2);
    let bgx = ctr.x - 50;
    let bgy = ctr.y - 50;
    let bgd = 2 * 50;
    let bgr = new Rect(bgx, bgy, bgd, bgd)

    canvas.setStrokeColor(Color.gray());
    canvas.setLineWidth(6);
    canvas.strokeEllipse(bgr);
if(percent != 100){
  color = Color.green()
}else{color = Color.red()}
    for (let t = 0; t < percent*3.6; t++) {
      let rect_x = ctr.x + 50 * Math.sin((t * Math.PI) / 180) - 6 / 2;
      let rect_y = ctr.y - 50 * Math.cos((t * Math.PI) / 180) - 6 / 2;
      let rect_r = new Rect(rect_x, rect_y, 6,6);
      canvas.setFillColor(color);
      canvas.fillEllipse(rect_r);
    }
  var img = iCloud.readImage(iCloud.joinPath(imgPath,avatarSide[sideNum]))
canvas.drawImageAtPoint(img, new Point(-5,-15))
  var iconStack = avatarStack.addStack()
  iconStack.addImage(canvas.getImage())
  
}
return w
}

async function largeWidget(){
let w = await mediumWidget()
return w
}


function formatExpRemainTime(timeRemain) {
    let processTimeTmp = parseInt(timeRemain / 60)

    let hour = parseInt(processTimeTmp/60)
    let minute = parseInt(processTimeTmp%60)
    let second = parseInt(timeRemain%60)

    return [hour.toString().padStart(2,'0'), minute.toString().padStart(2,'0'), second.toString().padStart(2,'0')]
}

function md5(str) {
  function d(n, t) {
    var r = (65535 & n) + (65535 & t)
    return (((n >> 16) + (t >> 16) + (r >> 16)) << 16) | (65535 & r)
  }

  function f(n, t, r, e, o, u) {
    return d(((c = d(d(t, n), d(e, u))) << (f = o)) | (c >>> (32 - f)), r)
    var c, f
  }

  function l(n, t, r, e, o, u, c) {
    return f((t & r) | (~t & e), n, t, o, u, c)
  }

  function v(n, t, r, e, o, u, c) {
    return f((t & e) | (r & ~e), n, t, o, u, c)
  }

  function g(n, t, r, e, o, u, c) {
    return f(t ^ r ^ e, n, t, o, u, c)
  }

  function m(n, t, r, e, o, u, c) {
    return f(r ^ (t | ~e), n, t, o, u, c)
  }

  function i(n, t) {
    var r, e, o, u
    ;(n[t >> 5] |= 128 << t % 32), (n[14 + (((t + 64) >>> 9) << 4)] = t)
    for (
      var c = 1732584193,
        f = -271733879,
        i = -1732584194,
        a = 271733878,
        h = 0;
      h < n.length;
      h += 16
    )
      (c = l((r = c), (e = f), (o = i), (u = a), n[h], 7, -680876936)),
        (a = l(a, c, f, i, n[h + 1], 12, -389564586)),
        (i = l(i, a, c, f, n[h + 2], 17, 606105819)),
        (f = l(f, i, a, c, n[h + 3], 22, -1044525330)),
        (c = l(c, f, i, a, n[h + 4], 7, -176418897)),
        (a = l(a, c, f, i, n[h + 5], 12, 1200080426)),
        (i = l(i, a, c, f, n[h + 6], 17, -1473231341)),
        (f = l(f, i, a, c, n[h + 7], 22, -45705983)),
        (c = l(c, f, i, a, n[h + 8], 7, 1770035416)),
        (a = l(a, c, f, i, n[h + 9], 12, -1958414417)),
        (i = l(i, a, c, f, n[h + 10], 17, -42063)),
        (f = l(f, i, a, c, n[h + 11], 22, -1990404162)),
        (c = l(c, f, i, a, n[h + 12], 7, 1804603682)),
        (a = l(a, c, f, i, n[h + 13], 12, -40341101)),
        (i = l(i, a, c, f, n[h + 14], 17, -1502002290)),
        (c = v(
          c,
          (f = l(f, i, a, c, n[h + 15], 22, 1236535329)),
          i,
          a,
          n[h + 1],
          5,
          -165796510
        )),
        (a = v(a, c, f, i, n[h + 6], 9, -1069501632)),
        (i = v(i, a, c, f, n[h + 11], 14, 643717713)),
        (f = v(f, i, a, c, n[h], 20, -373897302)),
        (c = v(c, f, i, a, n[h + 5], 5, -701558691)),
        (a = v(a, c, f, i, n[h + 10], 9, 38016083)),
        (i = v(i, a, c, f, n[h + 15], 14, -660478335)),
        (f = v(f, i, a, c, n[h + 4], 20, -405537848)),
        (c = v(c, f, i, a, n[h + 9], 5, 568446438)),
        (a = v(a, c, f, i, n[h + 14], 9, -1019803690)),
        (i = v(i, a, c, f, n[h + 3], 14, -187363961)),
        (f = v(f, i, a, c, n[h + 8], 20, 1163531501)),
        (c = v(c, f, i, a, n[h + 13], 5, -1444681467)),
        (a = v(a, c, f, i, n[h + 2], 9, -51403784)),
        (i = v(i, a, c, f, n[h + 7], 14, 1735328473)),
        (c = g(
          c,
          (f = v(f, i, a, c, n[h + 12], 20, -1926607734)),
          i,
          a,
          n[h + 5],
          4,
          -378558
        )),
        (a = g(a, c, f, i, n[h + 8], 11, -2022574463)),
        (i = g(i, a, c, f, n[h + 11], 16, 1839030562)),
        (f = g(f, i, a, c, n[h + 14], 23, -35309556)),
        (c = g(c, f, i, a, n[h + 1], 4, -1530992060)),
        (a = g(a, c, f, i, n[h + 4], 11, 1272893353)),
        (i = g(i, a, c, f, n[h + 7], 16, -155497632)),
        (f = g(f, i, a, c, n[h + 10], 23, -1094730640)),
        (c = g(c, f, i, a, n[h + 13], 4, 681279174)),
        (a = g(a, c, f, i, n[h], 11, -358537222)),
        (i = g(i, a, c, f, n[h + 3], 16, -722521979)),
        (f = g(f, i, a, c, n[h + 6], 23, 76029189)),
        (c = g(c, f, i, a, n[h + 9], 4, -640364487)),
        (a = g(a, c, f, i, n[h + 12], 11, -421815835)),
        (i = g(i, a, c, f, n[h + 15], 16, 530742520)),
        (c = m(
          c,
          (f = g(f, i, a, c, n[h + 2], 23, -995338651)),
          i,
          a,
          n[h],
          6,
          -198630844
        )),
        (a = m(a, c, f, i, n[h + 7], 10, 1126891415)),
        (i = m(i, a, c, f, n[h + 14], 15, -1416354905)),
        (f = m(f, i, a, c, n[h + 5], 21, -57434055)),
        (c = m(c, f, i, a, n[h + 12], 6, 1700485571)),
        (a = m(a, c, f, i, n[h + 3], 10, -1894986606)),
        (i = m(i, a, c, f, n[h + 10], 15, -1051523)),
        (f = m(f, i, a, c, n[h + 1], 21, -2054922799)),
        (c = m(c, f, i, a, n[h + 8], 6, 1873313359)),
        (a = m(a, c, f, i, n[h + 15], 10, -30611744)),
        (i = m(i, a, c, f, n[h + 6], 15, -1560198380)),
        (f = m(f, i, a, c, n[h + 13], 21, 1309151649)),
        (c = m(c, f, i, a, n[h + 4], 6, -145523070)),
        (a = m(a, c, f, i, n[h + 11], 10, -1120210379)),
        (i = m(i, a, c, f, n[h + 2], 15, 718787259)),
        (f = m(f, i, a, c, n[h + 9], 21, -343485551)),
        (c = d(c, r)),
        (f = d(f, e)),
        (i = d(i, o)),
        (a = d(a, u))
    return [c, f, i, a]
  }

  function a(n) {
    for (var t = '', r = 32 * n.length, e = 0; e < r; e += 8)
      t += String.fromCharCode((n[e >> 5] >>> e % 32) & 255)
    return t
  }

  function h(n) {
    var t = []
    for (t[(n.length >> 2) - 1] = void 0, e = 0; e < t.length; e += 1)
      t[e] = 0
    for (var r = 8 * n.length, e = 0; e < r; e += 8)
      t[e >> 5] |= (255 & n.charCodeAt(e / 8)) << e % 32
    return t
  }

  function e(n) {
    for (var t, r = '0123456789abcdef', e = '', o = 0; o < n.length; o += 1)
      (t = n.charCodeAt(o)),
        (e += r.charAt((t >>> 4) & 15) + r.charAt(15 & t))
    return e
  }

  function r(n) {
    return unescape(encodeURIComponent(n))
  }

  function o(n) {
    return a(i(h((t = r(n))), 8 * t.length))
    var t
  }

  function u(n, t) {
    return (function (n, t) {
      var r,
        e,
        o = h(n),
        u = [],
        c = []
      for (
        u[15] = c[15] = void 0,
          16 < o.length && (o = i(o, 8 * n.length)),
          r = 0;
        r < 16;
        r += 1
      )
        (u[r] = 909522486 ^ o[r]), (c[r] = 1549556828 ^ o[r])
      return (
        (e = i(u.concat(h(t)), 512 + 8 * t.length)), a(i(c.concat(e), 640))
      )
    })(r(n), r(t))
  }

  function t(n, t, r) {
    return t ? (r ? u(t, n) : e(u(t, n))) : r ? o(n) : e(o(n))
  }

  return t(str)
}

async function generateAlert(message, options) {
  let alert = new Alert();
  alert.message = message;

  for (const option of options) {
    alert.addAction(option);
  }

  let response = await alert.presentAlert();
  return response;
}

async function getImage(url){
  var req = new Request(url)
  var img = await req.loadImage()
  return img
}

async function getJson(url){
  var req = new Request(url)
  var data = await req.loadJSON()
  return data
}

async function alert(){
  let alert = new Alert()
  alert.title = "米游社登陆"
  alert.message = "请输入米游社Cookie"
  alert.addTextField("米游社Cookie")
  alert.addAction("验证")
  const HoYologo = await alert.present()
  const Cookie = alert.textFieldValue(0)

  const req = new Request("https://api-takumi.mihoyo.com/binding/api/getUserGameRolesByCookie?game_biz=hk4e_cn")
  req.method = "GET"
  req.headers = {
    "Cookie": Cookie,
  }
  
  const HoYoLab = await req.loadJSON()
  let n = new Notification()
  n.title = "米游社Cookie"
  n.sound = "event"
if(HoYoLab.message == "OK"){
  iCloud.writeString(CookiePath, Cookie)
n.body = "已保存在iCloud文件夹。"

  }else{
    n.body = "Cookie输入错误"}
    await n.schedule()
}

async function getInfo(){
  var url = "https://api-takumi.mihoyo.com/binding/api/getUserGameRolesByCookie?game_biz=hk4e_cn"
  var time_ = String(parseInt(Date.now()/1000))
  var random_ = String(parseInt((Math.random()+1)*100000))
  var check = md5("salt=xV8v4Qu54lUKrEYFZkJhB8cuOh9Asafs&t="+time_+"&r="+random_+"&b=&q="+url.split("?")[1])

  var ds = time_+","+random_+","+check
  let req = new Request(url)
  req.method = "GET"
  req.headers = {
    "Cookie": iCloud.readString(CookiePath),
    "DS": ds,
    "x-rpc-app_version": "2.28.1",
    "x-rpc-client_type": "5",
  };

  let data = await req.loadJSON()
  return [data.data.list[0].game_uid,data.data.list[0].region]
}

async function getDaily(){
  let infoData = await getInfo()
  var url = `https://api-takumi-record.mihoyo.com/game_record/app/genshin/api/dailyNote?role_id=${infoData[0]}&server=${infoData[1]}`
  var time_ = String(parseInt(Date.now()/1000))
  var random_ = String(parseInt((Math.random()+1)*100000))
  var check = md5("salt=xV8v4Qu54lUKrEYFZkJhB8cuOh9Asafs&t="+time_+"&r="+random_+"&b=&q="+url.split("?")[1])

  var ds = time_+","+random_+","+check

  let req = new Request(url)
req.method = "GET"
  req.headers = {
    "Cookie": iCloud.readString(CookiePath),
    "DS": ds,
    "x-rpc-app_version": "2.28.1",
    "x-rpc-client_type": "5",
  };

  let data = await req.loadJSON()
  return data.data
}

async function getSign(){
  let info = await getInfo()
  var url = (`https://api-takumi.mihoyo.com/event/bbs_sign_reward/info?act_id=e202009291139501&region=${info[1]}&uid=${info[0]}`)
  var time_ = String(parseInt(Date.now()/1000))
  var random_ = String(parseInt((Math.random()+1)*100000))
  var check = md5("salt=xV8v4Qu54lUKrEYFZkJhB8cuOh9Asafs&t="+time_+"&r="+random_+"&b=&q="+url.split("?")[1])

  var ds = time_+","+random_+","+check

  let req = new Request(url)
req.method = "GET"
  req.headers = {
    "Cookie": iCloud.readString(CookiePath),
    "DS": ds,
    "x-rpc-app_version": "2.28.1",
    "x-rpc-client_type": "5",
  };

  let data = await req.loadJSON()
  return data.data
}

async function getGift(){
  let info = await getInfo()
  let url = `https://api-takumi.mihoyo.com/event/bbs_sign_reward/award?current_page=1&page_size=1&act_id=e202009291139501&region=${info[1]}&uid=${info[0]}`
 let req = new Request(url)
req.method = "GET"
  req.headers = {
    "Cookie": iCloud.readString(CookiePath),
  };

  let data = await req.loadJSON()
  return data.data
}

async function postSign(){
  var info = await getInfo()
  const time_ = String(parseInt(Date.now()/1000))
const random_ = md5(time_).slice(0,6)
const check = md5(`salt=ulInCDohgEs557j0VsPDYnQaaz6KJcv5&t=${time_}&r=${random_}`)
const ds = time_+","+random_+","+check
const headers = {
"Cookie": iCloud.readString(CookiePath),
"User-Agent":"Mozilla/5.0 (iPhone; CPU iPhone OS 15_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) miHoYoBBS/2.3.0",
"Referer":"https://webstatic.mihoyo.com/bbs/event/signin-ys/index.html?bbs_auth_required=true&act_id=e202009291139501&utm_source=bbs&utm_medium=mys&utm_campaign=icon",
"x-rpc-client_type": "5",
"x-rpc-app_version": "2.28.1",
"x-rpc-device_id":"BILIBILISIPOSHANGKOUDIANBILIBILI",
"DS": ds
}
  var body = {
      "act_id":"e202009291139501",
      "uid":info[0],
      "region":info[1]
  }
  let url = "https://api-takumi.mihoyo.com/event/bbs_sign_reward/sign"
  const req = new Request(url)
  req.method = "POST"
  req.url = url
  req.headers = headers
  req.body = JSON.stringify(body)
  
let data  = await req.loadJSON()
return data
}
  

async function getClock(resinTime) {
  if (resinTime == 0) {
    return "树脂已满"
  }
  let timeNow = Date.now()
  let now = new Date(timeNow)
  let hoursNow = now.getHours()
  let minutesNow = now.getMinutes() * 60 * 1000
  let secondsNow = now.getSeconds() * 1000
  let timeRecovery = new Date(timeNow + resinTime * 1000)

  let tillTommorow = (24 - hoursNow) * 3600 * 1000
  let tommorow = timeNow + tillTommorow - minutesNow - secondsNow

  let str = ""
  if (timeRecovery < tommorow) {
    str = ""
  } else {
    str = "明日"
  }

  return str + timeRecovery.getHours() + "点" + timeRecovery.getMinutes() + "分"
}




if(config.widgetFamily == "small"){
let widget = await smallWidget()
Script.setWidget(widget)

}
if(config.widgetFamily == "medium"){
  let widget = await mediumWidget()
  Script.setWidget(widget)
}
if(config.widgetFamily == "large"){
  let widget = await largeWidget()
  Script.setWidget(widget)
}
Script.complete()
