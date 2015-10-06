    $(function (){
        $(window).vmodel("--scroll", true, function (){
            var vs = this;
            this.autoload = ['bind'];
            this.bind = function (){
                vs.root.scroll(function (){
                    var mtop = vs.root.scrollTop();
                    var header = $.vmodel.get("header")
                    if (mtop > 150) {
                        header.min();
                    } 
                    else {
                        header.max();
                    }
                })
            }
        });


        $("header").vmodel("--header", true, function (){
            var vs = this;


            this.autoload = []


            this.min = function (){
                vs.hide_bar();
            }

            this.max = function (){
                vs.show_bar();
            }

            this.min_logo = function (){
                vs.root.find(".logo").css({
                    position: 'fixed',
                    left: 0,
                    right:0,
                    top:0,
                    fontSize: "20px",
                    zIndex: 10
                })
            }
            this.max_logo = function (){
                vs.root.find(".logo").removeAttr('style');
            }

            this.lock_set = function (bool){
                vs.root.find(".logobar").attr("data-lock", bool);
            }

            this.hide_bar = function (){
                if (vs.root.find(".logobar").attr("data-lock") == "true") return false;
                if (vs.root.hasClass('min')) return false;
                vs.lock_set(true);

                vs.root.find(".logobar").animate({
                    'opacity': 0
                }, 0, function (){
                    vs.root.addClass("min");
                    vs.min_logo();
                    vs.lock_set(false);
                })
            }
            this.show_bar = function (){
                if (!vs.root.hasClass('min')) return false;
                vs.max_logo();

                var h = vs.default_height;
                vs.root.find(".logobar").animate({
                    'opacity': 1
                }, function (){
                    vs.root.removeClass("min");
                })
            }
        });
        
        // 建立目錄
        $(".dir").vmodel("--dir", false, function (){
            var vs = this;
            this.autoload = ['create'];
            this.create = function (){
                var ary = $.vmodel.get("doctitle").get();
                vs.set(ary);
            }
            this.set = function (ary){
                var html = '';
                $.each(ary, function (key, text){
                    html += '<li>' + text + '</li>';
                });
                vs.root.html(html);
            }
        });

        //內文標題
        $(".container").vmodel("--doctitle", false, function (){
            var vs = this;
            this.autoload = [];
            this.get = function (){
                var mix = [];
                vs.root.find("h2").each(function (key, ele){
                    mix[key] = $(ele).text().trim();
                })
                return mix;
            }
        });
        $.vmodel.get("dir", true);
        
        
        
        
    })
