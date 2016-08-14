/*
 *
 */

$(document).ready(function() {

  LOOP_LIMIT = 1000;

  // 初期値設定
  function init() {
    var data = {
      "monster": [],
      "candy": 0,
      "exp": 0,
      "required_candy": 12,
      "per_exp": 500
    };
    // .monster
    $("form#input .monster").each(function(){
      data["monster"].push(parseInt($(this).val()));
    });
    // .candy
    data["candy"] = parseInt($(".candy").val());
    // .required_candy
    data["required_candy"] = parseInt($(".required_candy").val());
    // .use_egg
    if ($(".use_egg").prop('checked')) {
      data["per_exp"] = 1000;
    }

    output_detail("初期状態" , data, "warning");
    return data;
  }

  // モンスター数の集計
  function count_monsters(data) {
    var num_of_monsters = 0;
    $.each(data["monster"], function(){
      num_of_monsters += this;
    });
    return num_of_monsters;
  }

  function send(data) {
    if (data["candy"] < data["required_candy"]) {
      var _required_candy = data["required_candy"] - data["candy"];

      for(var i = data["monster"].length - 1; i >= 0; i -= 1) {
        var monster = 0;
        if (i > 0) {
          monster = data["monster"][i];
        } else {
          monster = data["monster"][i] - 1;
        }

        if (monster > 0 && _required_candy > 0) {
          var _send_monsters = Math.min(monster, _required_candy);
          data["monster"][i] -= _send_monsters;
          data["candy"] += _send_monsters;
          _required_candy -= _send_monsters;
          output_detail("Monster " + (i+1) + "を"+  _send_monsters + "匹、博士に送る。" , data, "normal");
        }
      }
    }
    return data;
  }

  function evolve(data) {
    if (data["candy"] >= data["required_candy"]) {
      var num_of_evolution = parseInt(data["candy"] / data["required_candy"])
      if (num_of_evolution > data["monster"][0]) {
        num_of_evolution = data["monster"][0];
      }
      data["monster"][0] -= num_of_evolution; 
      data["monster"][1] += num_of_evolution; 
      data["candy"] -= num_of_evolution * data["required_candy"];
      data["exp"] += num_of_evolution * data["per_exp"];
      output_detail("Monster 1を" + num_of_evolution + "匹、進化させる。 ", data, "danger");
    }
    return data;
  }
  
  function output_summary(data) {
    var title = "経験値: " + data["exp"];
    $("#output-summary .panel-title").append(title);
    
    var body = "";
    body += "<p>残り</p>"
    body += "Monster 1 : <b>" + data["monster"][0] + "匹</b><br />";
    body += "Monster 2 : <b>" + data["monster"][1] + "匹</b><br />";
    body += "Monster 3 : <b>" + data["monster"][2] + "匹</b><br />";
    body += "Candy : <b>" + data["candy"] + "個</b><br />";
    $("#output-summary .panel-body").append(body);
  }

  function output_detail(str, data, klass) {
    var o = "<tr class=\"" + klass + "\">";
    var index = $("#output-detail tbody tr").length;
    o += "<th>" + index + "</th>";
    o += "<td>" + str + "</td>";
    o += "<td>" + data["exp"] + "</td>";
    o += "<td>";
    o += "1: " + data["monster"][0] + "匹<br />";
    o += "2: " + data["monster"][1] + "匹<br />";
    o += "3: " + data["monster"][2] + "匹<br />";
    o += "</td>";
    o += "<td>" + data["candy"] + "個</td>";
    o += "</tr>";
    $("#output-detail tbody").append(o);
  }


  $("form#input").submit(function(e){
    e.preventDefault();

    $("#output-summary .panel-title").empty();
    $("#output-summary .panel-body").empty();
    $("#output-detail tbody").empty();

    var data = init();

    var l = 0;
    while (l < LOOP_LIMIT
            && data["monster"][0] > 0
            && data["candy"] + count_monsters(data) - 1 >= data["required_candy"]) {
      l += 1;
      data = send(data);
      data = evolve(data);
    }
    console.log(data);

    output_summary(data);
    $("#output-summary").show();
    $("#output-summary-noresults").hide();
    
    $("#output-detail").show();
    $("#output-detail-noresults").hide();
  });
});

