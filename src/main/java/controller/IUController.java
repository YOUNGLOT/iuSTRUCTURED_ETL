package controller;

import dao.Dao;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.sql.SQLException;

@Controller
public class IUController {

    @GetMapping("/IU")
    public String iu() {
        return "IU";
    }

    @RequestMapping(value = "/ajax", method = RequestMethod.POST, produces = "application/text; charset=utf8")
    @ResponseBody
    public String ajaxGet(@RequestBody String requestString) throws SQLException {
        //  넘겨 받은 값 확인!
        System.out.printf("Ajax Request  : %s\n",requestString = requestString.replace("\"", "").replace("\\n", " "));
        //  여러개가 올 수 있으니 제가 정한 String 으로 나눔!
        String[] requestStrings = requestString.split("_splitString_");

        //  driver 로딩 하고
        try {
            Class.forName("com.mysql.jdbc.Driver");
        } catch (ClassNotFoundException e) {
            System.out.println("mysql driver ClassNotFoundException" + e.toString());
        }

        //  DB 에서 값을 가져 온 후 JsonArray 에 담아 return
        JSONArray responseJsonArray = new JSONArray();
        for (String query : requestStrings) {
            //responseJsonArray.add(Dao.getInstance().getJsonArray(query));
            JSONArray data = Dao.getInstance().getJsonArray(query);
            System.out.printf("Ajax Response : %s\n",data.toJSONString());
            responseJsonArray.add(data);
        }
        return responseJsonArray.toJSONString();
    }
}


