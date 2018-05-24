(function ($) {

    /**
     * 當指定多組的倉儲模組化完成後，要觸發的方法
     *
     * 注意，這需要每個模組都使用監聽完成視覺化，也就是 $.vmodel.get() 第三個參數
     * 
     * @param   array | function     end_p1       監聽指定要完成的倉儲名稱陣列 | 回調方法
     * @param   function             end_p2       回調方法, 並夾帶已經完成的倉儲物件
     */
    $.vmodel.end = function (end_p1, end_p2){

        var local = this;

        var issuccess = true;

        /**
         * 組合成一個陣列回傳參數
         * @param   end_p1 
         * @param   end_p2 
         * @return  [要監聽的倉儲物件, callback()]
         */
        this.param_match = function(end_p1, end_p2) {
            var returnary = [];

            // 只有一個參數，就取得所有倉儲
            if ($.type(end_p1) == "function") {
                var storage = $.vmodel.get();
                returnary = [storage, end_p1];
            }
            // 兩個參數，代表有指定要取得的倉儲
            else {

                var obj = {};
                $.each(end_p1, function(key, name) {
                    obj[name] = $.vmodel.get(name);
                });
                returnary = [obj, end_p2];
            }

            return returnary;
        }

        //命名方便使用
        var pary     = local.param_match(end_p1, end_p2);
        var storage  = pary[0];
        var callback = pary[1];
        end_p1 = end_p2 = null;

        var id = setInterval(function (){

            var iscallback = true;

            // 檢查每個倉儲的視覺化狀態
            $.each(storage, function (storage_name, obj){

                // 取得執行完成的歷史紀錄
                var result = $.vmodel.history(obj.vname);

                // 若遇到其中一個倉儲為 false 代表還沒有完成，那就直接中斷
                if (result.status === false) {
                    iscallback = false;
                    return false;
                }

                iscallback = true;
            });


            if (iscallback) {
                callback(storage);
                clearInterval(id);
            }


        }, 20);
        
    }

}( jQuery ));