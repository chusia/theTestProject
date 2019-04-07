document.write('<script src="/comm.js"></script>');
$(document).ready(function () {
    $("#sysname").attr("href", "/regdata");
    $("#sysname").text("全國建築管理系統");
    $("#title").text("全國建築管理系統");
    ClearInnerItems("bread");
    AppendBreadItem("bread", "level1", "/", "首頁");
    AppendActiveBreadItem("bread", "首次約定協定");

    var aryPara = GetUrlParams(location.href);
    var strSys = "";
    if (strSys !== aryPara["sys"]) {
        strSys = aryPara["sys"];
        setVal("sys", strSys, strSys);
        $.ajax({
            type: "get",
            url: "/login/api/list/syscode/" + strSys,
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            success: function (data) {
                $("#TECTYP").html('');
                data.forEach(function (element) {
                    console.log(element);
                    $('#TECTYP').append($("<option></option>").attr("value", element.code_seq).text(element.code_desc));
                });

                datasrc = data;

            }
        });
    }
    $("#bsubmit").on("click", function (e) {
        $("#addpage").attr("Action", "/login/setright").submit();

    });



});