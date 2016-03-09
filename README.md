# monitor-harddisk
> 如何使用 CloudInsight 监控闭路电视系统的磁盘大小

以 HIKVision 产品为例，登录管理界面，查看 **磁盘信息**

![](./harddisk.png)

### 1\.配置闭路电视系统

打开 闭路电视系统的 **SNMP 功能**

![](./management.png)

### 2\.下载监控脚本

目前只实现了 `Node.JS` 的监控脚本，欢迎其它各种语言的 PR。

```sh
git clone git@github.com:wyvernnot/monitor-harddisk.git
cd monitor-harddisk
npm install
```

### 3\.修改配置文件

配置文件是 `config.js`，主要配置 `ip` 和 `community`，和闭路电视系统的配置一致即可。

```sh
node index.js
```

### 4\.登录 CloudInsight 配置仪表盘

**新建仪表盘**

为下面的指标创建对应的仪表盘

```txt
hikvision.system.timetics
hikvision.disk.free
hikvision.disk.total
```

**查看数据**

![](./cloudinsight.png)
