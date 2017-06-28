var Stats = require('fast-stats').Stats;

class Metrics {
    constructor(size=10){
        this.size=size
        this.stats=new Stats()
    }

    push(n){
        while(this.stats.length>this.size){
            this.stats.shift()
        }
        this.stats.push(n)
    }

    sum(){
        console.info(this.stats.range())
        return this.stats.sum
    }

    clean(){
        this.stats.clean()
    }
}

var txMetrics=new Metrics(12)
var blockMetrics=new Metrics(12)

exports.Metrics=Metrics
exports.txMetrics=txMetrics
exports.blockMetrics=blockMetrics