package dao;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;

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
    public JSONArray getJsonArray(String query) throws SQLException {
        //  Query를 날림!
        Connection connection = getConnection();
        PreparedStatement preparedStatement = connection.prepareStatement(query);
        JSONArray jsonArray = new JSONArray();

        //select 일 경우
        try {
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
                jsonArray.add(obj);
            }
            resultSet.close();

            //  insert or update or delete 일 경우
        } catch (Exception e) {
            int rowCount = preparedStatement.executeUpdate();
            jsonArray.add(new JSONObject().put("INSERT", rowCount));
        }
        //  닫아주기
        preparedStatement.close();
        connection.close();

        return jsonArray;
    }

    public final java.sql.Connection getConnection() throws SQLException {
        return DriverManager.getConnection("jdbc:mysql://127.0.0.1:3306/iu?verifyServerCertificate=false&useSSL=false&serverTimezone=UTC", "root", "1234");
    }

}
