//  머리 객체에 클릭한 ETL의 ID 와 JSON 을 저장
var clickedEtlId;
var data;

//  Jquery 를 사용 하지 않는 ajax
var vanillaAjax = function (url, requestData, successFunction) {
    const xmlHttpRequest = new XMLHttpRequest();
    xmlHttpRequest.onreadystatechange = function () {
        if (xmlHttpRequest.readyState === xmlHttpRequest.DONE) {
            if (xmlHttpRequest.status === 200 || xmlHttpRequest.status === 201) {
                //  Success :
                console.log("Ajax Success");
                console.log(xmlHttpRequest.responseText);
                //  성공 했을 때 작동 할 함수
                successFunction(xmlHttpRequest.responseText.toString());
            } else {
                //  Error :
                console.error("Ajax fail");
                alert("Ajax fail");
            }
        }
    };
    //  전 Post 방식을 사용하겠습니다. 이유 : 보안!
    xmlHttpRequest.open("POST", url);
    //  Type 을 Json 으로
    xmlHttpRequest.setRequestHeader("Content-Type", "application/json");
    //  받은 Data를 전송
    xmlHttpRequest.send(JSON.stringify(requestData));
}

window.onload = function () {
    //  맨 처음에 ETL GROUP NAMES 를 ComboBox 에 append
    const query = getETLGroupNameQuery;

    const etlGroups = document.getElementById("etlGroups");
    const etlGroupNameInColumn = document.getElementById("etlGroupNameInColumn");

    //  ETL_LOAD_TYPE 의 Default option
    etlGroups.append(new Option("전체"));

    vanillaAjax("ajax", query, function (responseData) {
        const jsonData = JSON.parse(responseData)[0];
        for (let i = 0; i < jsonData.length; i++) {
            etlGroups.append(new Option(jsonData[i].ETL_GROUP_NAME));
            etlGroupNameInColumn.append(new Option(jsonData[i].ETL_GROUP_NAME));
        }
    });
    reset();
}

//  초기화
var reset = function () {

    document.getElementById("etlContext").value = "";
    document.getElementById("etlGroupNameInColumnText").value = "";
    document.getElementById("etlGroupContextInColumn").value = "";
    document.getElementById("etlGroups").value = "전체";
    document.getElementById("delete").setAttribute("disabled", "true");
    document.getElementById("delete").style.backgroundColor = "#ececec";

    clearTalble("structuredETL");
    clearComboBox("loadTypes", "전체");

    reset1();
}

//  2번째 블록 초기화화
var reset1 = function () {
    clearTalble("etlColumns");
    clearNodes("extract");
    clearNodes("load");

    const extractDiv = document.createElement("div");
    extractDiv.innerHTML = `<label class="label">유형</label><input class="text" type="text" value="그룹 선택" disabled="true" readonly="true" >`;
    extract.appendChild(extractDiv);

    const loadDiv = document.createElement("div");
    loadDiv.innerHTML = `<label class="label">유형</label><input class="text" type="text" value="그룹 선택" disabled="true" readonly="true" >`;
    load.appendChild(loadDiv);

    document.getElementById("etlGroupNameInColumn").style.display = "inline-block";
    document.getElementById("etlGroupNameInColumnText").style.display = "none";

    document.getElementById("etlGroupNameInColumn").value = "선택";
    document.getElementById("etlGroupContextInColumn").value = "";

    document.getElementById("insert").style.display = "inline-block";
    document.getElementById("update").style.display = "none";
}

//  ETL 그룹에 맞춰서 적재 유형 바꾸기
var loadTypeChange = function (etlGroupName) {
    const query = getLoadTypeQuery.replace("etlGroupName", `'${etlGroupName}'`)
    clearComboBox("loadTypes", "전체");

    vanillaAjax("ajax", query, function (responseData) {
        const jsonData = JSON.parse(responseData)[0];
        for (let i = 0; i < jsonData.length; i++) {
            loadTypes.append(new Option(jsonData[i].LOAD_TYPE));
        }
    });
}

//  ETL 조회
var loadEtl = function () {

    clickedEtlId = undefined;
    hoverEtlId = undefined;

    let query = loadEtlQuery;

    //  조회 조건들을 가져 온 후
    const context = document.getElementById("etlContext").value;
    const etlGroup = document.getElementById("etlGroups").value;
    const loadType = document.getElementById("loadTypes").value;

    //  쿼리를 조정
    if (etlGroup != "전체") {
        query += ` where etl_group.ETL_GROUP_NAME = '${etlGroup}' `;
        if (loadType != "전체") {
            query += ` and structured_etl.LOAD_TYPE_CODE = (select CODE_ID from code where CODE_NAME = '${loadType}') `;
        }
        if (context != "") {
            query += ` and structured_etl.CONTEXT like '%${context}%' `;
        }
    } else {
        query += ` where structured_etl.CONTEXT like '%${context}%' `;
    }

    //  ETL table 비우기
    clearTalble("structuredETL");
    //  ETL 요청
    vanillaAjax("ajax", query, function (responseData) {
        const etlTable = document.getElementById("structuredETL");
        //  tbodt 에 차곡차곡 적재
        const jsonData = JSON.parse(responseData)[0];
        for (let i = 0; i < jsonData.length; i++) {
            let row = etlTable.insertRow(etlTable.rows.length);
            row.setAttribute("onclick", `etlClick(id)`);
            row.setAttribute("onmouseover", `mouseIn(id)`);
            row.setAttribute("onmouseout", `mouseOut(id)`);
            row.setAttribute("id", `etl${jsonData[i].STRUCTURED_ETL_ID}`);
            row.setAttribute("class", `etl${jsonData[i].STRUCTURED_ETL_ID}`);
            row.insertCell(0).innerHTML = `<td>${(i + 1)}</td>`;
            row.insertCell(1).innerHTML = `<td>${jsonData[i].ETL_GROUP_NAME}</td>`;
            row.insertCell(2).innerHTML = `<td>${jsonData[i].EXTRACT_OBJECT}</td>`;
            row.insertCell(3).innerHTML = `<td>${jsonData[i].EXTRACT_LOCATION}</td>`;
            row.insertCell(4).innerHTML = `<td>${jsonData[i].LOAD_OBJECT}</td>`;
            row.insertCell(5).innerHTML = `<td>${jsonData[i].LOAD_LOCATION}</td>`;
            row.insertCell(6).innerHTML = `<td>${jsonData[i].LOAD_TYPE}</td>`;
            row.insertCell(7).innerHTML = `<td>${jsonData[i].CONTEXT}</td>`;
            //  스케쥴링 여부 N or Y 로 바꾸기
            let schedule = "N";
            if (jsonData[i].SCHEDULE == 1) {
                schedule = "Y";
            }
            row.insertCell(8).innerHTML = `<td>${schedule}</td>`;
        }
    })
}

//  ETL 클릭했을 때 함수
var etlClick = async function ETLClick(etlTrId) {
    document.getElementById("etlGroupNameInColumn").style.display = "none";
    document.getElementById("etlGroupNameInColumnText").style.display = "inline-block";
    document.getElementById("insert").style.display = "none";
    document.getElementById("update").style.display = "inline-block";
    document.getElementById("delete").removeAttribute("disabled");
    document.getElementById("delete").style.backgroundColor = "#999999";

    //  이전에 클릭했던 ETL 배경색상 변경
    if (clickedEtlId != undefined) {
        document.getElementById(clickedEtlId).style.backgroundColor = "#fff";
    }
    //  ETL 클릭했을 때 배경 색상 변경
    document.getElementById(`${etlTrId}`).style.backgroundColor = "#faf4cd";
    //  이전에 클릭했던 ETL ID 를 저장
    clickedEtlId = `${etlTrId}`;
    //
    const STRUCTURED_ETL_ID = etlTrId.replace("etl", "");

    const query = etlClickQuery.replace("jsSTRUCTURED_ETL_ID", ` '${STRUCTURED_ETL_ID}' `).replace("jsSTRUCTURED_ETL_ID", ` '${STRUCTURED_ETL_ID}' `);

    //  클릭한 etl에서 ETL그룹네임, 설명을 가져온 후 column 위에 넣는다
    const structuredEtl = document.getElementById("structuredETL").children[(document.querySelector(`.etl${STRUCTURED_ETL_ID}`).rowIndex - 1)].innerText.split('\t');
    document.getElementById("etlGroupNameInColumnText").value = structuredEtl[1];
    document.getElementById("etlGroupContextInColumn").value = structuredEtl[7];

    //  컬럼을 추가할 기준 element를 가져옴
    var extract = document.getElementById("extract");
    var load = document.getElementById("load");

    clearTalble("etlColumns");

    const etlColumns = document.getElementById("etlColumns");
    //  ajax 시작!
    vanillaAjax("ajax", query, function (responseData) {

        //  첫번째 Query 가 etl Column 조회였으니 첫번째 response 는 컬럼데이터지!! 예쁘게 넣으면 끝
        const etlColumnData = JSON.parse(responseData)[0];
        for (let i = 0; i < etlColumnData.length; i++) {
            var row = etlColumns.insertRow(etlColumns.rows.length);
            row.setAttribute("id", `'column${etlColumnData[i].STRUCTURED_ETL_COLUMN_ID}'`);
            row.setAttribute("onmouseover", `mouseIn(id)`);
            row.setAttribute("onmouseout", `mouseOut(id)`);
            row.insertCell(0).innerHTML = `<td>${(i + 1)}</td>`;
            row.insertCell(1).innerHTML = `<td>${etlColumnData[i].EXTRACT_COLUMN}</td>`;
            row.insertCell(2).innerHTML = `<td>${etlColumnData[i].EXTRACT_TYPE}</td>`;
            row.insertCell(3).innerHTML = `<td>${etlColumnData[i].LOAD_COLUMN}</td>`;
            row.insertCell(4).innerHTML = `<td>${etlColumnData[i].LOAD_TYPE}</td>`;
            let convertCode = "";
            if (etlColumnData[i].CONVERSION_CODE != null) {
                convertCode = etlColumnData[i].CONVERSION_CODE;
            }
            row.insertCell(5).innerHTML = `<td>${convertCode}</td>`;
        }
        //  컬럼을 추가할 기준 element를 비움

        clearNodes("extract");
        clearNodes("load");

        //  추출 유형
        const extractDiv = document.createElement("div");
        extractDiv.innerHTML = `<label class="label">유형</label><input class="text" type="text" value="${structuredEtl[2]}"  readonly="true" >`;
        extract.appendChild(extractDiv);
        // 적제 유형
        const loadDiv = document.createElement("div");
        loadDiv.innerHTML = `<label class="label">유형</label><input class="text" type="text" value="${structuredEtl[4]}"  readonly="true" >`;
        load.appendChild(loadDiv);

        extractLoading(responseData, "readonly = 'true'", "disabled='true'");
    });
}

var extractLoading = function (responseData, readonly, disableOption) {
    data = JSON.parse(responseData)[1][0];
    let convertedKey, key, value, disable;
    if (data[key = "EXTRACT_DELIMITER_CODE"] != null) {
        convertedKey = convert(key);
        value = String(data[key]);
        disable = (value == "") ? disableOption : "";
        makeDiv("div", key, `<span id="${key}"><span><label class="label">${convertedKey}</label><select id="select${key}" class="comboBox" ${disable}><option>${value}</option></select></span></span>`);
        setOptions(`select${key}`, value, responseData);
    }
    if (data[key = "EXTRACT_CHARSET_CODE"] != null) {
        convertedKey = convert(key);
        value = String(data[key]);
        disable = (value == "") ? disableOption : "";
        addSpan("selectEXTRACT_DELIMITER_CODE", "EXTRACT_DELIMITER_CODE", "span", "EXTRACT_CHARSET_CODE", `<label class="label">${convertedKey}</label><select id="select${key}" class="halftextAndComboBox" ${disable}><option>${value}</option></select>`);
        setOptions(`select${key}`, value, responseData);
    }
    if (data[key = "EXTRACT_FILEPATH"] != null) {
        convertedKey = convert(key);
        value = String(data[key]);
        disable = (value == "") ? disableOption : "";
        makeDiv("div", key, `<span id="${key}"><span><label class="label">${convertedKey}</label><input id="text${key}" class="text" type="text" value="${value}" ${disable} onkeyup="fnChkByte(this, 45)"></span></span>`);
    }
    if (data[key = "EXTRACT_DB"] != null) {
        convertedKey = convert(key);
        value = String(data[key]);
        disable = (value == "") ? disableOption : "";
        makeDiv("div", key, `<span id="${key}"><span><label class="label">${convertedKey}</label><input id="text${key}" class="text" type="text" value="${value}" ${disable} onkeyup="fnChkByte(this, 20)"></span></span>`);
    }
    if (data[key = "EXTRACT_COLLECTION_RANGE_CODE"] != null) {
        convertedKey = convert(key);
        value = String(data[key]);
        disable = (value == "") ? disableOption : "";
        makeDiv("div", key, `<span id="${key}"><span><label class="label">${convertedKey}</label><select id="select${key}" class="comboBox" ${disable} ><option>${value}</option></select></span></span>`);
        setOptions(`select${key}`, value, responseData);
    }
    if (data[key = "EXTRACT_TABLE_NAME"] != null) {
        convertedKey = convert(key);
        value = String(data[key]);
        disable = (value == "") ? disableOption : "";
        makeDiv("div", key, `<span id="${key}"><span><label class="label">${convertedKey}</label><input id="text${key}" class="text" type="text" value="${value}" ${disable} onkeyup="fnChkByte(this, 45)"></span></span>`);
    }
    if (data[key = "EXTRACT_COMPRESSION_TYPE_CODE"] != null) {
        convertedKey = convert(key);
        value = String(data[key]);
        disable = (value == "") ? disableOption : "";
        makeDiv("div", key, `<span id="${key}"><span><label class="label">${convertedKey}</label><select id="select${key}" class="comboBox" ${disable} ><option>${value}</option></select></span></span>`);
        setOptions(`select${key}`, value, responseData);
    }
    if (data[key = "EXTRACT_REMOTE_PATH"] != null) {
        convertedKey = convert(key);
        value = String(data[key]);
        disable = (value == "") ? disableOption : "";
        makeDiv("div", key, `<span id="${key}"><span><label class="label">${convertedKey}</label><input id="text${key}" class="text" type="text" value="${value}" ${disable} onkeyup="fnChkByte(this, 45)"></span></span>`);
    }
    if (data[key = "EXTRACT_STANDARD_COLUMN"] != null) {
        convertedKey = convert(key);
        value = String(data[key]);
        disable = (value == "") ? disableOption : "";
        value = (value == "") ? "선택" : value;
        makeDiv("div", key, `<span id="${key}"><span><label class="label">${convertedKey}</label><input id="text${key}" class="text" type="text" value="${value}" ${disable} onkeyup="fnChkByte(this, 20)"></span></span></span></span>`);
    }
    if (data[key = "EXTRACT_SPLITBY"] != null) {
        convertedKey = convert(key);
        value = String(data[key]);
        disable = (value == " value='unchecked' ") ? disableOption : "";
        makeDiv("div", key, `<span id="${key}"><span><label class="label">${convertedKey}</label><input id="text${key}" class="text" type="text" value="${value}" ${disable} onkeyup="fnChkByte(this, 20)"></span></span>`);
    }
    if (data[key = "EXTRACT_ERASE_HEADER"] != null) {
        convertedKey = convert(key);
        value = String(data[key]);
        disable = (value == "") ? disableOption : "";
        let checked = " value='unchecked' ";
        if (value == "1") {
            checked = "checked value='checked' ";
        }
        makeDiv("div", key, `<span id="${key}"><span><label class="label">${convertedKey}</label><input id="check${key}" id="headerDelete" class="checkBox" type="checkbox" ${checked} ${disable} onchange="checkBoxChange(id)"></span></span>`);
    }
    if (data[key = "EXTRACT_DELETE_OPTION"] != null) {
        convertedKey = convert(key);
        value = String(data[key]);
        disable = (value == "") ? disableOption : "";
        let checked = "";
        if (value == "1") {
            checked = "checked value='checked' ";
        }
        addSpan("checkEXTRACT_ERASE_HEADER", `EXTRACT_ERASE_HEADER`, "span", "EXTRACT_DELETE_OPTION", `<label class="label">${convertedKey}</label><input id="check${key}" class="checkBox" type="checkbox" ${checked} ${disable} onchange="checkBoxChange(id)">`);
        document.getElementById("checkEXTRACT_ERASE_HEADER").className = "checkBox";
    }
    if (data[key = "EXTRACT_SOURCE_COLUMN"] != null) {
        convertedKey = convert(key);
        value = String(data[key]);
        disable = (value == "") ? disableOption : "";
        makeDiv("div", key, `<span id="${key}"><span><label class="label">${convertedKey}</label><input id="text${key}" class="text" type="text" value="${value}" ${disable} onkeyup="fnChkByte(this, 20)"></span></span>`);
    }
    if (data[key = "LOAD_DB"] != null) {
        convertedKey = convert(key);
        value = String(data[key]);
        disable = (value == "") ? disableOption : "";
        makeDiv("div", key, `<span id="${key}"><span><label class="label">${convertedKey}</label><input id="text${key}" class="text" type="text" value="${value}" ${disable}   ${readonly}  onkeyup="fnChkByte(this, 45)"></span></span>`);
    }
    if (data[key = "LOAD_FORMAT_CODE"] != null) {
        convertedKey = convert(key);
        value = String(data[key]);
        disable = (value == "") ? disableOption : "";
        addSpan("textLOAD_DB", "LOAD_DB", "span", "LOAD_FORMAT_CODE", `<label class="label">${convertedKey}</label><select id="select${key}" class="halftextAndComboBox" style="width: 149px" ${disable}><option>${value}</option></select>`);
        setOptions(`select${key}`, value, responseData);
    }
    if (data[key = "LOAD_TABLE_NAME"] != null) {
        convertedKey = convert(key);
        value = String(data[key]);
        disable = (value == "") ? disableOption : "";
        makeDiv("div", key, `<span id="${key}"><span><label class="label">${convertedKey}</label><input id="text${key}" class="text" type="text" value="${value}" ${disable}   ${readonly}  onkeyup="fnChkByte(this, 45)"></span></span>`);
    }
    if (data[key = "LOAD_TABLE_CONTEXT"] != null) {
        convertedKey = convert(key);
        value = String(data[key]);
        disable = (value == "") ? disableOption : "";
        makeDiv("div", key, `<span id="${key}"><span><label class="label">${convertedKey}</label><input id="text${key}" class="text" type="text" value="${value}" ${disable}   ${readonly}  onkeyup="fnChkByte(this, 100)"></span></span>`);
    }
    if (data[key = "LOAD_DELIMITER_CODE"] != null) {
        convertedKey = convert(key);
        value = String(data[key]);
        disable = (value == "") ? disableOption : "";
        makeDiv("div", key, `<span id="${key}"><span><label class="label">${convertedKey}</label><select id="select${key}" class="comboBox" ${disable} ><option>${value}</option></select></span></span>`);
        setOptions(`select${key}`, value, responseData);
    }
    if (data[key = "LOAD_CHARSET_CODE"] != null) {
        convertedKey = convert(key);
        value = String(data[key]);
        disable = (value == "") ? disableOption : "";
        makeDiv("div", key, `<span id="${key}"><span><label class="label">${convertedKey}</label><select id="select${key}" class="comboBox" ${disable} ><option>${value}</option></select></span></span>`);
        setOptions(`select${key}`, value, responseData);
    }
    if (data[key = "LOAD_PATH"] != null) {
        convertedKey = convert(key);
        value = String(data[key]);
        disable = (value == "") ? disableOption : "";
        makeDiv("div", key, `<span id="${key}"><span><label class="label">${convertedKey}</label><input id="text${key}" class="text" type="text" value="${value}" ${disable} onkeyup="fnChkByte(this, 45)"></span></span>`);
    }
    if (data[key = "LOAD_COMPRESSION_TYPE_CODE"] != null) {
        convertedKey = convert(key);
        value = String(data[key]);
        disable = (value == "") ? disableOption : "";
        makeDiv("div", key, `<span id="${key}"><span><label class="label">${convertedKey}</label><select id="select${key}" class="comboBox" ${disable} ><option>${value}</option></select></span></span>`);
        setOptions(`select${key}`, value, responseData);
    }
    if (data[key = "LOAD_PARTITION"] != null) {
        convertedKey = convert(key);
        value = String(data[key]);
        disable = (value == "") ? disableOption : "";
        makeDiv("div", key, `<span id="${key}"><span><label class="label">${convertedKey}</label><input id="text${key}" class="text" type="text" value="${value}" ${disable}   ${readonly}  onkeyup="fnChkByte(this, 20)"></span></span>`);
    }
    if (data[key = "LOAD_TYPE_CODE"] != null) {
        convertedKey = convert(key);
        value = String(data[key]);
        disable = (value == "") ? disableOption : "";
        makeDiv("div", key, `<span id="${key}"><span><label class="label">${convertedKey}</label><select id="select${key}" class="comboBox" ${disable} ><option>${value}</option></select></span></span>`);
        setOptions(`select${key}`, value, responseData);
    }
    if (data[key = "LOAD_MERGE_OPT_CODE"] != null) {
        convertedKey = convert(key);
        value = String(data[key]);
        disable = (value == "") ? disableOption : "";
        let all = " value='unchecked' ", partition = " value='unchecked' ";
        if (value == "전체") {
            all = "checked value='checked' "
        } else if (value == "PARTITION") {
            partition = "checked value='checked' ";
        }
        makeDiv("div", key, `<span id="${key}"><span><label class="label">${convertedKey}</label>전체<input id="opt${key}" class="checkBox" type="checkbox" ${all} ${disable} onchange="checkBoxChange(id)" ></span><span>Partition<input id="partition${key}" class="checkBox" type="checkbox" ${partition} ${disable} onchange="checkBoxChange(id)" ></span></span>`);
    }
    if (data[key = "LOAD_DELETE_STANDARD_COLUMN"] != null) {
        convertedKey = convert(key);
        value = String(data[key]);
        disable = (value == "") ? disableOption : "";
        makeDiv("div", key, `<span id="${key}"><span><label class="label">${convertedKey}</label><input id="text${key}" class="text" type="text" value="${value}" ${disable} onkeyup="fnChkByte(this, 20)"></span></span>`);
    }
    if (data[key = "LOAD_DELETE_STANDARD_VALUE"] != null) {
        convertedKey = convert(key);
        value = String(data[key]);
        disable = (value == "") ? disableOption : "";
        makeDiv("div", key, `<span id="${key}"><span><label class="label">${convertedKey}</label><input id="text${key}" class="text" type="text" value="${value}" ${disable} onkeyup="fnChkByte(this, 45)"></span></span>`);
    }
}

var setOptions = function (codeId, codeValue, responseData) {
    const codes = JSON.parse(responseData)[2];
    //  value 값으로 코드 아이디 가져와서
    let key;
    for (let i = 0; i < codes.length; i++) {
        if (codes[i]["CODE_NAME"] == codeValue) {
            key = (Math.floor(codes[i]["CODE_ID"] / 100)) * 100;
            break;
        }
    }
    //  코드 네임 array 생성
    let codeArray = [];
    for (let i = 0; i < codes.length; i++) {
        if ((Math.floor(codes[i]["CODE_ID"] / 100)) * 100 == key && codes[i]["CODE_NAME"] != codeValue) {
            codeArray.push(codes[i]["CODE_NAME"]);
        }
    }

    //  받은 id 에 옵션들 생성
    const comboBox = document.getElementById(codeId);
    for (let i = 0; i < codeArray.length; i++) {
        comboBox.appendChild(new Option(codeArray[i]));
    }
}

var makeDiv = function (tagName, key, innerHTML) {
    const div = document.createElement(tagName);
    div.setAttribute("id", key);
    div.innerHTML = innerHTML;
    if (key.includes("EXTRACT")) {
        extract.appendChild(div);
    } else if (key.includes("LOAD")) {
        load.appendChild(div);
    }
}


var addSpan = function (valueContainerId, spanId, tagName, key, innerHTML) {
    const element = document.getElementById(valueContainerId)
    if (element == null) {
        makeDiv("div", key, `<span id="${key}"><span>${innerHTML}</span></span>`);
    }
    element.className = "halftextAndComboBox";
    const span = document.createElement(tagName);
    span.innerHTML = innerHTML;
    document.getElementById(spanId).appendChild(span);
}

var definition = function () {
    const query = definitionQuery;

    vanillaAjax("ajax", query, function (responseData) {
        const etlGroupDefine = document.getElementById("etlGroupDefine");
        //  tbodt 에 차곡차곡 적재
        const jsonData = JSON.parse(responseData)[0];
        for (let i = 0; i < jsonData.length; i++) {
            let row1 = etlGroupDefine.insertRow(etlGroupDefine.rows.length);
            row1.setAttribute("onclick", `openCloseButton('detail${i}')`);
            row1.setAttribute("title", `Click to expand. CTRL key collapses all others`);

            row1.insertCell(0).innerHTML = `<td><button id='buttondetail${i}' class="openCloseButton">-</button>${jsonData[i].ETL_GROUP_NAME}&nbsp(&nbsp&nbsp${jsonData[i].COUNT}건&nbsp)</td>`;
            row1.insertCell(1).innerHTML = `<td>&nbsp</td>`;
            row1.insertCell(2).innerHTML = `<td>&nbsp</td>`;

            let row2 = etlGroupDefine.insertRow(etlGroupDefine.rows.length);
            row2.setAttribute("id", `detail${i}`);
            row2.setAttribute("style", "display: block; height: 23px; text-align: center;");
            row2.setAttribute("onmouseover", `mouseIn(id)`);
            row2.setAttribute("onmouseout", `mouseOut(id)`);

            row2.insertCell(0).innerHTML = `<td>없음</td>`;
            row2.insertCell(1).innerHTML = `<td>${jsonData[i].COUNT}</td>`;
            row2.insertCell(2).innerHTML = `<td>${jsonData[i].SCHEDULE}</td>`;
        }
    })

}

var convert = function (columnName) {
    if (columnName.includes("EXTRACT")) {
        if (columnName.includes("CODE")) {
            if (columnName == "EXTRACT_DELIMITER_CODE") {
                return "Delimiter : ";
            }
            if (columnName == "EXTRACT_CHARSET_CODE") {
                return "CharSet : ";
            }
            if (columnName == "EXTRACT_COLLECTION_RANGE_CODE") {
                return "수집범위 : ";
            }
            if (columnName == "EXTRACT_COMPRESSION_TYPE_CODE") {
                return "압축 유형 : ";
            }
        } else {
            if (columnName == "EXTRACT_FILEPATH") {
                return "FilePath :       ";
            }
            if (columnName == "EXTRACT_DB") {
                return "DB :          ";
            }
            if (columnName == "EXTRACT_TABLE_NAME") {
                return "테이블명 :      ";
            }
            if (columnName == "EXTRACT_REMOTE_PATH") {
                return "원격 Path : ";
            }
            if (columnName == "EXTRACT_STANDARD_COLUMN") {
                return "추출기준컬럼 : ";
            }
            if (columnName == "EXTRACT_SPLITBY") {
                return "Split By";
            }
            if (columnName == "EXTRACT_ERASE_HEADER") {
                return "헤더 제거 : ";
            }
            if (columnName == "EXTRACT_DELETE_OPTION") {
                return "적제후 원본파일 삭제 : ";
            }
            if (columnName == "EXTRACT_SOURCE_COLUMN") {
                return "원천 : ";
            }
        }
    } else if (columnName.includes("LOAD")) {
        if (columnName.includes("CODE")) {
            if (columnName == "LOAD_FORMAT_CODE") {
                return "Format : ";
            }
            if (columnName == "LOAD_DELIMITER_CODE") {
                return "Delimiter : ";
            }
            if (columnName == "LOAD_COMPRESSION_TYPE_CODE") {
                return "압축 유형 : ";
            }
            if (columnName == "LOAD_MERGE_OPT_CODE") {
                return "Mergeg OPT : ";
            }
            if (columnName == "LOAD_TYPE_CODE") {
                return "적재 유형 : ";
            }
            if (columnName == "LOAD_CHARSET_CODE") {
                return "CharSet : ";
            }
        } else {
            if (columnName == "LOAD_DB") {
                return "DB : ";
            }
            if (columnName == "LOAD_TABLE_NAME") {
                return "Table명 : ";
            }
            if (columnName == "LOAD_TABLE_CONTEXT") {
                return "Table 설명 : ";
            }
            if (columnName == "LOAD_PATH") {
                return "Path : ";
            }
            if (columnName == "LOAD_PARTITION") {
                return "Partition : ";
            }
            if (columnName == "LOAD_DELETE_STANDARD_COLUMN") {
                return "삭제기준컬럼 : ";
            }
            if (columnName == "LOAD_DELETE_STANDARD_VALUE") {
                return "삭제 VALUE : ";
            }
        }
    }
}

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

var clearTalble = function (tableId) {
    const table = document.getElementById(tableId);
    while (table.rows.length > 0) {
        table.deleteRow(table.rows.length - 1)
    }
}

var clearNodes = function (nodeId) {
    const node = document.getElementById(nodeId);
    while (node.hasChildNodes()) {
        node.removeChild(node.firstChild);
    }
}

var clearComboBox = function (ComboBoxId, defaultOption) {
    const comboBox = document.getElementById(ComboBoxId);
    comboBox.options.length = 0;
    comboBox.append(new Option(defaultOption));
}

var setSample = function (value) {
    if (value == "선택") {
        return;
    }

    const query = setSampleQuery.replace("jsValue", `'${value}'`).replace("jsValue", `'${value}'`);

    vanillaAjax("ajax", query, function (responseData) {
        const extractAndLoadData = JSON.parse(responseData)[0][0];
        if (extractAndLoadData == undefined || extractAndLoadData == null) {
            reset1();
            return;
        }
        const etlgroupdata = JSON.parse(responseData)[0][0];
        //  컬럼을 추가할 기준 element를 비움

        clearNodes("extract");
        clearNodes("load");


        //  추출 유형
        const extractDiv = document.createElement("div");
        extractDiv.innerHTML = `<label class="label">유형</label><input class="text" type="text" value="${etlgroupdata["EXTRACT_OBJECT_CODE"]}"  readonly="true" >`;
        extract.appendChild(extractDiv);
        // 적제 유형
        const loadDiv = document.createElement("div");
        loadDiv.innerHTML = `<label class="label">유형</label><input class="text" type="text" value="${etlgroupdata["LOAD_OBJECT_CODE"]}"  readonly="true" >`;
        load.appendChild(loadDiv);

        if (JSON.parse(responseData)[1][0] == undefined || JSON.parse(responseData)[1][0] == null) {
            return;
        }
        extractLoading(responseData, "", "");
    });
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

var insertETL = function () {
    const check = confirm("정말로 저장 하시겠습니까?");
    if (check == true) {

        let newData = makeNewData(), field = "", values = "";
        newData["ETL_GROUP_ID"] = `(select ETL_GROUP_ID from etl_group where ETL_GROUP_NAME = '${document.getElementById("etlGroupNameInColumn").value}' )`;

        const newDataKeys = Object.keys(newData);

        for (let i = newDataKeys.length - 1; i >= 0; i--) {
            if (i == newDataKeys.length - 1) {
                field += newDataKeys[i];
                values += newData[newDataKeys[i]];
            } else {
                field += ", " + newDataKeys[i];
                values += ", " + newData[newDataKeys[i]];
            }
        }
        const query = `insert into structured_etl ( ${field} ) values ( ${values} );`;


        vanillaAjax("ajax", query, function (responseData) {
            alert("성공");
        });

    }
    loadEtl();
}

var updateETL = function () {
    const check = confirm("정말로 수정 하시겠습니까?");
    if (check == true) {
        let newData = makeNewData(), updateSet = "", STRUCTURED_ETL_ID = clickedEtlId.replace("etl", "");
        newData["ETL_GROUP_ID"] = `(select ETL_GROUP_ID from etl_group where ETL_GROUP_NAME = '${document.getElementById("etlGroupNameInColumnText").value}' )`;

        const newDataKeys = Object.keys(newData);

        for (let i = 0; i < newDataKeys.length; i++) {
            if (i == 0) {
                updateSet += ` ${newDataKeys[i]} = ${newData[newDataKeys[i]]} `;
            } else {
                updateSet += `, ${newDataKeys[i]} = ${newData[newDataKeys[i]]} `;
            }
        }

        const query = `update structured_etl set ${updateSet} where STRUCTURED_ETL_ID = '${STRUCTURED_ETL_ID}' ;`;

        vanillaAjax("ajax", query, function (responseData) {
            alert("성공");
        });
    }
    loadEtl();
}

var deleteETL = function () {
    const check = confirm("정말로 삭제 하시겠습니까?");
    if (check == true) {
        let STRUCTURED_ETL_ID = clickedEtlId.replace("etl", "");
        const query = `delete from structured_etl where STRUCTURED_ETL_ID = '${STRUCTURED_ETL_ID}' `;
        vanillaAjax("ajax", query, function (responseData) {
            alert("성공");
        });
    }
    loadEtl();

}

var makeNewData = function () {
    let newData = {};

    const keys = Object.keys(data);

    for (let i = 0; i < keys.length; i++) {
        if (document.getElementById(`select${keys[i]}`)) {
            newData[`${keys[i]}`] = `(select CODE_ID from code where CODE_NAME = '${document.getElementById(`select${keys[i]}`).value}' limit 1)`;
        } else if (document.getElementById(`text${keys[i]}`)) {
            newData[`${keys[i]}`] = `'${document.getElementById(`text${keys[i]}`).value}'`;
        } else if (document.getElementById(`check${keys[i]}`)) {
            newData[`${keys[i]}`] = (document.getElementById(`check${keys[i]}`).getAttribute("value") == "checked") ? 1 : 0;
        } else if (document.getElementById(`opt${keys[i]}`)) {
            newData[`${keys[i]}`] = `(select CODE_ID from code where CODE_NAME = '${(document.getElementById("optLOAD_MERGE_OPT_CODE").getAttribute("value") == "checked") ? "전체" : (document.getElementById("partitionLOAD_MERGE_OPT_CODE").getAttribute("value") == "checked") ? "PARTITION" : ""}' limit 1)`;
        }
    }

    newData["CONTEXT"] = `'${document.getElementById("etlGroupContextInColumn").value}'`;

    return newData;
}

var checkBoxChange = function (id) {

    let optLOAD_MERGE_OPT_CODE = document.getElementById("optLOAD_MERGE_OPT_CODE");
    let partitionLOAD_MERGE_OPT_CODE = document.getElementById("partitionLOAD_MERGE_OPT_CODE");

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

    if(id == "checkEXTRACT_ERASE_HEADER"){
        if (checkEXTRACT_ERASE_HEADER.getAttribute("value") == "checked") {
            checkEXTRACT_ERASE_HEADER.setAttribute("value", "unchecked");
        } else {
            checkEXTRACT_ERASE_HEADER.setAttribute("value", "checked");
        }
    }
    if(id == "checkEXTRACT_DELETE_OPTION"){
        if (checkEXTRACT_DELETE_OPTION.getAttribute("value") == "checked") {
            checkEXTRACT_DELETE_OPTION.setAttribute("value", "unchecked");
        } else {
            checkEXTRACT_DELETE_OPTION.setAttribute("value", "checked");
        }
    }

}