/**
 * Created by yan on 16-3-9.
 */
var dgram = require('dgram');
var snmp = require('snmp-native');
var parseOID = require('./util').parseOID;
var client = dgram.createSocket('udp4');

// 读取配置项
var config = require('./config');

/**
 * 新建一个连接到监控系统的回话
 * @type {*|Session}
 */
var session = new snmp.Session({
  host: config.ip,
  community: config.community,
  port: config.port
});

/**
 * 把数据发往本机的 OneAPM StasD 服务
 * @param msg
 */
var sendToDaemon = function (msg) {
  msg = config.prefix + "." + msg
  console.log('DEBUG ', new Date, msg);

  var payload = new Buffer(msg);
  client.send(payload, 0, payload.length, config.oneapmStatsDport, 'localhost', err=> {
    if (err) {
      console.error(arguments);
    }
  })
}

/**
 * 收集并发送监控系统磁盘的信息
 */
function collectHarddiskInfomation() {
  session.getAll({oids: config.oids.map(parseOID)}, function (err, res) {
    if (err) {
      console.error(arguments);
    } else {
      sendToDaemon(`disk.free:${res[0].value * 1000 * 1000}|g|#ip:${config.ip}`)
      sendToDaemon(`disk.total:${res[1].value * 1000 * 1000}|g|#ip:${config.ip}`)
      sendToDaemon(`system.timeticks:${res[2].value}|g|#ip:${config.ip}`)
    }
  })
}

/**
 * main
 */
collectHarddiskInfomation();
setInterval(collectHarddiskInfomation, 10000);