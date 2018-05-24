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
        this.is_trigger_callback = function (obj){

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

        // 添加到結束紀錄盒
        this.push_endbox = function (model_name){
            var d = new Date();

            // 建立一個物件
            var data = [{
                vname: model_name, // 倉儲名稱
                status: true, // 完成
                timestamp : Date.parse(d) + "." + d.getMilliseconds(), //時間戳記
            }];


            var exist_history_data = $.vmodel.api.endbox("get");

            // 如果不是在結束紀錄盒中的第一個模組
            if ($(exist_history_data).length > 0) {

                // 合併已存在的，務必使用 data[0] 剝除外面的陣列。
                exist_history_data.push(data[0]); 
                
                // 替換
                data = exist_history_data;
            }

            // 添加變數紀錄
            $.vmodel.api.endbox("set", data);

            return data;
        }

        // 視覺化屬性
        this.set_display_attr = function (target_obj, data){

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

                    // 若全部狀態尚未完成
                    if (local.is_trigger_callback(target_obj) === false) return true;

                    // 停止監聽
                    clearInterval(iid);

                    // 添加到結束紀錄盒
                    var data = local.push_endbox(model_name)

                    // 呈現在 html 屬性中
                    local.set_display_attr(target_obj, data);

                    // 觸發回調
                    if (type_listen == "boolean") return true;
                    
                    target_obj.vmodel_get_callback();

                }, 0);

                return true
            }
        }

        // 無論是否觸發使用者的 autoload(), 最後都會返回該實體化的物件
        return $.vmodel._storage[model_name];
    }

}( jQuery ));