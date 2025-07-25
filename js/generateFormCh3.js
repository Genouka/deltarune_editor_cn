
function generateForm(data){
  var formString = "";

  //File Data


  formString += `<div id='tab_main' class='tab'>`;

  formString += "<div id='main_box'>";
  formString += "Main<br>";
  formString += generateTextInput(`_1`,"存档名称",data[`_1`],[{length:10}],'filename');
  formString += generateNumberInput(`_11`,"D$",data[`_11`],{min:0,max:99999},'flag');
  formString += generateNumberInput(`_1597`,"PTs",data[`_1597`],{min:0,max:99999},'flag');
  formString += generateSelectCh2(`_3054`,"房间编码",data[`_3054`],rooms,'room_id');
  formString += `<label class='lineItem'><input type="checkbox" name="show_all_rooms" noinput="true"> Show all rooms</label><br>`

  formString += generateNumberInput(`_3053`,"故事剧情标志",data[`_3053`],{min:0,max:211},'flag');

  formString += generateTextboxInput(`_16`,`暗世界标志`,data[`_16`],{min:0,max:1},``);


  formString += "</div>";








  //Lightworld Kris stats
  formString += "<div id='lightworld_box'>";
  formString += `<img src='../../images/KrisLight.png'> 光世界的 "Kris"<br>`;
  formString += generateNumberInput(`_530`,"$",data[`_530`],{min:0,max:99999},'flag');
  formString += "<br>";
  formString += generateNumberInput(`_531`,"HP",data[`_531`],{min:-99999,max:99999},'character_hp');
  formString += " / ";
  formString += generateNumberInput(`_532`,"",data[`_532`],{min:-99999,max:99999},'character_hp');
  formString += "<br>";

  formString += `<div class='stats_block'>`

  formString += generateNumberInput(`_529`,"LV<br>",data[`_529`],{min:-99999,max:99999},'stat');
  formString += generateNumberInput(`_528`,"EXP<br>",data[`_528`],{min:-99999,max:99999},'stat');


  formString += generateNumberInput(`_533`,"AT<br>",data[`_533`],{min:-99999,max:99999},'stat');
  formString += generateNumberInput(`_534`,"DF<br>",data[`_534`],{min:-99999,max:99999},'stat');


  formString += `</div>`


  formString += generateSelectCh2(`_526`,"武器：",data[`_526`],lightworld_weapons,'grey_disable');
  formString += "<br>";
  formString += generateSelectCh2(`_527`,"防具：",data[`_527`],lightworld_armor,'grey_disable');

  formString += "</div>";




    formString += `</div>`;
    formString += `<div id='tab_party' class='tab'>`;


    //Party Box


    
    formString += "<div id='party_box'>";
    formString += `队伍 (几乎没有被使用)<br>`;
    formString += `<div id='party_display'></div>`



    formString += generateSelectCh2(`_8`,"成员 1: ",data[`_8`],party_members,'party_member_1 grey_disable');
    formString += "<br>";
    formString += generateSelectCh2(`_9`,"成员 2: ",data[`_9`],party_members,'party_member_2 grey_disable');
    formString += "<br>";
    formString += generateSelectCh2(`_10`,"成员 3: ",data[`_10`],party_members,'party_member_3 grey_disable');
    formString += "<br>";

    formString += `<label class='lineItem'><input type="checkbox" name="allow_broken_party" noinput="true">允许选择非正常队伍</label><br>`
    formString += "</div>";




    formString += "<div id='character_wrapper'>";
    //Kris stats
    formString += "<div class='character_box'>";
    formString += "<div class='character_name'><img src='../../images/Kris.png'> Kris</div><div id='status_kris'></div><br>";

    formString += generateNumberInput(`_79`,"HP",data[`_79`],{min:-99999,max:99999},'character_hp');
    formString += " / ";
    formString += generateNumberInput(`_80`,"",data[`_80`],{min:-99999,max:99999},'character_hp');
    formString += "<br>";

    formString += `<div class='stats_block'>`

    formString += generateNumberInput(`_81`,"ATK<br>",data[`_81`],{min:-99999,max:99999},'stat');
    formString += generateNumberInput(`_82`,"DEF<br>",data[`_82`],{min:-99999,max:99999},'stat');
    formString += generateNumberInput(`_83`,"MAG<br>",data[`_83`],{min:-99999,max:99999},'stat');


    formString += `</div>`





    formString += generateSelectCh2(`_85`,"<img src='../../images/Sword.png'>",data[`_85`],weapons,'grey_disable');
    formString += "<br>";
    formString += generateSelectCh2(`_86`,"<img src='../../images/Armor1.png'>",data[`_86`],armor,'grey_disable');
    formString += "<br>";
    formString += generateSelectCh2(`_87`,"<img src='../../images/Armor2.png'>",data[`_87`],armor,'grey_disable');
    formString += "<br><hr>";
    formString += "<div class='spells_title'><center>▼ 技能 ▼</center></div>";

    formString += "<div class='spell_wrapper'>"
    for(var i = 0; i < 6; i++){
      formString += generateSelectCh2(`_${i+129}`,`技能 ${i+1} `,data[`_${i+129}`],spells,'spell_slot grey_disable');
    }

    formString += "</div>";
    formString += "</div>";





    //Susie stats
    formString += "<div class='character_box'>";
    formString += "<div class='character_name'><img src='../../images/Susie.png'> Susie</div><div id='status_susie'></div><br>";
    formString += generateNumberInput(`_141`,"HP",data[`_141`],{min:-99999,max:99999},'character_hp');
    formString += " / ";
    formString += generateNumberInput(`_142`,"",data[`_142`],{min:-99999,max:99999},'character_hp');
    formString += "<br>";

    formString += `<div class='stats_block'>`

    formString += generateNumberInput(`_143`,"ATK<br>",data[`_143`],{min:-99999,max:99999},'stat');
    formString += generateNumberInput(`_144`,"DEF<br>",data[`_144`],{min:-99999,max:99999},'stat');
    formString += generateNumberInput(`_145`,"MAG<br>",data[`_145`],{min:-99999,max:99999},'stat');


    formString += `</div>`


    formString += generateSelectCh2(`_147`,"<img src='../../images/Axe.png'>",data[`_147`],weapons,'grey_disable');
    formString += "<br>";
    formString += generateSelectCh2(`_148`,"<img src='../../images/Armor1.png'>",data[`_148`],armor,'grey_disable');
    formString += "<br>";
    formString += generateSelectCh2(`_149`,"<img src='../../images/Armor2.png'>",data[`_149`],armor,'grey_disable');
    formString += "<br><hr>";
    formString += "<div class='spells_title'><center>▼ 技能 ▼</center></div>";

    formString += "<div class='spell_wrapper'>"
    for(var i = 0; i < 6; i++){
      formString += generateSelectCh2(`_${i+191}`,`技能 ${i+1} `,data[`_${i+191}`],spells,'spell_slot grey_disable');
    }

    formString += "</div>";
    formString += "</div>";




    //Ralsei stats
    formString += "<div class='character_box'>";
    formString += "<div class='character_name'><img src='../../images/Ralsei.png'> Ralsei</div><div id='status_ralsei'></div><br>";
    formString += generateNumberInput(`_203`,"HP",data[`_203`],{min:-99999,max:99999},'character_hp');
    formString += " / ";
    formString += generateNumberInput(`_204`,"",data[`_204`],{min:-99999,max:99999},'character_hp');
    formString += "<br>";

    formString += `<div class='stats_block'>`

    formString += generateNumberInput(`_205`,"ATK<br>",data[`_205`],{min:-99999,max:99999},'stat');
    formString += generateNumberInput(`_206`,"DEF<br>",data[`_206`],{min:-99999,max:99999},'stat');
    formString += generateNumberInput(`_207`,"MAG<br>",data[`_207`],{min:-99999,max:99999},'stat');


    formString += `</div>`


    formString += generateSelectCh2(`_209`,"<img src='../../images/Scarf.png'>",data[`_209`],weapons,'grey_disable');
    formString += "<br>";
    formString += generateSelectCh2(`_210`,"<img src='../../images/Armor1.png'>",data[`_210`],armor,'grey_disable');
    formString += "<br>";
    formString += generateSelectCh2(`_211`,"<img src='../../images/Armor2.png'>",data[`_211`],armor,'grey_disable');
    formString += "<br><hr>";
    formString += "<div class='spells_title'><center>▼ 技能 ▼</center></div>";

    formString += "<div class='spell_wrapper'>"
    for(var i = 0; i < 6; i++){
      formString += generateSelectCh2(`_${i+253}`,`技能 ${i+1} `,data[`_${i+253}`],spells,'spell_slot grey_disable');
    }

    formString += "</div>";
    formString += "</div>";





    //Noelle stats
    formString += "<div class='character_box'>";
    formString += "<div class='character_name'><img src='../../images/Noelle.png'> Noelle</div><div id='status_noelle'></div><br>";
    formString += generateNumberInput(`_265`,"HP",data[`_265`],{min:-99999,max:99999},'character_hp');
    formString += " / ";
    formString += generateNumberInput(`_266`,"",data[`_266`],{min:-99999,max:99999},'character_hp');
    formString += "<br>";

    formString += `<div class='stats_block'>`

    formString += generateNumberInput(`_267`,"ATK<br>",data[`_267`],{min:-99999,max:99999},'stat');
    formString += generateNumberInput(`_268`,"DEF<br>",data[`_268`],{min:-99999,max:99999},'stat');
    formString += generateNumberInput(`_269`,"MAG<br>",data[`_269`],{min:-99999,max:99999},'stat');


    formString += `</div>`


    formString += generateSelectCh2(`_271`,"<img src='../../images/Ring.png'>",data[`_271`],weapons,'grey_disable');
    formString += "<br>";
    formString += generateSelectCh2(`_272`,"<img src='../../images/Armor1.png'>",data[`_272`],armor,'grey_disable');
    formString += "<br>";
    formString += generateSelectCh2(`_273`,"<img src='../../images/Armor2.png'>",data[`_273`],armor,'grey_disable');
    formString += "<br><hr>";
    formString += "<div class='spells_title'><center>▼ 技能 ▼</center></div>";

    formString += "<div class='spell_wrapper'>"
    for(var i = 0; i < 6; i++){
      formString += generateSelectCh2(`_${i+315}`,`技能 ${i+1} `,data[`_${i+315}`],spells,'spell_slot grey_disable');
    }

    formString += "</div>";
    formString += "</div>";

    formString += "</div>";


    formString += `</div>`;
    formString += `<div id='tab_items' class='tab'>`;



    formString += "<div id='item_box_wrapper'>";

    //Items
    formString += "<div class='item_box'>";
    formString += "物品<br>";
    formString += "<div id='item_wrapper'>";

    for(var i = 0; i < 12; i++){
      formString += generateSelectCh2(`_${(i*2)+330}`,`槽位 ${i+1}<br>`,data[`_${(i*2)+330}`],items,'item_slot grey_disable');
    }
    formString += "</div>";
    formString += "</div>";


    //Key Items
    formString += "<div class='item_box'>";
    formString += "关键物品<br>";
    formString += "<div id='item_wrapper'>";
    for(var i = 0; i < 12; i++){
      formString += generateSelectCh2(`_${(i*2)+331}`,`槽位 ${i+1}<br>`,data[`_${(i*2)+331}`],key_items,'item_slot grey_disable');
    }
    formString += "</div>";
    formString += "</div>";





    //Weapon Slots
    formString += "<div class='item_box'>";
    formString += "武器<br>";
    formString += "<div id='item_wrapper'>";
    for(var i = 0; i < 48; i++){
      formString += generateSelectCh2(`_${(i*2)+356}`,`槽位 ${i+1}<br>`,data[`_${(i*2)+356}`],weapons,'item_slot grey_disable');
    }
    formString += "</div>";
    formString += "</div>";


    //Armor Slots
    formString += "<div class='item_box'>";
    formString += "防具<br>";
    formString += "<div id='item_wrapper'>";
    for(var i = 0; i < 48; i++){
      formString += generateSelectCh2(`_${(i*2)+357}`,`槽位 ${i+1}<br>`,data[`_${(i*2)+357}`],armor,'item_slot grey_disable');
    }
    formString += "</div>";
    formString += "</div>";




    //Item Storage
    formString += "<div class='item_box'>";
    formString += "储存的物品<br>";
    formString += "<div id='item_wrapper'>";
    for(var i = 0; i < 24; i++){
      formString += generateSelectCh2(`_${i+452}`,`槽位 ${i+1}<br>`,data[`_${i+452}`],items,'item_slot grey_disable');
    }
    formString += "</div>";
    formString += "</div>";


    //Lightworld Items
    formString += "<div class='item_box'>";
    formString += "光世界物品<br>";
    formString += "<div id='item_wrapper'>";
    for(var i = 0; i < 8; i++){
      formString += generateSelectCh2(`_${(i*2)+537}`,`槽位 ${i+1}<br>`,data[`_${(i*2)+537}`],lightworld_items,'item_slot grey_disable');
    }
    formString += "</div>";
    formString += "</div>";



    

    //Phone Numbers
    formString += "<div class='item_box'>";
    formString += "手机<br>";
    formString += "<div id='item_wrapper'>";
    for(var i = 0; i < 8; i++){
      formString += generateSelectCh2(`_${(i*2)+538}`,`槽位 ${i+1}<br>`,data[`_${(i*2)+538}`],phone_numbers,'item_slot grey_disable');
    }
    formString += "</div>";
    formString += "</div>";




    formString += "</div>";

    formString += `</div>`;
    formString += `<div id='tab_recruits' class='tab'>`;




    //Recruits
    formString += "<div id='recruit_box'>";
    formString += "Recruits<br>";
    formString += `<label class='lineItem'><input type="checkbox" name="show_all_recruits" noinput="true">显示所有可招募者</label><br>`
    formString += "<div id='recruit_wrapper'>";
    for(var i = 0; i < recruits.length; i++){

      var unused = false;
      for(var j = 0; j < unused_recruits.length; j++){
        if(i == unused_recruits[j]){
          unused = true;
        }
      }
      formString += generateTextboxInput(`_${i+1153}`,`${recruits[i].text}<br>`,data[`_${i+1153}`],{min:0,max:1},`recruit${(unused ? " unused_recruit" : "")}`);

    }
    formString += "</div>";
    formString += "</div>";

    //Recruits in the cafe
    formString += "<div id='recruit_cafe_box'>";
    formString += "咖啡馆中的招募";
    formString += `<label class='lineItem'><input type="checkbox" name="show_all_recruits_cafe" noinput="true">显示所有可招募者</label><br>`
    formString += "<div id='recruit_cafe_wrapper'>";
    for(var i = 0; i < 4; i++){
        formString += generateSelectCh2(`_${i+1353}`,`Recruit ${i+1}`,data[`_${i+1353}`],recruits,'recruit_cafe');
    }
    formString += "</div>";
    formString += "</div>";


    formString += `</div>`;
    
    
    
    
    
    
    
    
    formString += `<div id="tab_hometown" class='tab'>`;
    //chapter 1 hometown flags
    formString += "<div id='flags_box'>";
    formString += "与角色对话过<br>";
    formString += generateSelectCh2(`_890`,"与 Alvin 对话过",data[`_890`],[{value:0,text:`[0]No`},{value:1,text:`[1]About Gerson or Hammer`},{value:2,text:`[2]About Gerson and Hammer`},{value:3,text:`[3]Heard talking to himself`}],'');
    formString += generateSelectCh2(`_975`,"与 Mettaton 对话过",data[`_975`],[{value:0,text:`[0]No`},{value:1,text:`[1]About Entertainment`}],'');
    formString += generateSelectCh2(`_1014`,"Rudy's Hospital Sink（Rudy在医院的堕落）",data[`_1014`],[{value:0,text:`[0]Not interacted`},{value:1,text:`[1]Interacted`}],'');
    formString += "</div>";
    
    
    
    formString += "<div id='flags_box'>";
    formString += "过场动画<br>";
    formString += generateSelectCh2(`_861`,"Sans & Toriel 的过场动画",data[`_861`],[{value:0,text:`[0]Haven't seen`},{value:1,text:`[1]Watched Cutscene`}],'');
    formString += generateSelectCh2(`_868`,"Bunker 的过场动画",data[`_868`],[{value:0,text:`[0]Haven't seen`},{value:1,text:`[1]Watched Cutscene`}],'');
    formString += generateSelectCh2(`_869`,"Noelle 在医院的过场动画",data[`_869`],[{value:0,text:`[0]Haven't seen`},{value:1,text:`[1]Watched Cutscene`}],'');
    formString += generateSelectCh2(`_870`,"Dog Jail Break（狗越狱）",data[`_870`],[{value:0,text:`[0]Haven't seen`},{value:1,text:`[1]Watched Cutscene`},{value:2,text:`[2]Jailbreak Tunes`}],'');
    formString += generateSelectCh2(`_894`,"Susie Refuses to go into Diner (Susie 拒绝进入餐厅)",data[`_894`],[{value:0,text:`[0]Haven't seen`},{value:1,text:`[1]Watched Cutscene`}],'');
    formString += generateSelectCh2(`_933`,"打电话给家里",data[`_933`],[{value:0,text:`[0]Haven't seen`},{value:1,text:`[1]Watched Cutscene`}],'');
    formString += "</div>";
    
    
    
    formString += "<div id='flags_box'>";
    formString += "Onion<br>";
    formString += generateSelectCh2(`_978`,"Did you miss Onion (你是否还记得 Onion)",data[`_978`],[{value:0,text:`[0]No Answer`},{value:1,text:`[1]Yes`},{value:2,text:`[2]No`}],'');
    formString += generateSelectCh2(`_977`,"与 Onion 说过话",data[`_977`],[{value:0,text:`[0]No`},{value:1,text:`[1]Yes`}],'');
    formString += "</div>";
    
    
    
    formString += "<div id='flags_box'>";
    formString += "Other<br>";
    formString += generateSelectCh2(`_855`,"Ball of Junk（垃圾球）",data[`_855`],[{value:0,text:`[0]Not Gathered`},{value:1,text:`[1]On Head`},{value:2,text:`[2]In Dark World`}],'');
    formString += generateSelectCh2(`_895`,"Box of Chocolate Quest",data[`_895`],[{value:0,text:`[0]Not Recieved`},{value:1,text:`[1]Destroyed`},{value:2,text:`[2]Ate with Susie`},{value:3,text:`[3]Gave to Alphys`}],'');
    formString += generateSelectCh2(`_983`,"Stole Asriel's money",data[`_983`],[{value:0,text:`[0]No`},{value:1,text:`[1]Yes`}],'');
    formString += generateSelectCh2(`_992`,"Reverse Steal Egg",data[`_992`],[{value:0,text:`[0]No`},{value:1,text:`[1]Yes`}],'');

    formString += "</div>";
    
    
    
    formString += `</div>`;
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    formString += `<div id='tab_chapter1' class='tab'>`




    //Thrash your own ass




    formString += `<div id='thrash_box'>`;

    formString += `<center>修改撞你屁股的机器</center><br><br>`;
    formString += `<div id='thrash_flex'>`;
    formString += `<div id='thrash_left'>`;


    formString += `<div id='thrash_wrapper'>`;
    formString += `<div id='thrash_head_c' style="width:50px;height:50px;background-color:rgb(${_col1[0]},${_col1[1]},${_col1[2]});"></div>`;
    formString += `<div id='thrash_body_c' style="width:50px;height:50px;background-color:rgb(${_col2[0]},${_col2[1]},${_col2[2]});"></div>`;
    formString += `<div id='thrash_feet_c' style="width:50px;height:50px;background-color:rgb(${_col3[0]},${_col3[1]},${_col3[2]});"></div>`;
    formString += `<div id='thrash_head'></div>`;
    formString += `<div id='thrash_body'></div>`;
    formString += `<div id='thrash_feet'></div>`;
    formString += `<div id='thrash_feet2'></div>`;
    formString += `</div>`;
    formString += `</div>`;

    formString += `<div id='thrash_right'>`;


    formString += generateSelectCh2(`_773`,"",data[`_773`],thrasher_head_parts,'thrasher_select');
    formString += generateSelectCh2(`_774`,"",data[`_774`],thrasher_body_parts,'thrasher_select');
    formString += generateSelectCh2(`_775`,"",data[`_775`],thrasher_feet_parts,'thrasher_select');


    formString += generateRangeInput(`_776`,"H C",data[`_776`],{min:0,max:31},'hidden');
    formString += generateRangeInput(`_777`,"B C",data[`_777`],{min:0,max:31},'hidden');
    formString += generateRangeInput(`_778`,"F C",data[`_778`],{min:0,max:31},'hidden');

    formString += `</div>`;

    formString += `</div>`;

    formString += `<div id='thrash_head_c_slider'></div>`;
    formString += `<div id='thrash_body_c_slider'></div>`;
    formString += `<div id='thrash_feet_c_slider'></div>`;

    formString += `</div>`;




      //Goner
      formString += `<div id='goner_box'>`;

      formString += `<div id='goner_flex'>`;
      formString += `<div id='goner_left'>`;

      formString += `<center>容器的名字<center>`;
      formString += generateTextInput(`_2`,"",data[`_2`],[{length:10}],'filename');
      formString += `<div id='goner_wrapper'>`;
      formString += `<div id='goner_head'></div>`;
      formString += `<div id='goner_body'></div>`;
      formString += `<div id='goner_legs'></div>`;

      formString += `</div>`;

      formString += `<div id='goner_vessel_input'>`;
      formString += generateNumberInput(`_1453`,"HEAD ",data[`_1453`],{min:0,max:7},'flag');
      formString += generateNumberInput(`_1454`,"BODY ",data[`_1454`],{min:0,max:5},'flag');
      formString += generateNumberInput(`_1455`,"LEGS ",data[`_1455`],{min:0,max:4},'flag');
      formString += `</div>`;
      formString += `</div>`;

      formString += `<div id='goner_right'>`;


      formString += generateSelectCh2(`_1456`,"最喜欢的食物？<br>",data[`_1456`],goner_food);
      formString += generateSelectCh2(`_1457`,"最喜欢的血型？<br>",data[`_1457`],goner_blood);
      formString += generateSelectCh2(`_1458`,"最喜欢的颜色？<br>",data[`_1458`],goner_color);
      formString += generateSelectCh2(`_1462`,"请赐予它一项天赋(gift)。<br>",data[`_1462`],goner_gift);
      formString += generateSelectCh2(`_1459`,"你感觉你的造物怎么样？(它听不见。)<br>",data[`_1459`],goner_feel);


      formString += generateSelectCh2(`_1460`,"你回答诚实吗？<br>",data[`_1460`],[{value:0,text:`[0]YES`},{value:1,text:`[1]NO`}]);
      formString += generateSelectCh2(`_1461`,"您知道会有疼痛和癫痫发作的可能性。<br>",data[`_1461`],[{value:0,text:`[0]YES`},{value:1,text:`[1]NO`}]);

      formString += `</div>`;
      formString += `</div>`;
      formString += `</div>`;




      //chapter 1 hometown flags
      formString += "<div id='flags_box'>";
      formString += "Hometown<br>";
      formString += generateSelectCh2(`_808`,"Noelle 在医院的过场动画",data[`_808`],[{value:0,text:`[0]Haven't seen`},{value:1,text:`[1]Watched Cutscene`},{value:2,text:`[2]Talked to Rudy`}],'');
      formString += generateSelectCh2(`_809`,"Talked to Berdly",data[`_809`],[{value:0,text:`[0]No`},{value:1,text:`[1]Yes`}],'');
      formString += generateSelectCh2(`_810`,"Stuck fingers in Picnic Table",data[`_810`],[{value:0,text:`[0]No`},{value:1,text:`[1]Yes`}],'');
      formString += generateSelectCh2(`_811`,"与 Onion 说过话",data[`_811`],[{value:0,text:`[0]No`},{value:1,text:`[1]Yes`},{value:2,text:`[2]Became Friend`},{value:3,text:`[3]Refused Friendship`}],'');
      formString += generateSelectCh2(`_812`,"Your Name (Onion)",data[`_812`],[{value:0,text:`[0]None`},{value:1,text:`[1]Kris`},{value:2,text:`[2]Hippopotamus`}],'grey_disable');
      formString += generateSelectCh2(`_813`,"Onion's Name",data[`_813`],[{value:0,text:`[0]None`},{value:1,text:`[1]Onion`},{value:2,text:`[2]Beauty`},{value:3,text:`[3]Asriel II`},{value:4,text:`[4]Disgusting`}],'grey_disable');
      formString += generateSelectCh2(`_814`,"Free Hot Chocolate",data[`_814`],[{value:0,text:`[0]Unclaimed`},{value:1,text:`[1]Claimed`}],'');
      formString += generateSelectCh2(`_815`,"Asgore flower cutscene",data[`_815`],[{value:0,text:`[0]Haven't seen`},{value:1,text:`[1]Entered Flower Shop`},{value:2,text:`[2]Recieved Bouquet`},{value:3,text:`[3]Given Bouquet to Toriel`},{value:4,text:`[4]Toriel threw Bouquet away`}],'');
      formString += generateSelectCh2(`_818`,"Talked to Catty",data[`_818`],[{value:0,text:`[0]No`},{value:1,text:`[1]Yes`}],'');
      formString += generateSelectCh2(`_822`,"Alphys Alleyway Cutscene",data[`_822`],[{value:0,text:`[0]Haven't seen`},{value:1,text:`[1]Watched Cutscene`}],'');
      formString += generateSelectCh2(`_823`,"Talked to Undyne",data[`_823`],[{value:0,text:`[0]No`},{value:1,text:`[1]Yes`}],'');
      formString += generateSelectCh2(`_824`,"Talked to Burgerpants",data[`_824`],[{value:0,text:`[0]No`},{value:1,text:`[1]Yes`},{value:2,text:`[2]Seen dialogue`}],'');
      formString += generateSelectCh2(`_825`,"Phonecall with Toriel",data[`_825`],[{value:0,text:`[0]No`},{value:1,text:`[1]Yes`}],'');
      formString += generateSelectCh2(`_826`,"Talked to Sans",data[`_826`],[{value:0,text:`[0]No`},{value:1,text:`[1]Yes`},{value:2,text:`[2]Talked about his brother`}],'');
      formString += generateSelectCh2(`_827`,"Got Sans's Phone number",data[`_827`],[{value:0,text:`[0]No`},{value:1,text:`[1]Yes`},{value:1,text:`[1]Called it`}],'');
      formString += generateSelectCh2(`_828`,"Rudy's Hospital Sink（Rudy在医院的堕落）",data[`_828`],[{value:0,text:`[0]Not interacted`},{value:1,text:`[1]Interacted`}],'');
      formString += generateSelectCh2(`_829`,"Talked to Noelle",data[`_829`],[{value:0,text:`[0]No`},{value:1,text:`[1]Yes`},{value:2,text:`[2]Talked about Susie`}],'');
      formString += generateNumberInput(`_830`,"Times entered house",data[`_830`],{min:0,max:8},'flag');
      formString += "</div>";



      //Misc chapter 1 flags

      formString += "<div class='flags_box'>";
      formString += "Other Flags<br>";
      formString += generateSelectCh2(`_659`,"Eaten Prison Moss",data[`_659`],[{value:0,text:`[0]No`},{value:1,text:`[1]Yes`}],'');
      formString += generateNumberInput(`_794`,"Jevil Quest (?)",data[`_794`],{min:0,max:7},'flag');
      formString += generateSelectCh2(`_807`,"The Original Starwalker",data[`_807`],[{value:0,text:`[0]No`},{value:1,text:`[1]Yes`}],'');
      formString += generateNumberInput(`_1464`,"Chapter 1 Eggs",data[`_1464`],{min:-99999,max:99999},'flag');
      formString += generateSelectCh2(`_805`,"Kris Inspected the Beds",data[`_805`],[{value:0,text:`[0]No`},{value:1,text:`[1]Yes`}],'');
      formString += generateSelectCh2(`_806`,"Spin Cake Received",data[`_806`],[{value:0,text:`[0]No`},{value:1,text:`[1]Yes`}],'');
      formString += generateSelectCh2(`_760`,"Thrown Away Manual",data[`_760`],[{value:0,text:`[0]No`},{value:1,text:`[1]Dropped once`},{value:2,text:`[2]Thrown Away`}],'');
      formString += "</div>";




      formString += `</div>`;








formString += `<div id="tab_chapter2" class='tab'>`;


    //Other Flags
    formString += "<div id='flags_box'>";
    formString += "Other Flags<br>";
    formString += generateSelectCh2(`_587`,"Party Members can ACT",data[`_587`],[{value:1,text:`[1]No`},{value:0,text:`[0]Yes`}],'');
    formString += generateNumberInput(`_862`,"Spamton Progress",data[`_862`],{min:0,max:9},'flag');
    formString += generateNumberInput(`_1468`,"SnowGrave Progress",data[`_1468`],{min:0,max:9},'flag');
    formString += generateNumberInput(`_1478`,"Monsters Frozen",data[`_1478`],{min:0,max:45},'flag');
    formString += generateNumberInput(`_1015`,"Cars Killed",data[`_1015`],{min:0,max:99999},'flag');
    formString += generateNumberInput(`_1471`,"Chapter 2 Eggs",data[`_1471`],{min:-99999,max:99999},'flag');
    formString += generateSelectCh2(`_1010`,"Berdly's Arm",data[`_1010`],[{value:1,text:`[1]Healthy`},{value:0,text:`[0]Not doing too great`}],'flag');
    formString += generateSelectCh2(`_1473`,"Kris ate Moss",data[`_1473`],[{value:0,text:`[0]No`},{value:1,text:`[1]Yes`}],'');
    formString += generateSelectCh2(`_1475`,"Susie ate Moss",data[`_1475`],[{value:0,text:`[0]No`},{value:1,text:`[1]Yes`}],'');
    formString += generateSelectCh2(`_1474`,"Noelle saw Moss get eaten",data[`_1474`],[{value:0,text:`[0]No`},{value:1,text:`[1]Yes`}],'');
    formString += generateSelectCh2(`_878`,"Ralsei's Photo",data[`_878`],[{value:0,text:`[0]None`},{value:1,text:`[1]Hug Prince`},{value:2,text:`[2]Pose Prince`},{value:3,text:`[3]Rude Prince`},{value:4,text:`[4]Blank Prince`}],'');
    formString += generateSelectCh2(`_910`,"Recruited Hacker",data[`_910`],[{value:0,text:`[0]No`},{value:1,text:`[1]Yes`}],'');
    formString += "</div>";
    



    formString += `</div>`;





  return formString;
}
