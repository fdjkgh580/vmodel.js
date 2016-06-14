$(function (){

    // // 1 基本
    $.vmodel.create({
        selector: '.content',
        model: '--content',
        isinit: true,
        method: function (){
            var vs = this;
            this.autoload = ['say'];
            this.say = function (){
                vs.root.html("1");
            }
        }
    });
    

    $.vmodel.create({
        selector: '.content',
        model: '--content_1_2',
        isinit: false,
        method: function (){
            var vs = this;
            this.autoload = ['say'];
            this.say = function (){
                vs.root.html("2");
            }
        }
    });
    

    if ($(".content").html() == "1") {
        console.log('1_1');
    }
    
    $.vmodel.create({
        selector: '.content',
        model: '--content_1_3',
        isinit: true,
        method: function (){
            var vs = this;
            this.autoload = function (){
                return ['say'];
            };
            this.say = function (){
                vs.root.html("3");
            }
        }
    });
    

    if ($(".content").html() == "3") {
        console.log('1_2');
        console.log('1: OK');
    }

   
   

})