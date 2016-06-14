$(function (){
    // 5 同 04.js 測試當2個模組綁定在同一個元素，是否有問題
    $.vmodel.create({
        selector: '.content',
        model: '--content_5',
        isautoload: false,
        method: function (){
            var vs = this;
            this.autoload = ['say', 'hello'];
            this.say = function (){
                vs.root.html(null);
                vs.struct('say', true);
            }

            this.hello = function (){
                vs.struct('hello', true);
            }
        }
    });
    

    var result = $.vmodel.get("content_5", true, function (storage){
        console.log("5-2 callback");
        console.log("5: OK");
    });
    if (result === true) {
        console.log('5-1');
    }
})