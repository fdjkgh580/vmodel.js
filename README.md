# vmodel.js
模組化 jQuery 的編寫結構

    $(".box").vmodel(function (){

        // 自動掛載要觸發的方法
        this.autoload = function(){
            return ['start', 'call'];
        }

        this.element = function (text) {
            return "<li>" + text + "</li>";
        }

        this.start = function (){
            $(".box").append(this.element("項目一"));
            $(".box").append(this.element("項目二"));
            $(".box").append(this.element("項目三"));
        }

        this.call = function (){
            this.root.on("click", "li", function (){
                $(".debug").html("我是" + $(this).html());
            })
        }
    });