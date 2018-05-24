(function ($) {

    /**
     * 取得倉儲
     * @param   string            model_name    (選) 倉儲的存放名稱。當為空時，返回所有倉儲
     * @param   bool              p_2     (選) 預設 false, 是否觸發倉儲 autoload
     * @param   function | bool   p_3     (選) 是否啟用監聽並添加視覺化屬性。
     *                                         注意，這是非同步。
     *                                         function :   監聽直到完成模組後會觸發 callback，並夾帶了該倉儲。
     *                                         true :       true 僅啟用監聽。
     *                                         
     * @return  object
     */
    $.vmodel.get = function (model_name, p_2, p_3){

        var local = this;

        // 判斷是否可以觸發回調 callback，
        // 條件式當所有狀態都是 true
        this.chk_trigger_callback = function (obj){

            var allow = true;

            $.each(obj.fun_struct, function(index, bool) {

                // 如果遇到沒有初始化的，就終止檢查
                if (bool == false) {
                    allow = false;
                    return false;
                }

            });

            // 如果不允許就離開
            // 若 autoload 中的方法都已經建構完成，那就可以呼叫回調 
            return (allow == false) ? false : true;
        }


        // 視覺化屬性
        this.display_attr = function (model_name, target_obj){

            var d = new Date();

            // 建立一個物件
            var data = [{
                vname: model_name, // 倉儲名稱
                status: true, // 完成
                timestamp : Date.parse(d) + "." + d.getMilliseconds(), //時間戳記
            }];


            // 視覺狀態是否存在, 若存在代表已經有倉儲也是綁定在這個元素，而且已完成。
            // 這時候就合併已存在的，與新的。
            var attr = target_obj.root.attr("data-vmodel-history");
            if (attr) {
                var dej = $.parseJSON(attr);
                dej.push(data[0]); // 務必使用 data[0] 剝除外面的陣列。
                data = dej;
            }


            //視覺狀態
            var encode = JSON.stringify(data);
            target_obj.root.attr("data-vmodel-history", encode); 
        }

        // 僅做對應參數的輔助
        this.param_match = function (model_name, p_2, p_3) {
            var returnary = [];
            var type_name = $.type(model_name);

            // 返回所有倉儲
            if (!model_name) {
                returnary = [model_name, null, null];
            }
            // 指定一個倉儲名稱
            else if (type_name == "string") {
                returnary = [model_name, p_2, p_3];
            }

            return returnary;
        }

        // 重新命名
        var pary     = local.param_match(model_name, p_2, p_3);
        var model_name     = pary[0];
        var autoload = pary[1];
        var listen   = pary[2];
        pary = p_2 = p_3 = null;


        // 返回所有倉儲
        if (!model_name) {
            return $.vmodel.api.obj_sort($.vmodel._storage);
        }

        var target_obj = $.vmodel._storage[model_name];
        
        // 呼叫的倉儲並不存在
        if (!target_obj) {
            console.log("呼叫的倉儲名稱 "+ model_name +" 不存在。");
            return false;
        }

        // 若參數2指定 bool 且為 true 的時候，會前往判斷，是否要觸發剛取得模組的 autoload()，若有就會優先觸發
        if ($.type(autoload) == "boolean" && autoload == true) {

            // 觸發 autoload()
            var result = $.vmodel.api.get_autoload_funame(target_obj);
            var fnameary = result.data;
            
            var result   = $.vmodel.api.is_trigger_autoload(target_obj, fnameary);

            // 若有啟用監聽或回調函數
            var type_listen = $.type(listen);
            if (type_listen == "function" || (type_listen == "boolean" && listen == true)) {

                // 若是回調
                if (type_listen == "function") {
                    // 必須先擴充到該模組底下，避免多個倉儲會互相干擾
                    target_obj.vmodel_get_callback = function (){
                        listen(target_obj);
                    }
                }


                //監聽
                var iid = setInterval(function (){

                    // 若全部狀態都完成
                    if (local.chk_trigger_callback(target_obj) == true) {
                        clearInterval(iid);

                        // 視覺化添加屬性
                        local.display_attr(model_name, target_obj);

                        // 觸發回調
                        if (type_listen == "boolean") return true;
                        target_obj.vmodel_get_callback();
                    }

                }, 20);

                return true
            }
        }

        // 無論是否觸發使用者的 autoload(), 最後都會返回該實體化的物件
        return $.vmodel._storage[model_name];
    }

}( jQuery ));