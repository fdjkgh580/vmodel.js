$(function (){
    // 2 利用 $.vmodel.get 觸發
    $(".content").vmodel("--content_2", false, function (){
        var vs = this;
        this.autoload = ['say'];
        this.say = function (){
            vs.root.html("2");
        }
    });

    $.vmodel.get("content_2", true);
    if ($(".content").html() == "2") {
        console.log('2: OK');
    }  
})