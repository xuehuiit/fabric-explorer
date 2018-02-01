# introduction

fabric explorer 是帮助大家学习、管理、监控fabric 的开源项目。

[English document](https://github.com/hyperledger/blockchain-explorer/blob/master/fabric-explorer/README.md)


## Requirements

Please follow the Pre-requisites from [Hyperledger Fabric](http://hyperledger-fabric.readthedocs.io/en/latest/prereqs.html)

Following are the software dependencies required to install and run this fabric-explorer (Please refer to the above link for specific versions)
* docker-ce 17.06.2-ce
* docker-compose 1.14.0
* golang 1.9.x
* nodejs 6.9.x
* git
* mysql 5 or greater

## 执行创建数据库脚本: db/fabricexplorer.sql

Run the database setup scripts located under `db/fabricexplorer.sql`

`mysql -u<username> -p < db/fabricexplorer.sql`


## 设置fabric docker运行环境

1. `git clone https://github.com/onechain/fabric-docker-compose-svt.git`
2. `mv fabric-docker-compose-svt $GOPATH/src/github.com/hyperledger/fabric/examples/`
3. `cd $GOPATH/src/github.com/hyperledger/fabric/examples/fabric-docker-compose-svt`
4. `./download_images.sh`
5. `./start.sh`


## 启动fabric 浏览器

1. `git clone https://github.com/hyperledger/blockchain-explorer.git`
2. `cd blockchain-explorer`


3. 修改 config.json ,配置节点信息

```json
 {

   "orgs": [{  //系统中所有的组织
      "name": "org1",   //组织名称
      "mspid": "Org1MSP", //组织的mspid
      "peers": [   //组织中包含的Peer
         {
            "name": "peer1",
            "requests": "192.168.23.212:7051",
            "events": "192.168.23.212:7053",
            "serverhostname": "peer0.org1.robertfabrictest.com",
            "tls_cacerts": "/project/opt_fabric/fabricconfig/crypto-config/peerOrganizations/org1.robertfabrictest.com/peers/peer0.org1.robertfabrictest.com/tls/ca.crt"
         },
         {
            "name": "peer2",
            "requests": "172.16.10.186:7051",
            "events": "172.16.10.186:7053",
            "serverhostname": "peer1.org1.robertfabrictest.com",
            "tls_cacerts": "/project/opt_fabric/fabricconfig/crypto-config/peerOrganizations/org1.robertfabrictest.com/peers/peer1.org1.robertfabrictest.com/tls/ca.crt"
         },
         {
            "name": "peer3",
            "requests": "172.16.10.187:7051",
            "events": "172.16.10.187:7053",
            "serverhostname": "peer2.org1.robertfabrictest.com",
            "tls_cacerts": "/project/opt_fabric/fabricconfig/crypto-config/peerOrganizations/org1.robertfabrictest.com/peers/peer2.org1.robertfabrictest.com/tls/ca.crt"
         }

      ],
      "admin": {  //组织管理员张的证书和私钥
         "key": "/project/opt_fabric/fabricconfig/crypto-config/peerOrganizations/org1.robertfabrictest.com/users/Admin@org1.robertfabrictest.com/msp/keystore",
         "cert": "/project/opt_fabric/fabricconfig/crypto-config/peerOrganizations/org1.robertfabrictest.com/users/Admin@org1.robertfabrictest.com/msp/signcerts"
      }
   }],

   "orderer": [{   //Order节点的信息
      "url": "192.168.23.212:7050",
      "serverhostname": "orderer.robertfabrictest.com",
      "tls_cacerts": "/project/opt_fabric/fabricconfig/crypto-config/ordererOrganizations/robertfabrictest.com/orderers/orderer.robertfabrictest.com/tls/ca.crt"
   }],

   "host": "localhost",  //当前服务器的地址
   "port": "8080",  //当前服务器的节点
   "keyValueStore": "/project/ws_nodejs/fabric_sdk_node_studynew/fabric-client-kvs",  //私钥的存放位置，
   "eventWaitTime": "30000",
   "enableTls":false,  //是否启用TLS模式
   "loglevel":"ERROR",  //系统日志级别
   "mysql": {   //数据库的相关配置
      "host": "localhost",
      "port": "3306",
      "database": "blockchainexplorer",
      "username": "root",
      "passwd": "123456"
   }
}

```

4. `npm install`
5. `./start.sh`

Launch the URL http://localhost:8080 on a browser.

## 系统截图

这是系统的截图

![Fabric Explorer](https://raw.githubusercontent.com/robertfeng1980/gitresource/master/b1.png)

![Fabric Explorer](https://raw.githubusercontent.com/robertfeng1980/gitresource/master/b1.png)

![Fabric Explorer](https://raw.githubusercontent.com/robertfeng1980/gitresource/master/b1.png)


