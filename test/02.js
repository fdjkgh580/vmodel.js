$(function (){
    // 2
    $(".content").vmodel("--content", false, function (){
        var vs = this;
        this.autoload = ['say'];
        this.say = function (){
            vs.root.html("2");
        }
    });

    $.vmodel.get("content", true);
    if ($(".content").html() == "2") {
        console.log('2: OK');
        $.vmodel.delete();
    }  
})