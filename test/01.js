$(function (){
    // 1 基本
    $(".content").vmodel("--content_1", true, function (){
        var vs = this;
        this.autoload = ['say'];
        this.say = function (){
            vs.root.html("1");
        }
    });

    if ($(".content").html() == "1") {
        console.log('1: OK');
    }
})