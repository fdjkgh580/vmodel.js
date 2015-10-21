$(function (){
    // // 1 基本
    $(".content").vmodel("--content_1_1", true, function (){
        var vs = this;
        this.autoload = ['say'];
        this.say = function (){
            vs.root.html("1");
        }
    });

    $(".content").vmodel("--content_1_2", false, function (){
        var vs = this;
        this.autoload = ['say'];
        this.say = function (){
            vs.root.html("2");
        }
    });

    if ($(".content").html() == "1") {
        console.log('1_1');
    }
    
    
    $(".content").vmodel("--content_1_3", true, function (){
        var vs = this;
        this.autoload = function (){
            var custom_name = 'say';
            return [custom_name]
        }
        this.say = function (){
            vs.root.html("3");
        }
    });

    if ($(".content").html() == "3") {
        console.log('1_2');
        console.log('1: OK');
    }

   

})