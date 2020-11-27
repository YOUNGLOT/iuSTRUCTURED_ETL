var getETLGroupNameQuery = `
select ETL_GROUP_NAME from etl_group
`;

var getLoadTypeQuery = `
select (select CODE_NAME from code where CODE_ID = LOAD_TYPE_CODE) as LOAD_TYPE from etl_group_load_type_code where ETL_GROUP_ID = (select ETL_GROUP_ID from etl_group where ETL_GROUP_NAME = etlGroupName )
`;

var loadEtlQuery = `
select 
structured_etl.STRUCTURED_ETL_ID as STRUCTURED_ETL_ID,
etl_group.ETL_GROUP_NAME as ETL_GROUP_NAME,
(select CODE_NAME from code where CODE_ID = etl_group.EXTRACT_OBJECT_CODE) as EXTRACT_OBJECT, 
(select CODE_NAME from code where CODE_ID = etl_group.LOAD_OBJECT_CODE) as LOAD_OBJECT,
ifnull((select CODE_NAME from code where CODE_ID = structured_etl.LOAD_TYPE_CODE), '-') as LOAD_TYPE,
ifnull(structured_etl.EXTRACT_REMOTE_PATH, ifnull(structured_etl.EXTRACT_TABLE_NAME, structured_etl.EXTRACT_FILEPATH)) as EXTRACT_LOCATION,
ifnull(structured_etl.LOAD_TABLE_NAME, ifnull(structured_etl.LOAD_PATH, structured_etl.LOAD_DB)) as LOAD_LOCATION,
structured_etl.CONTEXT as CONTEXT,
structured_etl.SCHEDULE as SCHEDULE
from etl_group as etl_group
right join structured_etl as structured_etl 
on structured_etl.ETL_GROUP_ID = etl_group.ETL_GROUP_ID 
`;

var etlClickQuery = `
select 
 STRUCTURED_ETL_COLUMN_ID,
 EXTRACT_COLUMN,
 EXTRACT_TYPE,
 LOAD_COLUMN,
 LOAD_TYPE,
 CONVERSION_CODE
from structured_etl_column
where STRUCTURED_ETL_ID = jsSTRUCTURED_ETL_ID ;

_splitString_
    
select 
(select CODE_NAME from code where CODE_ID = EXTRACT_DELIMITER_CODE) as EXTRACT_DELIMITER_CODE,
(select CODE_NAME from code where CODE_ID = EXTRACT_CHARSET_CODE) as EXTRACT_CHARSET_CODE,
EXTRACT_FILEPATH,
EXTRACT_DB,
(select CODE_NAME from code where CODE_ID = EXTRACT_COLLECTION_RANGE_CODE) as EXTRACT_COLLECTION_RANGE_CODE,
EXTRACT_TABLE_NAME,
(select CODE_NAME from code where CODE_ID = EXTRACT_COMPRESSION_TYPE_CODE) as EXTRACT_COMPRESSION_TYPE_CODE,
EXTRACT_REMOTE_PATH,
EXTRACT_STANDARD_COLUMN,
EXTRACT_SPLITBY,
EXTRACT_ERASE_HEADER,
EXTRACT_DELETE_OPTION,
EXTRACT_SOURCE_COLUMN,
LOAD_DB,
(select CODE_NAME from code where CODE_ID = LOAD_FORMAT_CODE) as LOAD_FORMAT_CODE,
LOAD_TABLE_NAME,
LOAD_TABLE_CONTEXT,
(select CODE_NAME from code where CODE_ID = LOAD_DELIMITER_CODE) as LOAD_DELIMITER_CODE,
(select CODE_NAME from code where CODE_ID = LOAD_CHARSET_CODE) as LOAD_CHARSET_CODE,
LOAD_PATH,
(select CODE_NAME from code where CODE_ID = LOAD_COMPRESSION_TYPE_CODE) as LOAD_COMPRESSION_TYPE_CODE,
LOAD_PARTITION,
(select CODE_NAME from code where CODE_ID = LOAD_TYPE_CODE) as LOAD_TYPE_CODE,
(select CODE_NAME from code where CODE_ID = LOAD_MERGE_OPT_CODE) as LOAD_MERGE_OPT_CODE,
LOAD_DELETE_STANDARD_COLUMN,
LOAD_DELETE_STANDARD_VALUE
from structured_etl 
where STRUCTURED_ETL_ID = jsSTRUCTURED_ETL_ID ;

_splitString_

select * from code;
`;

var definitionQuery = `
select 
(select ETL_GROUP_NAME from etl_group where ETL_GROUP_ID = structured_etl.ETL_GROUP_ID) as ETL_GROUP_NAME,
count(*) as COUNT,
count(distinct(structured_etl.SCHEDULE)) as SCHEDULE
from structured_etl as structured_etl
GROUP BY ETL_GROUP_ID;
`;

var setSampleQuery = `
select 
(select CODE_NAME from code where CODE_ID = etl_group.EXTRACT_OBJECT_CODE) as EXTRACT_OBJECT_CODE,
(select CODE_NAME from code where CODE_ID = etl_group.LOAD_OBJECT_CODE) as LOAD_OBJECT_CODE
 from etl_group as etl_group where etl_group.ETL_GROUP_NAME = jsValue ;

_splitString_

select 
(select CODE_NAME from code where CODE_ID = EXTRACT_DELIMITER_CODE) as EXTRACT_DELIMITER_CODE,
(select CODE_NAME from code where CODE_ID = EXTRACT_CHARSET_CODE) as EXTRACT_CHARSET_CODE,
EXTRACT_FILEPATH,
EXTRACT_DB,
(select CODE_NAME from code where CODE_ID = EXTRACT_COLLECTION_RANGE_CODE) as EXTRACT_COLLECTION_RANGE_CODE,
EXTRACT_TABLE_NAME,
(select CODE_NAME from code where CODE_ID = EXTRACT_COMPRESSION_TYPE_CODE) as EXTRACT_COMPRESSION_TYPE_CODE,
EXTRACT_REMOTE_PATH,
EXTRACT_STANDARD_COLUMN,
EXTRACT_SPLITBY,
EXTRACT_ERASE_HEADER,
EXTRACT_DELETE_OPTION,
EXTRACT_SOURCE_COLUMN,
LOAD_DB,
(select CODE_NAME from code where CODE_ID = LOAD_FORMAT_CODE) as LOAD_FORMAT_CODE,
LOAD_TABLE_NAME,
LOAD_TABLE_CONTEXT,
(select CODE_NAME from code where CODE_ID = LOAD_DELIMITER_CODE) as LOAD_DELIMITER_CODE,
(select CODE_NAME from code where CODE_ID = LOAD_CHARSET_CODE) as LOAD_CHARSET_CODE,
LOAD_PATH,
(select CODE_NAME from code where CODE_ID = LOAD_COMPRESSION_TYPE_CODE) as LOAD_COMPRESSION_TYPE_CODE,
LOAD_PARTITION,
(select CODE_NAME from code where CODE_ID = LOAD_TYPE_CODE) as LOAD_TYPE_CODE,
(select CODE_NAME from code where CODE_ID = LOAD_MERGE_OPT_CODE) as LOAD_MERGE_OPT_CODE,
LOAD_DELETE_STANDARD_COLUMN,
LOAD_DELETE_STANDARD_VALUE
from structured_etl 
where ETL_GROUP_ID = (select ETL_GROUP_ID from etl_group where ETL_GROUP_NAME = jsValue )
limit 1;

_splitString_

select * from code;
`;

