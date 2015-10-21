$(function (){
    // 1 基本
    // $(".content").vmodel("--content_1_1", true, function (){
    //     var vs = this;
    //     this.autoload = ['say'];
    //     this.say = function (){
    //         vs.root.html("1");
    //     }
    // });

    // $(".content").vmodel("--content_1_2", false, function (){
    //     var vs = this;
    //     this.autoload = ['say'];
    //     this.say = function (){
    //         vs.root.html("2");
    //     }
    // });

    // $(".content").vmodel("--content_1_3", false, function (){
    //     var vs = this;
    //     this.autoload = function (){
    //         vs.say();
    //         return ['say2'];
    //     };
    //     this.say = function (){
    //         vs.root.html("3_1");
    //     }
    //     this.say2 = function (){
    //         vs.root.html("3_2");
    //     }
    // });

    // if ($(".content").html() == "1") {
    //     console.log('1: OK');
    // }
    $(".content").vmodel("--my", false, function (){
        var vs = this;

        this.autoload = function (){
            console.log('before');
            return ['say']
        }

        this.say = function (string){
            if (!string) string = '';
            console.log("Hi, " + string)
        }
    });  

    $.vmodel.get("my", true);
    
    
})