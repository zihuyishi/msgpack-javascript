var Cat = function () {
	this.age = 0;
	this.name = "miao";
	this.babys = [];
};

Cat.prototype.encode = function (encoder_) {
	encoder_.encode('Cat');
	encoder_.encode(this.age);
	encoder_.encode(this.name);
	encoder_.encodeArray(this.babys, 'object');
};

Cat.prototype.decode = function (decoder_) {
	var type = decoder_.decode();
	this.age = decoder_.decode();
	this.name = decoder_.decode();
	this.babys = decoder_.decodeArray('object');
};

var cat1 = new Cat();
cat1.age = 12;
cat1.name = "mother";

var cats = [];
var cat2 = new Cat();
cat2.age = 1;
cats.push(cat2);

var cat3 = new Cat();
cat3.age = 2;
cats.push(cat3);

var cat4 = new Cat();
cat4.age = 1.5;
cats.push(cat4);

cat1.babys = cats;

var packer = new Molapacker();
cat1.encode(packer);

var buffer = packer.getData();

var unpacker = new Molaunbox();
unpacker.setData(buffer);

var unboxCat = new Cat();
unboxCat.decode(unpacker);
