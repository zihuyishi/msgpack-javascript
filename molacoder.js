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

var Molapacker = function () {
    this.m_buffer = [];
};

Molapacker.prototype.encode = function (data_) {
    this.m_buffer.push(data_);
}

Molapacker.prototype.encodeObject = function(obj_) {
    var coder = new Molapacker();
    data_.encode(coder);
    this.m_buffer.push(coder.getBuffer());
}

Molapacker.prototype.encodeArray = function(arr_, type) {
    var i,
        subArr = [];
    if (type === 'object') {
        for (i = 0; i < arr_.length; ++i) {
            var coder = new Molapacker();
            arr_[i].encode(coder);
            subArr.push(coder.__getBuffer());
        }
        this.m_buffer.push(subArr);
    } else {
        this.encode(arr_);
    }
}

Molapacker.prototype.__getBuffer = function () {
    return this.m_buffer;
}

Molapacker.prototype.getData = function () {
    return msgpack.pack(this.m_buffer);
}

var Molaunbox = function () {
    this.m_buffer = [];
    this.m_currentLength = 0;
    this.m_capacity = 0;
}

Molaunbox.prototype.setData = function (data_) {
    this.m_buffer = msgpack.unpack(data_);
    this.m_currentLength = 0;
    this.m_capacity = this.m_buffer.length;
}

Molaunbox.prototype.__setBuffer = function (buffer_) {
    this.m_buffer = buffer_;
    this.m_currentLength = 0;
    this.m_capacity = this.m_buffer.length;
}

Molaunbox.prototype.decode = function () {
    if (this.m_currentLength < this.m_capacity) {
        var data = this.m_buffer[this.m_currentLength];
        this.m_currentLength += 1;
        return data;
    } else {
        return null;
    }
}

Molaunbox.prototype.decodeObject = function () {
    if (this.m_currentLength < this.m_capacity) {
        var obj = this.m_buffer[this.m_currentLength];
        this.m_currentLength += 1;
        var classType = 0;
        //假装知道了类型
        switch (classType) {
            default:
                var cat = new Cat();
                cat.decode(arr);
                return cat;
        }
    } else {
        return null;
    }
}

Molaunbox.prototype.decodeArray = function (type) {
    var arr = this.decode(),
        i,
        retArr = [];
    if (type === 'object' && arr !== null) {
        for (i = 0; i < arr.length; ++i) {
            var unbox = new Molaunbox();
            unbox.__setBuffer(arr[i]);
            //这里其实需要去获取到类型，现在假装是Cat
            var cat = new Cat();
            cat.decode(unbox);
            retArr.push(cat);
        }
        return retArr;
    } else {
        return arr;
    }
}