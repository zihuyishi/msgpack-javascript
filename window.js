var Point = function (x, y) {
    this.x = x;
    this.y = y;
};

var Size = function (width, height) {
    this.width = width;
    this.height = height;
};

var Rect = function (origin, size) {
    this.origin = origin;
    this.size = size;
};

function RectMake (x, y, width, height) {
    var origin = new Point (x, y);
    var size = new Size(width, height);
    return new Rect(origin, size);
}

var RectZero = RectMake(0, 0, 0, 0);

var Color = function (r, g, b, a) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
};

Color.prototype.white = function () {
    return new Color (1, 1, 1, 1);
}
Color.prototype.black = function () {
    return new Color (0, 0, 0, 1);
}
Color.prototype.clear = function () {
    return new Color (0, 0, 0, 0);
}

var Controller = function () {

};

Controller.prototype.className = "Controller";
Controller.prototype.superior = function (name) {
    var that = this,
        method = that[name];
    return function() {
        return method.apply(that, arguments);
    }
}
/*
    @param encoder's type is msg_encoder
*/
Controller.prototype.encode = function (encoder) {
    encoder.push ('className', this.className);
};
/*
    @param decoder's type is msg_decoder
*/
Controller.prototype.decode = function (decoder) {
    this.className = decoder.get ('className');
};


/**
    @param frame' type is Rect
*/
var View = function (frame) {
    Controller.apply(this, arguments);
    this.origin = frame.origin;
    this.size = frame.size;
    this.backgroundColor = Color.prototype.clear();
};

View.prototype = new Controller();
View.prototype.constructor = View;
View.prototype.className = "View";
View.prototype.encode = function (encoder) {
    Controller.prototype.encode.apply(this, arguments);
    encoder.push ('origin', this.origin);
    encoder.push ('size', this.size);
    encoder.push ('backgroundColor', this.backgroundColor);
};
View.prototype.decode = function (decoder) {
    Controller.prototype.decode.apply(this, arguments);
    this.origin = decoder.get ('origin');
    this.size = decoder.get('size');
    this.backgroundColor = decoder.get('backgroundColor');
};
View.prototype.setFrame = function (frame) {
    this.origin = frame.origin;
    this.size = frame.size;
};
View.prototype.getFrame = function () {
    return new Rect(this.origin, this.size);
};

/**
    @param frame' type is Rect
*/
var Button = function(frame) {
    View.apply(this, arguments);
    this.title = "Button";
};

Button.prototype = new View(RectZero);
Button.prototype.constructor = Button;
Button.prototype.className = "Button";

Button.prototype.encode = function(encoder) {
    View.prototype.encode.apply(this, arguments);
    encoder.push('title', this.title);
}

Button.prototype.decode = function(decoder) {
    View.prototype.decode.apply(this, arguments);
    this.title = decoder.get('title');
}

var Label = function(text) {
    View.call(this, RectZero);
    this.text = text;
}

Label.prototype = new View(RectZero);
Label.prototype.constuctor = Label;
Label.prototype.className = "Label";
Label.prototype.encode = function(encoder) {
    View.prototype.encode.apply(this, arguments);
    encoder.push('text', this.text);
}
Label.prototype.decode = function(decoder) {
    View.prototype.decode.apply(this, arguments);
    this.text = decoder.get('text');
}

var LinkLabel = function(text, url) {
    Label.call(this, text);
    this.url = url;
}
LinkLabel.prototype = new Label("");
LinkLabel.prototype.constructor = LinkLabel;
LinkLabel.prototype.className = "LinkLabel";
LinkLabel.prototype.encode = function(encoder) {
    Label.prototype.encode.apply(this, arguments);
    encoder.push('url', this.url);
}
LinkLabel.prototype.decode = function(decoder) {
    Label.prototype.decode.apply(this, arguments);
    this.url = decoder.get('url');
}

var textViewWithText = function(text) {
    var that = new View(RectZero);
    that.className = "TextView";
    that.getText = function() {
        return text;
    };
    that.setText = function(newValue) {
        text = newValue;
    };
    that.encode = function(encoder) {
        View.prototype.encode.call(that, encoder);
        encoder.push('text', text);
    };
    that.decode = function(decoder) {
        View.prototype.decode.call(that, decoder);
        text = decoder.get('text');
    };
    return that;
}

var textView = function() {
    var that = textViewWithText("");
    return that;
}

var passwordView = function() {
    var that = textView(),
        placeholder = '*',
        password = "",
        super_encode = that.superior('encode'),
        super_decode = that.superior('decode');

    function setPassword(password_) {
        password = password_;
        that.setText(password);
    }

    that.append = function (c) {
        setPassword(password + c);
    };
    that.clear = function () {
        setPassword("");
    };

    that.encode = function (encoder) {
        super_encode(encoder);
        encoder.push('password', password);
    };
    that.decode = function (decoder) {
        super_decode(decoder);
        setPassword(decoder.get('password'));
    }

    return that;
}