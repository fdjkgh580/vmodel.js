$(function (){

    // 3 $.vmodel.get() 返回的值
    // var selector = ".content";
    // $(selector).vmodel("--content_3", true, function (){
    //     var vs = this;
    //     this.autoload = ['say'];
    //     this.say = function (){
    //         vs.root.html("3");
    //         console.log(vs);
    //     }
    // });

    var selector = ".content";
    $.vmodel.create({
        selector: selector,
        model: "--content_3",
        isinit: false, 
        method: function (){
            var vs = this;
            this.autoload = ['say'];
            this.say = function (){
                vs.root.html("3");
            }
        }
    })

    var result = $.vmodel.get("content_3", true);
    if (result.selector == ".content" && $(".content").html() == 3) {
        console.log('3: OK');
    }
})