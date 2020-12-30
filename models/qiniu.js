const qiniu = require('qiniu')
const { accessKey, secretKey } = require('../config/secret')

var ppp = {
    getQiniuToken: function () {
        var mac = new qiniu.auth.digest.Mac(accessKey, secretKey)
        // const mac = new qiniu.auth.digest.Mac(QINIU_ACCESS_KEY, QINIU_SECRET_KEY)
        const options = {
            scope: 'hssblog',
            returnBody: '{"key":"$(key)","hash":"$(etag)","fsize":$(fsize),"bucket":"$(bucket)","name":"$(x:name)"}'
        };
        const putPolicy = new qiniu.rs.PutPolicy(options)
        const uploadToken = putPolicy.uploadToken(mac)
        return uploadToken
    },
    del: function (filename) {
        var mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
        var config = new qiniu.conf.Config();
        //config.useHttpsDomain = true;
        config.zone = qiniu.zone.Zone_z0;
        var bucketManager = new qiniu.rs.BucketManager(mac, config);

        var bucket = "hssblog";
        var key = filename;
        return new Promise((resolve, reject) => {
            bucketManager.delete(bucket, key, function (err, respBody, respInfo) {
                if (respInfo.statusCode == 200) {
                    resolve(1)
                } else {
                    reject(0)
                }
            })
        })
    },
    getList: function (prefix, limit, marker) {
        var mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
        var config = new qiniu.conf.Config();
        //config.useHttpsDomain = true;
        config.zone = qiniu.zone.Zone_z0;
        var bucketManager = new qiniu.rs.BucketManager(mac, config);
        var bucket = "hssblog";
        var options = {
            prefix,
            limit,
            marker
        };
        return new Promise((resolve, reject) => {

            bucketManager.listPrefix(bucket, options, function (err, respBody, respInfo) {
                if (respInfo.statusCode == 200) {
                    resolve({ respInfo })
                } else {
                    reject(err)
                }
            })
        })
    },
    updateQiniu: function (srcBucket, srcKey, destBucket, destKey) {
        var mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
        var config = new qiniu.conf.Config();
        //config.useHttpsDomain = true;
        config.zone = qiniu.zone.Zone_z0;
        var bucketManager = new qiniu.rs.BucketManager(mac, config);

        // var srcBucket;      //源空间
        // var srcKey;        //源空间文件
        // var destBucket;    //目标空间
        // var destKey;       //目标空间文件

        // 强制覆盖已有同名文件
        var options = {
            force: false,    //true强制覆盖/false:不强制覆盖
        }
        return new Promise((resolve, reject) => {
            bucketManager.move(srcBucket, srcKey, destBucket, destKey, options, function (err, respBody, respInfo) {
                if (respInfo.statusCode == 200) {
                    resolve({ respInfo })
                } else {
                    reject(err)
                }
            })
        })
    }
}

module.exports = ppp