$(function (){

    // 6 vs.struct() 使用陣列指定名稱
    $.vmodel.create({
        selector: '.content',
        model: '--content_6_1',
        isautoload: false,
        method: function (){
            var vs = this;
            this.autoload = ['say'];
            this.say = function (){
                vs.struct('say');
            }
        }
    });
    
    $result = $.vmodel.get("content_6_1", true, function (){
        console.log('6-1');
    });

    //
    $.vmodel.create({
        selector: '.content',
        model: '--content_6_2',
        isautoload: true,
        method: function (){
            var vs = this;
            this.autoload = ['say', 'hello'];
            this.say = function (){
            }
            this.hello = function (){
                vs.struct(['say', 'hello']);
            }
        }
    });
    
    
    $result = $.vmodel.get("content_6_2", true, function (){
        console.log('6-2');
        console.log('6: OK');
    });

    // 不使用 vs.struct() 就不會觸發
    $.vmodel.create({
        selector: '.content',
        model: '--content_6_3',
        isautoload: false,
        method: function (){
            var vs = this;
            this.autoload = ['say', 'hello'];
            this.say = function (){
            }
            this.hello = function (){
            }
        }
    });
    
    $result = $.vmodel.get("content_6_3", true, function (){
        console.log('6: error');
    });
})