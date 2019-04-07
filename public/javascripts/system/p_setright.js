document.write('<script src="/comm.js"></script>');
$(document).ready(function () {
    var aryPara = GetUrlParams(location.href);
    var strID = "";
    if (aryPara["id"] === undefined) {
        alert("請先取得憑證序號再行登入，系統將在按完確認後轉回首頁。")
        location.href = "/";
    }
    if (strID !== aryPara["id"]) {
        strID = aryPara["id"];
        setVal("ID", strID, strID);
        try {
            $.ajax({
                type: "get",
                url: "/login/api/list/pkidata/" + strID,
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                success: function (data) {
                    setVal("UID", data.ID, data.ID);
                    setVal("Name", data.Name, data.Name);
                    var strType = data.Type;

                    if (strType === "CLS01") {
                        setVal("TECTYP", strType, "綜合營造業");
                    } else if (strType === "CLS02") {
                        setVal("TECTYP", strType, "專業營造業");
                    } else if (strType === "CLS03") {
                        setVal("TECTYP", strType, "土木包工業");
                        var strV = getVal("UID");
                    } else if (strType === "CLS04") {
                        setVal("TECTYP", strType, "代辦人員");
                        alert("代辦業者無授權功能，系統將在按完確認後轉回首頁。")
                        location.href = "/";
                    } else {
                        setVal("TECTYP", "", "");
                        alert("查無身份代號或是非該系統的使用身份，系統將在按完確認後轉回首頁。(身份類別代碼為：" + strType + ")")
                        location.href = "/";
                    }

                    //土木包工業調整顯示訊息:廠名(負責人:姓名)
                    //0628更改成 營造廠調整顯示訊息:廠名(負責人:姓名)
                    if(strType !== "CLS04")
                    {
                        $.ajax({
                            type: "get",
                            url: "/login/api/clis/selectFromID/" + data.tecnum,
                            dataType: "json",
                            contentType: "application/json; charset=utf-8",
                            success: function (cls_data) {
                                var display = cls_data.clsnam + "(負責人：" + data.Name + ")";
                                setVal("Name", display, display);
                            }
                        });
                    }

                    $("#jqGrid").jqGrid({
                        datatype : 'local',
                        url: "/login/api/list/getpkirightdata/" + strID,
                        mtype: "GET",
                        datatype: "json",
                        colNames : [ '' , '卡片號碼', '代辦業者名稱','授權時間', '授權期限' ],
                        colModel: [
                            {
                                name: 'guid',
                                width: 60,
                                formatter: function(cellvalue, options, rowobject){
                                    var event = "deleteData('" + cellvalue + "');"; 
                                    return '<button type="button" onclick="' + event + '">刪除授權</button>';
                                }        
                            },
                            {
                                name: 'tecardid',
                                width: 200,
                                editable: false
                            }, 
                            {
                                name: 'tecnam',
                                width: 100,
                                editable: false
                            },
                            {
                                name: 'tecsdt',
                                width: 100,
                                editable: false
                            },
                            {
                                name: 'tecedt',
                                width: 100,
                                editable: false
                            },
                            ],
                            caption: "卡片授權清單",
                            loadonce: true, //控制是否有上一頁，下一頁
                            viewrecords: true,
                            autoScroll: false,
                            autowidth: true,
                            height: 300,
                            rowNum: 10, //一個頁面可以顯示幾筆
                            rownumbers: true, // show row numbers
                            rownumWidth: 35, // the width of the row numbers columns
                            pager: "#jqGridPager"
                    });
                },
                error: function(err){
                    console.log(err);
                }
            });
        } catch (error) {
            console.log("error");
            console.log(error)
        }
    }

    $("#badd").on("click", function (e) {
        if (getVal("ID") === '') {
            alert("無授權業者資料");
            return
        }
        if (getVal("CardNumber") === '') {
            alert("請輸入要授權業者的自然人憑證卡號");
            return
        }
        if (getVal("edt") === '') {
            alert("請輸入授權期限");
            return;
        }
        if (getVal("edt").length !== 7) {
            alert("授權期限的長度錯誤");
            return;
        }
        $.ajax({
            type: "get",
            url: "/login/api/data/setright/" + getVal("ID") + "/" + getVal("CardNumber") + "/" + getVal("edt"),
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            success: function (data) {
                if (data.result === 'N') {
                    alert("新增發生錯誤，錯誤訊息：" + data.message);
                } else {
                    alert("新增完成");
                    location.reload();
                }
                setVal("CardNumber", "", "")
                setVal("CName", "", "");
                setVal("edt", "", "");
            }
        });
    });
    $("#CardNumber").focusout(function () {
        var strCID = getVal("CardNumber");
        if (strCID !== '') {
            //查詢資料
            $.ajax({
                type: "get",
                url: "/login/api/list/pkidatacard/" + strCID,
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                success: function (data) {
                    if (data.ID === '') {
                        alert("查無該卡號資料，請持卡業者先進行首次約定作業");
                        setVal("CardNumber", "", "")
                        setVal("CName", "", "");
                        setVal("edt", "", "");
                    } else if (data.Tecctp === "2") {
                        alert("僅可授權給代辦業者");
                        setVal("CardNumber", "", "")
                        setVal("CName", "", "");
                        setVal("edt", "", "");
                    } else {
                        setVal("CName", data.Name, data.Name);
                    }
                }
            });
        }
    });
});
