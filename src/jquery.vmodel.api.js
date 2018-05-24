(function ($) {

    // 內部全域的輔助方法
    $.vmodel.api = new function (){

        // 若前兩個字元是定位符號，就自動去除
        this.remove_sign = function (str){
            return (str.substring(0, 2) == "--") ? str.substring(2) : str;
        }

        /**
         * 是否通過該版 vmodel 所允許的 jQuery 版本
         * @param   is_err_msg              顯示錯誤訊息 true | 確認是否 false 
         */
        this.isallow_jqver = function (is_err_msg){

            // 若要顯示錯誤訊息
            if (is_err_msg == true) {
                return 'Vmodel.js ' + $.vmodel.version() + ' 須要使用大於 jQuery 3.0.0 的版本';
            }
            // 判斷是否允許版本
            else {
                var jver = jQuery.fn.jquery.charAt(0);
                return (jver == 3) ? true : false;
            }
        }

        // 確認必填參數
        this.check_input_param = function (param) {
            if (!param.selector)                throw("須要指定選擇器");
            if (!param.model_name)              throw("須要替模型命名");
            if (param.isautoload === undefined) throw("須要指定是否啟用");
            if (!param.method)                  throw("須要指定方法");
        }

        /**
         * 組合成一個陣列回傳參數
         * @return  [選擇器, 倉儲名稱, 是否啟用 autoload, 實體化物件]
         */
        this.vmodel_param_match = function (p_1, p_2, p_3, p_4){


            var selector   = p_1;
            
            // 去除定位符號
            var model_name = this.remove_sign(p_2);
            
            var isautoload = p_3;
            
            var method     = $.type(p_4) === "object" ? p_4 : new p_4();

            return [selector, model_name, isautoload, method];
        }

        // 物件排序
        this.obj_sort = function (obj){
            var temp = [];
            var i = 0;
            
            $.each(obj, function(key, val) {
                temp[i++] = key;
            });
            
            temp.sort();

            var data = {};
            $.each(temp, function (key, val){
                data[val] = obj[val]
            });

            return data;
        }

        /**
         * 批次呼叫可自動掛載的 function
         * @param   autoload_method_ary     需要觸發的 function 名稱陣列
         * @param   object                  也就是外部的實體化後的 $(selector).vmodel("匿名方法")
         */
        this.each_autoload = function (autoload_method_ary, obj){

            if (!autoload_method_ary) return false;

            // 觸發狀態偵測盒
            var is_trigger_all = {
                status: true,
                function_name: null
            };

            $.each(autoload_method_ary, function(key, name) {

                // 若有找到方法
                if ($.type(obj[name]) == "function") {
                    // 觸發方法
                    obj[name]();
                    return true;
                }

                // 若沒有找到方法，那就中斷
                is_trigger_all = {
                    status: false,
                    function_name: name
                };

                return false;
            });

            return is_trigger_all;
        },

        /**
         * 若使用者有設定 autoload() 就會自動呼叫陣列中指定的方法
         * @param obj      也就是外部的實體化後的 $(selector).vmodel("匿名方法")
         * @param fnameary 須要自動讀取的方法陣列
         */
        this.is_trigger_autoload = function (obj, fnameary){

            var result = {
                status: false,
                message: null
            }

            try {
                
                if (!fnameary) {
                    throw "須要指定方法名稱陣列";
                }
                
                if ($.type(fnameary) != "array") {
                    throw 'autoload 必須要是陣列';
                }
                
                var result = $.vmodel.api.each_autoload(fnameary, obj);

                if (result.status === true) return true;

                throw  '找不到可以自動讀取的方法 ' + result.function_name + '()';

                result.status = true;
            }
            catch(e) {
                result = {
                    status: false,
                    message: e
                }
            }

            return result;
        }

        // 從物件中取得 autoload 的方法陣列
        this.get_autoload_funame = function (obj){
            var ary   = [];
            var atype = $.type(obj.autoload);
            var result = {
                status: true,
                message: null,
                data: null
            }

            try{
                // 取得 autoload 的陣列
                if (atype == "array") {
                    ary = obj.autoload;
                } 
                else if (atype == "function") {
                
                    // 若有回傳陣列才替換
                    res = obj.autoload();
                    if ($.type(res) == "array") {
                        ary = res;
                    }
                    else {
                        throw "中 autoload 最終需要得到的型態務必是 Array。";
                    }
                }

                else {
                    throw "中 autoload 須要是陣列或 function。";
                }

                result.data = ary;
            }
            catch(e) {
                result.status = false;
                result.message = e;
            }

            return result;
        }
    }

}( jQuery ));