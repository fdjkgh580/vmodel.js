# vmodel.js
模組化 jQuery 的編寫結構，例如

    $(".box").vmodel(function (){

        // 自動掛載要觸發的方法
        this.autoload = function(){
            return ['start', 'call'];
        }

        //HTML樣式，這只是範例，正確來說不建議讓 HTML 與 JS 混雜
        this.element = function (text) {
            return "<li>" + text + "</li>";
        }
        
        //我們添加一些元素進去
        this.start = function (){
            $(".box").append(this.element("項目一"));
            $(".box").append(this.element("項目二"));
            $(".box").append(this.element("項目三"));
        }

        //綁定點擊事件
        this.call = function (){
            this.root.on("click", "li", function (){
                $(".debug").html("我是" + $(this).html());
            })
        }
    });

基本範例：http://jsfiddle.net/voef9o6t/1/
進階範例：http://jsfiddle.net/2mue24kj/