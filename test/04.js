$(function (){
    // 4 $.vmodel.get() 第三個參數 callback 
    $(".content").vmodel("--content", false, function (){
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

    var result = $.vmodel.get("content", true, function (storage){
        console.log("4-2 callback: OK");
    });
    if (result === true) {
        console.log('4-1: OK');
    }
})