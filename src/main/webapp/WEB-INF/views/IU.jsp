<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <title>IU</title>
    <script src="javascript/IU.js"></script>
    <script src="javascript/Query.js"></script>
    <script src="javascript/LayerPop.js"></script>
    <link rel="stylesheet" href="css/IU.css"/>
    <link rel="stylesheet" href="css/Table.css"/>
    <link rel="stylesheet" href="css/LayerPop.css"/>
</head>
<body>
<!--레이어팝업 마스크-->
<div id="mask"></div>
<div id="layerbox" class="layerpop">
    <article class="layerpop_area">
        <div class="title">정의 현황
            <button style="float: right; width: 25px; height: 25px;" onclick="popupClose()">X</button>
        </div>
        <div class="table3Container">
            <table class="scrolltbody3">
                <thead>
                <th>업무 구분</th>
                <th>갯수</th>
                <th>스케줄 갯수</th>
                </thead>
                <tbody class="tbody3" id="etlGroupDefine"></tbody>
            </table>
        </div>
        <div style="float: right">
            <button class="basicButton" onclick="popupClose()">닫기</button>
        </div>
    </article>
</div>

<div>
    <h2><strong style="color: #ffcc00">정형 ETL</strong> 작업 관리</h2>

    <hr>

    <div>
        <span class="button_Set">
            <button class="basicButton" onClick="goDetail();">정의현황</button>
            <button class="basicButton"> export </button>
            <button class="basicButton" onclick="reset();">초기화</button>
            <button class="basicButton" onclick="loadEtl();">조회</button>
        </span>
    </div>

    <div>
        <span>
            <label>ETL 설명 :</label>
            <input class="textBox1" id="etlContext" type="text" onkeyup="fnChkByte(this, 100);">
            <label>ETL 그륩명 :</label>
            <select class="combobox1" id="etlGroups" onchange="loadTypeChange(value)">
            </select>
            <label>적재 유형 :</label>
            <select class="combobox1" id="loadTypes">
                <option>전체</option>
            </select>
        </span>
    </div>

    <hr>

    <div class="table1Container">
        <table class="scrolltbody1">
            <thead>
            <th>No</th>
            <th>ETL 그룹명</th>
            <th>추출 대상</th>
            <th>추출 위치</th>
            <th>적재 대상</th>
            <th>적재 위치</th>
            <th>적재 유형</th>
            <th>설명</th>
            <th>스케쥴링여부</th>
            </thead>
            <tbody class="tbody1" id="structuredETL"></tbody>
        </table>
    </div>
</div>

<hr>

<span class="button_Set">
    <button class="basicButton" onclick="reset1();">초기화</button>
    <button id="insert" class="basicButton" onclick="insertETL()" style="display: inline-block">저장</button>
    <button id="update" class="basicButton" onclick="updateETL()" style="display: none">수정</button>
    <button id="delete" class="basicButton" onclick="deleteETL()" disabled="true">삭제</button>
</span>

<div><h3>정형 ETL 작업 등록/수정/삭제</h3></div>

<div class="CURD_Container">
    <span class="CRUD_left_basic">
        <div>
            <span><strong>기본정보</strong></span>
            <div>
                <span>
                    <label>ETL 그룹명 :</label>
                    <select id="etlGroupNameInColumn" class="comboBox2" style="display: inline-block;"
                            onchange="setSample(value)" readonly="true" ><option value="선택">선택</option></select>
                    <input id="etlGroupNameInColumnText" class="textBox2" style="display: none;" readonly="true" type="text" value="선택"/>
                </span>
            </div>
            <div>
                <label>ETL 설명 &nbsp&nbsp&nbsp:</label>
                <input id="etlGroupContextInColumn" class="textBox2" type="text" onkeyup="fnChkByte(this, 100)" >
                <span class="button_Set">
                    <button class="basicButton">매핑</button>
                    <button class="basicButton">검증 정의</button>
                    <button class="basicButton">Export</button>
                </span>
            </div>
        </div>
        <div class="secondTableContainer">
            <table class="scrolltbody2" border="1">
                <thead>
                <tr>
                    <th style="border: 2px solid #000; " rowspan="2">NO</th>
                    <th style="border: 2px solid #000; " colspan="2" span>추출</th>
                    <th style="border: 2px solid #000; " colspan="2" span>적재</th>
                    <th style="border: 2px solid #000; " rowspan="2">변환코드</th>
                </tr>
                <tr>
                    <th style="width: 139px; border: 2px solid #000; ">COLUMN</th>
                    <th style="width: 69px; border: 2px solid #000;">TYPE</th>
                    <th style="width: 139px; border: 2px solid #000;">COLUMN</th>
                    <th style="width: 69px; border: 2px solid #000;">TYPE</th>
                </tr>
                </thead>
                <tbody class="tbody2" id="etlColumns"></tbody>
            </table>
        </div>
    </span>
    <span class="CRUD_left">
        <span><strong>추출</strong></span>
        <div id="extract" style="margin-top: 10px;">
            <label>유형</label><input class="text" type="text" value="그룹선택">
        </div>
    </span>
    <span class="CRUD_left">
        <span><strong>적재</strong></span>
        <div id="load" style="margin-top: 10px;">
            <label>유형</label><input class="text" type="text" value="그룹선택">
        </div>
    </span>
</div>
</body>
</html>