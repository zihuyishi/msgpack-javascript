function printView(view) {
    var frame = view.getFrame();
    var origin = frame.origin;
    var size = frame.size;
    document.writeln(view.className + " origin is (" + origin.x + ", "
     + origin.y + ") and size is (" + size.width + ", " + size.height + ")");
}

function printButton(button) {
    printView(button);
    document.writeln("the title of " + button.className + " is " + button.title);
}

function printLinkLabel(linkLabel) {
    printView(linkLabel);
    document.writeln("the text of <b>" + linkLabel.className + "</b> is " + linkLabel.text);
    document.writeln("the url of <b>" + linkLabel.className + "</b> is " + linkLabel.url);
}

function printTextView(textView) {
    printView(textView);
    document.writeln("the text of <b>" + textView.className + "</b> is " + textView.getText());
}

function printPassowrdView(passwordView) {
    printView(passwordView);
    document.writeln("the password of <b>" + passwordView.className + 
        "</b> is <sub>" + passwordView.getText() + "</sub>");
}

var encoder1 = msg_encoder();
var view1 = new View(RectMake(0, 0, 200, 100));
view1.encode(encoder1);

var data1 = encoder1.toArray();
var decoder1 = msg_decoder(data1);
var view2 = new View(RectMake(1,1,1,1));
view2.decode(decoder1);
printView(view2);


var button1 = new Button(RectMake(20, 20, 100, 44));
button1.title = "test button";
var encoder2 = msg_encoder();
button1.encode(encoder2);

var data2 = encoder2.toString();
var decoder2 = msg_decoder(data2);
var button2 = new Button(RectMake(1, 1, 1, 1));
button2.decode(decoder2);
printButton(button2);

var link = new LinkLabel("mola", "http://babel.cc/");
var linkEncoder = msg_encoder();
link.encode(linkEncoder);

var linkData = linkEncoder.toString();
var linkDecoder = msg_decoder(linkData);
var link2 = new LinkLabel("", "");
link2.decode(linkDecoder);
printLinkLabel(link2);

var textView1 = textViewWithText("this is a test");
var textEncoder = msg_encoder();
textView1.encode(textEncoder);

var textData = textEncoder.toArray();
var textDecoder = msg_decoder(textData);
var textView2 = textView();
textView2.decode(textDecoder);
printTextView(textView2);

var passwordView1 = passwordView();
passwordView1.append('123456');
var passwordEncoder = msg_encoder();
passwordView1.encode(passwordEncoder);

var passwordData = passwordEncoder.toArray();
var passwordDecoder = msg_decoder(passwordData);
var passwordView2 = passwordView();
passwordView2.decode(passwordDecoder);
printPassowrdView(passwordView2);
