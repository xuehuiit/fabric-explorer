/*
 Copyright ONECHAIN 2017 All Rights Reserved.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */

var EventEmitter = require('events').EventEmitter;
var ledgerEvent = new EventEmitter();
var config = require('../config.json');
var sql = require('../db/mysqlservice.js');

var channels = config.channelsList;
var currchannelpeerma = {};
//var currChannel=channels[0]
var currchannelpeersmap = {};


var currOrg = '';

var currChannel='';


function changeChannel(channelName) {
    currChannel = channelName;
    ledgerEvent.emit('channgelLedger');
}

function getCurrChannel() {
    return currChannel
}

async function getChannellist() {
    let rows = await sql.getRowsBySQlNoCondtion('select channelname from channel ')

    return rows;
}


function getCurrOrg() {
   return currOrg;
}

function changeCurrOrg(orgname) {

    currOrg = orgname;

}

var getcurrchannelpeerma = ()=>{

return currchannelpeerma;
}


var changecurrchannelpeerma = (currchannelmap)=>{

    currchannelpeerma = currchannelmap;

}




var getCurrchannelpeersmap = ()=>{

    return currchannelpeersmap;
}


var changeCurrchannelpeersmap = (currchannelmap)=>{

    currchannelpeersmap = currchannelmap;

}

exports.changeCurrchannelpeersmap=changeCurrchannelpeersmap;
exports.getCurrchannelpeersmap=getCurrchannelpeersmap;


exports.getcurrchannelpeerma=getcurrchannelpeerma;
exports.changecurrchannelpeerma=changecurrchannelpeerma;

exports.getCurrChannel=getCurrChannel;
exports.changeChannel=changeChannel;
exports.ledgerEvent=ledgerEvent;
exports.getChannellist=getChannellist;

exports.getCurrOrg=getCurrOrg;
exports.changeCurrOrg=changeCurrOrg;
