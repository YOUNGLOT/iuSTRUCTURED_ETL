package controller;

import dao.Dao;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import tool.Tool;

import java.sql.SQLException;

@Controller
public class IUController {

    //  pageMapper
    @GetMapping("/IU")
    public String iu() {
        return "IU";
    }

    //  ajaxMapper
    @RequestMapping(value = "/postAjax", method = RequestMethod.POST, produces = "application/text; charset=utf8")// produce charset설정
    @ResponseBody
    public String postAjax(@RequestBody String request) throws SQLException, ParseException {
        System.out.println("postAjax request : " + request);

        JSONParser jsonParser = new JSONParser();
        JSONArray requestJsonArray = (JSONArray) jsonParser.parse(jsonParser.parse(request).toString()), responseJsonArray = new JSONArray();

        for (Object obj : requestJsonArray) {
            JSONObject jsonObject = (JSONObject) obj;

            String type = (String) jsonObject.get("type"), query = Tool.getInstance().queryCollector().get(jsonObject.get("query"));
            for (int i = 0; i < jsonObject.size() - 2; i++) {
                query = query.replaceAll("replaceString" + i, (String) jsonObject.get("replaceString" + i));
            }

            System.out.println("query : " + query);

            JSONArray data = Dao.getInstance().getJsonArray(type, query);
            System.out.printf("postAjax Response : %s\n", data.toJSONString());
            responseJsonArray.add(data);
        }

        return responseJsonArray.toJSONString();
    }
}
