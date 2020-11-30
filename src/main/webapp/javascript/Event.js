//  tr 마우스 hover 이벤트
var mouseIn = function (id) {
    if (clickedEtlId != id) {
        document.getElementById(`${id}`).style.backgroundColor = "#bdbdbd";
    }
}

var mouseOut = function (id) {
    if (clickedEtlId != id) {
        document.getElementById(id).style.backgroundColor = "#fff";
    }
}

//  글자 수 제한 함수
var fnChkByte = function (obj, limit) {
    var maxByte = limit; //최대 입력 바이트 수
    var str = obj.value;
    var str_len = str.length;

    var rbyte = 0;
    var rlen = 0;
    var one_char = "";
    var str2 = "";

    for (var i = 0; i < str_len; i++) {
        one_char = str.charAt(i);

        if (escape(one_char).length > 4) {
            rbyte += 2; //한글2Byte
        } else {
            rbyte++; //영문 등 나머지 1Byte
        }

        if (rbyte <= maxByte) {
            rlen = i + 1; //return할 문자열 갯수
        }
    }

    if (rbyte > maxByte) {
        alert("한글 " + (Math.floor(maxByte / 2)) + "자 / 영문 " + maxByte + "자를 초과 입력할 수 없습니다.");
        str2 = str.substr(0, rlen); //문자열 자르기
        obj.value = str2;
        fnChkByte(obj, maxByte);
    }
}

//  체크박스의 중복체크 방지 함수
var checkBoxChange = function (id) {

    const optLOAD_MERGE_OPT_CODE = document.getElementById("optLOAD_MERGE_OPT_CODE");
    const partitionLOAD_MERGE_OPT_CODE = document.getElementById("partitionLOAD_MERGE_OPT_CODE");

    if (id == "optLOAD_MERGE_OPT_CODE") {
        if (optLOAD_MERGE_OPT_CODE.getAttribute("value") == "checked") {
            optLOAD_MERGE_OPT_CODE.setAttribute("value", "unchecked");
        } else {
            optLOAD_MERGE_OPT_CODE.setAttribute("value", "checked");
            if (partitionLOAD_MERGE_OPT_CODE.getAttribute("value") == "checked") {
                partitionLOAD_MERGE_OPT_CODE.setAttribute("value", "unchecked");
                document.getElementById("partitionLOAD_MERGE_OPT_CODE").checked = false;
            }
        }
    }

    if (id == "partitionLOAD_MERGE_OPT_CODE") {
        if (partitionLOAD_MERGE_OPT_CODE.getAttribute("value") == "checked") {
            partitionLOAD_MERGE_OPT_CODE.setAttribute("value", "unchecked");
        } else {
            partitionLOAD_MERGE_OPT_CODE.setAttribute("value", "checked");
            if (optLOAD_MERGE_OPT_CODE.getAttribute("value") == "checked") {
                optLOAD_MERGE_OPT_CODE.setAttribute("value", "unchecked");
                document.getElementById("optLOAD_MERGE_OPT_CODE").checked = false;
            }
        }
    }

    const checkEXTRACT_ERASE_HEADER = document.getElementById("checkEXTRACT_ERASE_HEADER");
    const checkEXTRACT_DELETE_OPTION = document.getElementById("checkEXTRACT_DELETE_OPTION");

    if (id == "checkEXTRACT_ERASE_HEADER") {
        if (checkEXTRACT_ERASE_HEADER.getAttribute("value") == "checked") {
            checkEXTRACT_ERASE_HEADER.setAttribute("value", "unchecked");
        } else {
            checkEXTRACT_ERASE_HEADER.setAttribute("value", "checked");
        }
    }

    if (id == "checkEXTRACT_DELETE_OPTION") {
        if (checkEXTRACT_DELETE_OPTION.getAttribute("value") == "checked") {
            checkEXTRACT_DELETE_OPTION.setAttribute("value", "unchecked");
        } else {
            checkEXTRACT_DELETE_OPTION.setAttribute("value", "checked");
        }
    }

}