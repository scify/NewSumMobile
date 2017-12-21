import {HttpClient} from "@angular/common/http";
export class SOAPClientParameters {
  private _pl;

  constructor() {
    this._pl = [];
  }

  add(name, value) {
    this._pl[name] = value;
    return this;
  }

  toXml() {
    var xml = "";
    for (var p in this._pl) {
      switch (typeof(this._pl[p])) {
        case "string":
        case "number":
        case "boolean":
        case "object":
          xml += "<" + p + ">" + this._serialize(this._pl[p]) + "</" + p + ">";
          break;
        default:
          break;
      }
    }
    return xml;
  }

  _serialize(o) {
    var s = "";
    switch (typeof(o)) {
      case "string":
        s += o.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
        break;
      case "number":
      case "boolean":
        s += o.toString();
        break;
      case "object":
        // Date
        if (o.constructor.toString().indexOf("function Date()") > -1) {

          var year = o.getFullYear().toString();
          var month = (o.getMonth() + 1).toString();
          month = (month.length == 1) ? "0" + month : month;
          var date = o.getDate().toString();
          date = (date.length == 1) ? "0" + date : date;
          var hours = o.getHours().toString();
          hours = (hours.length == 1) ? "0" + hours : hours;
          var minutes = o.getMinutes().toString();
          minutes = (minutes.length == 1) ? "0" + minutes : minutes;
          var seconds = o.getSeconds().toString();
          seconds = (seconds.length == 1) ? "0" + seconds : seconds;
          var milliseconds = o.getMilliseconds().toString();
          var tzminutes = Math.abs(o.getTimezoneOffset());
          var tzhours = 0;
          while (tzminutes >= 60) {
            tzhours++;
            tzminutes -= 60;
          }
          tzminutes = (tzminutes.toString().length == 1) ? "0" + tzminutes.toString() : tzminutes.toString();
          tzhours = (tzhours.toString().length == 1) ? "0" + tzhours.toString() : tzhours.toString();
          var timezone = ((o.getTimezoneOffset() < 0) ? "+" : "-") + tzhours + ":" + tzminutes;
          s += year + "-" + month + "-" + date + "T" + hours + ":" + minutes + ":" + seconds + "." + milliseconds + timezone;
        }
        // Array
        else if (o.constructor.toString().indexOf("function Array()") > -1) {
          for (var p in o) {
            if (!isNaN(p))   // linear array
            {
              (/function\s+(\w*)\s*\(/ig).exec(o[p].constructor.toString());
              var type = RegExp.$1;
              switch (type) {
                case "":
                  type = typeof(o[p]);
                case "String":
                  type = "string";
                  break;
                case "Number":
                  type = "int";
                  break;
                case "Boolean":
                  type = "bool";
                  break;
                case "Date":
                  type = "DateTime";
                  break;
              }
              s += "<" + type + ">" + this._serialize(o[p]) + "</" + type + ">"
            }
            else    // associative array
              s += "<" + p + ">" + this._serialize(o[p]) + "</" + p + ">"
          }
        }
        // Object or custom function
        else
          for (var p in o)
            s += "<" + p + ">" + this._serialize(o[p]) + "</" + p + ">";
        break;
      default:
        break; // throw new Error(500, "SOAPClientParameters: type '" + typeof(o) + "' is not supported");
    }
    return s;
  }
}

export class SOAPClient {
  private userName = null;
  private password = null;
  private SOAPClient_cacheWsdl = [];
  private httpClient:HttpClient;
  constructor(private httpClient:HttpClient){

  }
  invoke = function (url, method, parameters, async, callback) {
    if (async)
      this._loadWsdl(url, method, parameters, async, callback);
    else
      return this._loadWsdl(url, method, parameters, async, callback);
  }

  _loadWsdl(url, method, parameters, async, callback) {
    // load from cache?
    var wsdl = this.SOAPClient_cacheWsdl[url];
    if (wsdl + "" != "" && wsdl + "" != "undefined")
      return this._sendSoapRequest(url, method, parameters, async, callback, wsdl);
    // get wsdl
    var xmlHttp = this._getXmlHttp();
  //  let response = this.httpClient.get(url + "?wsdl").subscribe(data =>{
     // console.log(data);
   // });

    //todo: this maybe should be replaced
    xmlHttp.open("GET", url + "?wsdl", async);
    if (async) {
      let self = this;
      xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4)
          self._onLoadWsdl(url, method, parameters, async, callback, xmlHttp);
      }
    }

    xmlHttp.send(null);
    if (!async)
      return this._onLoadWsdl(url, method, parameters, async, callback, xmlHttp);
  }

  _onLoadWsdl(url, method, parameters, async, callback, req) {
    var wsdl = req.responseXML;
    this.SOAPClient_cacheWsdl[url] = wsdl;	// save a copy in cache
    return this._sendSoapRequest(url, method, parameters, async, callback, wsdl);
  }

  _sendSoapRequest(url, method, parameters, async, callback, wsdl) {
    // get namespace
    var ns = (wsdl.documentElement.attributes["targetNamespace"] + "" == "undefined") ? wsdl.documentElement.attributes.getNamedItem("targetNamespace").nodeValue : wsdl.documentElement.attributes["targetNamespace"].value;
    // build SOAP request
    var sr =
      "<?xml version=\"1.0\" encoding=\"utf-8\"?>" +
      "<soap:Envelope " +
      "xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" " +
      "xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" " +
      "xmlns:soap=\"http://schemas.xmlsoap.org/soap/envelope/\">" +
      "<soap:Body>" +
      "<" + method + " xmlns=\"" + ns + "\">" +
      parameters.toXml() +
      "</" + method + "></soap:Body></soap:Envelope>";
    // send request
    //todo: replace with HttpClient?
    var xmlHttp = this._getXmlHttp();
    if (this.userName && this.password) {
      xmlHttp.open("POST", url, async, this.userName, this.password);
      // Some WS implementations (i.e. BEA WebLogic Server 10.0 JAX-WS) don't support Challenge/Response HTTP BASIC, so we send authorization headers in the first request
      xmlHttp.setRequestHeader("Authorization", "Basic " + this._toBase64(this.userName + ":" + this.password));
    }
    else
      xmlHttp.open("POST", url, async);
    var soapaction = ((ns.lastIndexOf("/") != ns.length - 1) ? ns + "/" : ns) + method;
    xmlHttp.setRequestHeader("SOAPAction", soapaction);
    xmlHttp.setRequestHeader("Content-Type", "text/xml; charset=utf-8");
    if (async) {
      var self = this;
      xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4)
          self._onSendSoapRequest(method, async, callback, wsdl, xmlHttp);
      }
    }
    xmlHttp.send(sr);
    if (!async)
      return this._onSendSoapRequest(method, async, callback, wsdl, xmlHttp);
  }

  _onSendSoapRequest(method, async, callback, wsdl, req) {
    var o = null;
    var nd = this._getElementsByTagName(req.responseXML, method + "Result");
    if (nd.length == 0)
      nd = this._getElementsByTagName(req.responseXML, "return");	// PHP web Service?
    if (nd.length == 0) {
      if (req.responseXML.getElementsByTagName("faultcode").length > 0) {
        if (async || callback)
          o = new Error(req.responseXML.getElementsByTagName("faultstring")[0].childNodes[0].nodeValue);
        else
          throw new Error(req.responseXML.getElementsByTagName("faultstring")[0].childNodes[0].nodeValue);
      }
    }
    else
      o = this._soapresult2object(nd[0], wsdl);
    if (callback)
      callback(o, req.responseXML);
    if (!async)
      return o;
  }

  _soapresult2object(node, wsdl) {
    var wsdlTypes = this._getTypesFromWsdl(wsdl);
    return this._node2object(node, wsdlTypes);
  }

  _node2object(node, wsdlTypes) {
    // null node
    if (node == null)
      return null;
    // text node
    if (node.nodeType == 3 || node.nodeType == 4)
      return this._extractValue(node, wsdlTypes);
    // leaf node
    if (node.childNodes.length == 1 && (node.childNodes[0].nodeType == 3 || node.childNodes[0].nodeType == 4))
      return this._node2object(node.childNodes[0], wsdlTypes);
    var isarray = this._getTypeFromWsdl(node.nodeName, wsdlTypes).toLowerCase().indexOf("arrayof") != -1;
    // object node
    if (!isarray) {
      var obj = null;
      if (node.hasChildNodes())
        obj = new Object();
      for (var i = 0; i < node.childNodes.length; i++) {
        var p = this._node2object(node.childNodes[i], wsdlTypes);
        obj[node.childNodes[i].nodeName] = p;
      }
      return obj;
    }
    // list node
    else {
      // create node ref
      var l = new Array();
      for (var i = 0; i < node.childNodes.length; i++)
        l[l.length] = this._node2object(node.childNodes[i], wsdlTypes);
      return l;
    }
    return null;
  }

  _extractValue(node, wsdlTypes) {
    var value = node.nodeValue;
    switch (this._getTypeFromWsdl(node.parentNode.nodeName, wsdlTypes).toLowerCase()) {
      default:
      case "s:string":
        return (value != null) ? value + "" : "";
      case "s:boolean":
        return value + "" == "true";
      case "s:int":
      case "s:long":
        return (value != null) ? parseInt(value + "", 10) : 0;
      case "s:double":
        return (value != null) ? parseFloat(value + "") : 0;
      case "s:datetime":
        if (value == null)
          return null;
        else {
          value = value + "";
          value = value.substring(0, (value.lastIndexOf(".") == -1 ? value.length : value.lastIndexOf(".")));
          value = value.replace(/T/gi, " ");
          value = value.replace(/-/gi, "/");
          var d = new Date();
          d.setTime(Date.parse(value));
          return d;
        }
    }
  }

  _getTypesFromWsdl(wsdl) {
    var wsdlTypes = new Array();
    // IE
    var ell = wsdl.getElementsByTagName("s:element");
    var useNamedItem = true;
    // MOZ
    if (ell.length == 0) {
      ell = wsdl.getElementsByTagName("element");
      useNamedItem = false;
    }
    for (var i = 0; i < ell.length; i++) {
      if (useNamedItem) {
        if (ell[i].attributes.getNamedItem("name") != null && ell[i].attributes.getNamedItem("type") != null)
          wsdlTypes[ell[i].attributes.getNamedItem("name").nodeValue] = ell[i].attributes.getNamedItem("type").nodeValue;
      }
      else {
        if (ell[i].attributes["name"] != null && ell[i].attributes["type"] != null)
          wsdlTypes[ell[i].attributes["name"].value] = ell[i].attributes["type"].value;
      }
    }
    return wsdlTypes;
  }

  _getTypeFromWsdl(elementname, wsdlTypes) {
    var type = wsdlTypes[elementname] + "";
    return (type == "undefined") ? "" : type;
  }

// private: utils
  _getElementsByTagName(document, tagName) {
    try {
      // trying to get node omitting any namespaces (latest versions of MSXML.XMLDocument)
      return document.selectNodes(".//*[local-name()=\"" + tagName + "\"]");
    }
    catch (ex) {
    }
    // old XML parser support
    return document.getElementsByTagName(tagName);
  }

// private: xmlhttp factory
  _getXmlHttp() {
    try {
      if (XMLHttpRequest) {
        var req = new XMLHttpRequest();
        // some versions of Moz do not support the readyState property and the onreadystate event so we patch it!
        if (req.readyState == null) {
          req.readyState = 1;
          req.addEventListener("load",
            function () {
              req.readyState = 4;
              if (typeof req.onreadystatechange == "function")
                req.onreadystatechange();
            },
            false);
        }
        return req;
      }

    }
    catch (ex) {
    }
    throw new Error("Your browser does not support XmlHttp objects");
  }

  _getXmlHttpProgID() {
    /*if (this._getXmlHttpProgID.progid)
     return this._getXmlHttpProgID.progid;
     var progids = ["Msxml2.XMLHTTP.5.0", "Msxml2.XMLHTTP.4.0", "MSXML2.XMLHTTP.3.0", "MSXML2.XMLHTTP", "Microsoft.XMLHTTP"];
     var o;
     for (var i = 0; i < progids.length; i++) {
     try {
     o = new ActiveXObject(progids[i]);
     return this._getXmlHttpProgID.progid = progids[i];
     }
     catch (ex) {
     }
     ;
     }*/
    throw new Error("Could not find an installed XML parser");
  }

  _toBase64(input) {
    var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    var output = "";
    var chr1, chr2, chr3;
    var enc1, enc2, enc3, enc4;
    var i = 0;

    do {
      chr1 = input.charCodeAt(i++);
      chr2 = input.charCodeAt(i++);
      chr3 = input.charCodeAt(i++);

      enc1 = chr1 >> 2;
      enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
      enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
      enc4 = chr3 & 63;

      if (isNaN(chr2)) {
        enc3 = enc4 = 64;
      } else if (isNaN(chr3)) {
        enc4 = 64;
      }

      output = output + keyStr.charAt(enc1) + keyStr.charAt(enc2) +
        keyStr.charAt(enc3) + keyStr.charAt(enc4);
    } while (i < input.length);

    return output;
  }


}





