//定義jqGrid的預設值及Function Event
$(function () {
    $.extend($.jgrid.defaults, {
        //==========屬性處理================
        multiselect: false,//不多選
        rowNum: 10,
        rowList: [10, 20, 30],
        toppager: false,
        viewrecords: true,
        rownumbers: true,
        autowidth: true,
        altRows: true,
        altclass: 'jqgrow2',
        height: 'auto',//高度隨筆數而定
        rownumWidth: 30,//RowNum寬度 default:25 http://goo.gl/y8BqR
        //==========Event處理===============
        //錯誤處理
        gridComplete: gridComplete
    });
})


//完成後的處理
function gridComplete() {
    //讓每個row下的cell 都有colname(供RWD使用)
    if ($(this).getGridParam("reccount") > 0) {
        var cm = $(this).jqGrid("getGridParam", "colNames");
        var trs = $(this).find('tr');
        $.each(trs, function (tri, tritem) {
            var tds = $(tritem).find('td');
            $.each(tds, function (tdi, tditem) {
                $(tditem).height('auto');
                $(tditem).attr('mycolname', cm[tdi]);
            });
        });
    }
    //讓它再執行一次Resize(可移除body出現scrollbar的問題)
   // jqGridResize();
}


//讓grid它重新調整寬度(電腦版)
$(function () {
    $(window).bind('resize', jqGridResize);
})

function jqGridResize() {
    var grids = $(".ui-jqgrid-btable,.ui-pg-table,.ui-jqgrid-htable");
    $.each(grids, function (i, item) {
        //排外不自動resize
        if ($(item).parents(".dialogpage").length > 0 ||
            $(item).parents(".ExcludeGridResize").length > 0) {
        }
        else {
            //最大寬度取決於div contentBlock
            //因pc.css有定義
            //( in screen and (max-width: 1200px) and (min-width: 533px))=980 所有要限制grid大小
            //( in screen and (max-width: 1500px) and (min-width: 1200px))=1200
            //screen and (min-width: 1501px) =1500
            var nowwidth = $(window).width() - 10; //$(item).width();
            //var contentwidth = $(".mainConetnt").width();
            //contentwidth = contentwidth == null ? $("#contentBlock").width() : contentwidth;
            //若contentwidth比較小，則採用它的
            //nowwidth = (contentwidth <= nowwidth) ? contentwidth : nowwidth;
            /*
            nowwidth = (nowwidth <= 980) ? nowwidth :
                (nowwidth > 980 && nowwidth < 1200) ? contentwidth :
                    (nowwidth > 1200 && nowwidth < 1500) ? contentwidth : contentwidth
                ;
            if (nowwidth <= 533)
                nowwidth = nowwidth - 20;//在RWD下要減20才可以
                */
            $(item).jqGrid('setGridWidth', nowwidth - 1);
            $(".ui-jqgrid-btable").width(nowwidth - 2);//jqgrid body再減1才不會有Srollbar
            //console.log(nowwidth + "," + contentwidth);
       }
    });
}
