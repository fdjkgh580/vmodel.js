$(function (){
    // 2 利用 $.vmodel.get 觸發
    $.vmodel.create({
        selector: '.content',
        model: '--content_2',
        isinit: false,
        method: function (){
            var vs = this;
            this.autoload = ['init'];
            this.init = function (){
                vs.root.html("2");
            }
        }
    });
    

    $.vmodel.get("content_2", true);
    
    if ($(".content").html() == "2") {
        console.log('2: OK');
    }  
})