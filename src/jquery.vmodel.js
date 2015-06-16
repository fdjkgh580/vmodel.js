/**
 * v 1.1
 * 在 function 中可使用擴增的屬性
 *
 * this.root    會得到 $(selector);
 * this.select  會得到 $(selector) 中的 selector
 */
(function ($) {

    $.vmodel = {};

    // 實體化的存放倉儲，提供內部呼叫。
    $.vmodel.storage = {}; 

    /**
     * 取得倉儲
     * @param   string name (選) 倉儲的存放名稱。當為空時，返回所有倉儲
     * @return  object
     */
    $.vmodel.get = function (name){

        if (!name) {
            return $.vmodel.storage;
        }

        var target = $.vmodel.storage[name];
        
        if (!target) {
            console.log("呼叫的倉儲名稱 "+ name +" 不存在。");
            return false;
        }

        return $.vmodel.storage[name];
    }

    /**
     * 主要模式
     * @param  mix       p_1 若是 string 倉儲命名；若是 function 代表準備在內部實體化的方法 
     * @param  function  p_2 (選用) 若 p_1 為 string，就必須使用 p_2
     * @return this      
     */
    $.fn.vmodel = function(p_1, p_2) {

        // 內部
        var _local   = this;
        
        // 選擇器
        var selector = _local.selector;

        // 若第一個參數為倉儲命名
        if ($.type(p_1) == "string") {
            var obj      = new p_2();
        }
        else {
            // 這是使用者定義的function, 我們將他實體化
            var obj      = new p_1();
        }

        // 擴充，外部不可使用這些關鍵字
        obj.selector = selector;
        obj.root     = $(selector);



        /**
         * 錯誤訊息
         * @param   method_name 提示錯誤的 function 名稱
         * @param   msg         錯誤訊息    
         */
        this.msg_error = function (method_name, msg){

            console.log("發生錯誤。『" + selector + "』呼叫的 function 『" + method_name + "』：" + msg);

        }

        /**
         * 批次呼叫可自動掛載的 function
         * @param   ary    需要觸發的 function 名稱
         */
        this.each_autoload_fun = function (ary){

            $.each(ary, function(key, name) {

                if ($.type(obj[name]) != "function") {
                    _local.msg_error(name, "不存在。");
                }

                obj[name]();
            });
        }

        // 若有設定 autocall() 就會自動呼叫
        this.autocall = function (){
            

            if (obj.autoload) {

                var type = $.type(obj.autoload);

                if (type == "function") {
                    var ary = obj.autoload();
                }
                else if (type == "array") {
                    var ary = obj.autoload;
                }
                else {
                    _local.msg_error("autoload", "格式錯誤，型態只能是 function 或 array。")
                }

                _local.each_autoload_fun(ary);
            }
            

        }

        this.main = function (){

            // 觸發自動讀取
            _local.autocall(obj)

            return obj;
        }

        var result = this.main();

        // 放入倉儲
        if ($.type(p_1) == "string") {
            $.vmodel.storage[p_1] = result;
        }

        // 返回實體化的，可供外部調用
        return this;
    }


    

}( jQuery ));