$(function (){
    // 3
    $(".content").vmodel("--content", false, function (){
        var vs = this;
        this.autoload = ['say'];
        this.say = function (){
            vs.root.html("3");
        }
    });
    var result = $.vmodel.get("content", true);
    if (result.selector == ".content" && $(".content").html() == 3) {
        console.log('3: OK');
        $.vmodel.delete();
    }
})