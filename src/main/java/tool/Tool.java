package tool;

import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.SAXException;

import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import java.io.File;
import java.io.IOException;
import java.sql.DriverManager;
import java.util.HashMap;
import java.util.Map;

public class Tool {

    //region singleton
    private Tool() {
    }

    private static Tool _instance;

    public static Tool getInstance() {
        if (_instance == null)
            _instance = new Tool();

        return _instance;
    }
    //endregion

    //  for java
    //  private final String XMLFILEPATH = "./src/main/resources/IUDB.xml";
    //  for tomcat
    private final String XML_FILE_PATH = "IUDB.xml";

    public final java.sql.Connection getConnection(int connectionIndex) {

        try {
            Node queryNode = getNodeListByTagName("connection").item(connectionIndex);
            String url = "", id = "", password = "";

            if (queryNode.getNodeType() == Node.ELEMENT_NODE) {
                Element personElmnt = (Element) queryNode;
                url = personElmnt.getElementsByTagName("url").item(0).getFirstChild().getNodeValue();
                id = personElmnt.getElementsByTagName("id").item(0).getFirstChild().getNodeValue();
                password = personElmnt.getElementsByTagName("password").item(0).getFirstChild().getNodeValue();
            } else {
                System.out.println("IUDB.xml <connection> 에러 : 양식에 맞게 작성해주세요");
            }

            //  driver 로딩 하고
            Class.forName("com.mysql.jdbc.Driver");
            return DriverManager.getConnection(url, id, password);

        } catch (ClassNotFoundException e) {
            System.out.println("MySql Jdbc Driver 로딩이 안됨!");
            e.printStackTrace();

        } catch (Exception e) {
            System.out.println("Tool 에서 Connection 받아오기 실패");
            e.printStackTrace();
        }
        return null;
    }

    public Map<String, String> getIdQueryMap() {
        try {
            Map<String, String> map = new HashMap<>();
            NodeList queryList = getNodeListByTagName("query");

            for (int i = 0; i < queryList.getLength(); i++) {
                Node queryNode = queryList.item(i);
                if (queryNode.getNodeType() == Node.ELEMENT_NODE) {
                    Element personElmnt = (Element) queryNode;
                    String id = personElmnt.getElementsByTagName("id").item(0).getFirstChild().getNodeValue();
                    String value = personElmnt.getElementsByTagName("value").item(0).getFirstChild().getNodeValue();
                    map.put(id, value);
                }
            }
            return map;
        } catch (Exception e) {
            System.out.println("Tool 에서 Query 받아오기 실패");
            e.printStackTrace();
            return null;
        }
    }

    private NodeList getNodeListByTagName(String tagName) throws ParserConfigurationException, IOException, SAXException {
        Document document = DocumentBuilderFactory.newInstance().newDocumentBuilder().parse(new File(XML_FILE_PATH));
        document.getDocumentElement().normalize();
        return document.getElementsByTagName(tagName);
    }
}
