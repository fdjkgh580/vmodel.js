$(function (){
    // 6
    $(".content").vmodel("--content2", false, function (){
        var vs = this;
        this.autoload = ['say', 'hello'];
        this.say = function (){
            vs.root.html(null);
            vs.struct('say', true);
        }

        this.hello = function (){
            vs.root.html("5");
            vs.struct('hello', true);
        }
    });

    var result = $.vmodel.get("content2", true, function (storage){
        if (storage.selector == ".content" && $(".content").html() == 5) {
            console.log("7: callback OK");
            // console.log($.vmodel.get());
        }
    });
    if (result === true) {
        console.log('6: OK');
    }
})