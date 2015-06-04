var msg_encoder = function () {
    var that = {};
    var obj = new Object();

    that.push = function (name, data) {
        obj[name] = (typeof data === 'function' && undefined) || data;
    };

    that.toString = function () {
        return msgpack.pack(obj, true);
    };
    that.toArray = function () {
        return msgpack.pack(obj);
    }

    return that;
};
var msg_decoder = function (data) {
    var that = {};
    var obj = msgpack.unpack(data);

    that.get = function (name) {
        return obj[name];
    }

    return that;
};