$(function (){
    // 建立目錄
            $(".dir").vmodel(".dir", "--dir", false, function (){
                var vs = this;
                this.autoload = ['create', 'goto'];
                this.create = function (){
                    var ary = $.vmodel.get("doctitle").get();
                    console.log(ary)
                    vs.set(ary);
                }
                //建立目錄
                this.set = function (ary){
                    var html = '';
                    $.each(ary, function (key, text){
                        html += '<li><a class="goto" data-goto="' + key + '" href="">' + text + '</a></li>';
                    });
                    vs.root.html(html);
                }
                
                // 綁定前往
                this.goto = function (){
                    vs.root.on("click", ".goto", function (){
                        var eq = $(this).attr("data-goto");
                        $.vmodel.get("doctitle").go(eq);
                        return false;
                    });
                    
                }
            });

            //內文標題
            $(".container").vmodel(".container", "--doctitle", false, function (){
                var vs = this;
                this.autoload = [];
                this.get = function (){
                    var mix = [];
                    vs.root.find("h1").each(function (key, ele){
                        mix[key] = $(ele).text().trim();
                    })
                    return mix;
                }
                // 前往
                this.go = function (eq){
                    var px = vs.root.find("h1").eq(eq).offset().top;
                    $("body").animate({
                        scrollTop : px
                    });
                    console.log(top);
                }
            });
            $.vmodel.get("dir", true);
})