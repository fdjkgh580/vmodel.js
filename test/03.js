$(function (){
    // 3 $.vmodel.get() 返回的值
    $(".content").vmodel("--content_3", false, function (){
        var vs = this;
        this.autoload = ['say'];
        this.say = function (){
            vs.root.html("3");
        }
    });
    var result = $.vmodel.get("content_3", true);
    if (result.selector == ".content" && $(".content").html() == 3) {
        console.log('3: OK');
    }
})