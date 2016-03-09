/**
 * Created by yan on 16-3-9.
 */
var dgram = require('dgram');
var snmp = require('snmp-native');
var parseOID = require('./util').parseOID;
var client = dgram.createSocket('udp4');

// 各种配置项

var host = "192.168.0.45";
var community = "public";
var oids = [
  parseOID("1.3.6.1.4.1.50001.1.241.1.3.1.0"),
  parseOID("1.3.6.1.4.1.50001.1.241.1.5.1.0"),
  parseOID("1.3.6.1.2.1.1.3.0")
];
var oneapmStatsDport = 8251;
var prefix = "hkvision";

/**
 * 新建一个连接到监控系统的回话
 * @type {*|Session}
 */
var session = new snmp.Session({
  host: host,
  community: community,
});

/**
 * 把数据发往本机的 OneAPM StasD 服务
 * @param msg
 */
var sendToDaemon = function (msg) {
  msg = prefix + "." + msg
  console.log('DEBUG ', new Date, msg);

  var payload = new Buffer(msg);
  client.send(payload, 0, payload.length, oneapmStatsDport, 'localhost', err=> {
    if (err) {
      console.error(arguments);
    }
  })
}

/**
 * 收集并发送监控系统磁盘的信息
 */
function collectHarddiskInfomation() {
  session.getAll({oids: oids}, function (err, res) {
    if (err) {
      console.error(arguments);
    } else {
      sendToDaemon(`disk.free:${res[0].value * 1000 * 1000}|g|#ip:${host}`)
      sendToDaemon(`disk.total:${res[1].value * 1000 * 1000}|g|#ip:${host}`)
      sendToDaemon(`system.timeticks:${res[2].value}|g|#ip:${host}`)
    }
  })
}

/**
 * main
 */
collectHarddiskInfomation();
setInterval(collectHarddiskInfomation, 10000);