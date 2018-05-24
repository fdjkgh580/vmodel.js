(function ($) {

    /**
     * 取得執行完成的歷史紀錄
     * @param   model_name   倉儲名稱
     * @return               result 物件
     */
    $.vmodel.history = function (model_name) {

        var result = {
            status: false,
            data: null
        };

        // 從結束紀錄盒找到對應
        var storage   = $.vmodel.get(model_name);
        var endbox = $.vmodel.api.endbox("get");
        if ($(endbox).length === 0) return result;

        // 搜尋
        $.each(endbox, function (key, info){

            // 比對不到就繼續比對下一個
            if (info.vname != model_name) return true;

            // 比對到了則修改狀態，並結束尋找
            result.status = true;
            result.data = info;

            return false;
        });

        return result;
    }

}( jQuery ));