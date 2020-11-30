package dao;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import tool.Tool;
import java.sql.*;

public class Dao {

    //region singleton
    private Dao() {
    }

    private static Dao _instance;

    public static Dao getInstance() {
        if (_instance == null)
            _instance = new Dao();

        return _instance;
    }
    //endregion

    //  Query의 결과를 JsonArray로 리턴하는 Method
    public JSONArray getJsonArray(String type, String query) throws SQLException {
        //  Query를 날림!
        Connection connection = Tool.getInstance().getConnection(0);
        PreparedStatement preparedStatement = connection.prepareStatement(query);

        //  결과
        JSONArray resultJSONArray = new JSONArray();

        //select 일 경우
        if(type.equals("select")){
            ResultSet resultSet = preparedStatement.executeQuery();

            //  MetaData를 가져 온 후 결과를 Json 에 담기 위해 Columns 를 가져옴
            ResultSetMetaData resultSetMetaData = resultSet.getMetaData();
            String[] columns = new String[resultSetMetaData.getColumnCount()];
            for (int i = 0; i < resultSetMetaData.getColumnCount(); i++) {
                columns[i] = resultSetMetaData.getColumnName(i + 1);
            }

            //  MetaData를 이용해 resulSet 을 Json 으로
            while (resultSet.next()) {
                JSONObject obj = new JSONObject();
                for (int i = 0; i < columns.length; i++) {
                    obj.put(columns[i], resultSet.getString(columns[i]));
                }
                resultJSONArray.add(obj);
            }
            resultSet.close();

            //  insert || update || delete 일 경우
        } else {
            int rowCount = preparedStatement.executeUpdate();
            resultJSONArray.add(new JSONObject().put(type, rowCount));
        }
        //  닫아주기
        preparedStatement.close();
        connection.close();

        return resultJSONArray;
    }
}
