//  Last Modify: 2015/02/15
/*	=================================================/
	Include Class:	Character, Skill
	==================================================*/
/*=====================
	Class :: Character
=====================*/
function Character(name, hp, dmg_base, enemy_para){
	if(typeof(name)==='undefined')		name="Char_0";
	if(typeof(hp)==='undefined')		hp  = 1000;
	if(typeof(dmg_base)==='undefined')	dmg_base  = 10;
	if(typeof(enemy_para)==='undefined')	enemy_para = [3,10];
	
	
	
	//CONSTANT CONFIG
	var POWER_MAX = enemy_para[1];
	var POWER_NUM_BONUS  = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11,12,13,14,15];
	var POWER_CATE_BONUS = [2.5, 1.6, 1.0, 0.85, 0.5];
	// Public Variables
	var cha = this;
	cha.name = name;
	cha.level  = 1;
	cha.max_hp = hp;
	cha.hp     = hp;
	cha.dmg_base = dmg_base;
	cha.cd_counter = enemy_para[0];
	cha.skills   = [];
	cha.power    = [];
	cha.MSG_Box  = null;
	cha.symbo_power = 7;
	cha.good_power = 7;
	cha.weak_power = 7;
	cha.pic_name = "";
	//Private Variables
	var cooldown = enemy_para[0];
	var atk_multi = [1,1,1,1,1];
	var def_multi = [1,1,1,1,1];
	
	
	//=================
	//  Public Function
	//=================
	// :: Attack
	cha.Attack = function(target){
		var skill_atk_multi = cha.doSkillsEffect(target);	//Skill Effect
		
		var power_arr = getPowerLen();
		for(var i=0;i<5;i++)	power_arr[i] *= power_arr[i];//POWER_NUM_BONUS[power_arr[i]];
		for(var i=0;i<5;i++)	power_arr[i] *= skill_atk_multi[i];
		for(var i=0;i<5;i++)	power_arr[i] *= atk_multi[i];
		for(var i=0;i<5;i++)	power_arr[i] *= target.getDefMulti()[i];
		
		var damage = 0;
		for(var i=0;i<5;i++)	damage += power_arr[i];
		damage *= cha.power.length;//POWER_NUM_BONUS[cha.power.length];
		damage *= cha.dmg_base;
		damage = Math.floor(damage+0.5);
		target.sufferDamage(damage);
		
		cha.MSG_Box.add(cha.name +" 造成"+damage+"傷害", cha.symbo_power);
		
		cha.power    = [];
	}
	cha.sufferDamage = function(damage){
		if(typeof(damage)==='undefined')	damage=0;
		cha.addHp(0-damage);
		return cha.hp;
	}
	
	//==========
	// :: Setting
	cha.isDead = function(){ return (cha.hp<=0);}
	cha.ready = function(){
		cha.hp = cha.max_hp;
		cha.power    = [];
		cha.cd_counter = cooldown;
	}
	cha.upgrade = function(){
		cha.dmg_base = cha.dmg_base*1.2;
		cha.setMaxHp(cha.max_hp + cha.level*250);
		cha.level += 1;
	}
	cha.setNewPlayer = function(name){
		if(typeof(name)==='undefined')		name="Player";
		POWER_MAX = 10;
		cha.level= 1;
		cha.name = name;
		cha.setMaxHp(1000);
		cha.dmg_base = 1.2;
		cha.setAtkMulti([1,1,1,1,1]);
		cha.setDefMulti([1,1,1,1,1]);
		cha.skills   = [];
		cha.ready();
	}
	cha.setPowerTendency = function(power_type, lv){
		var weak_power = getWeakPowerType(power_type);
		cha.setPowerAffinity(power_type, lv*( 1));
		cha.setPowerAffinity(weak_power, lv*(-1));
	}

	//==========
	// :: Access Status
	cha.getLevel = function(){ return cha.level};
	
	cha.setMaxHp = function(new_MaxHp){
		cha.max_hp = new_MaxHp;
		cha.hp = cha.max_hp;
	}
	cha.setHp = function(new_hp){
		new_hp = (new_hp<0)? 0: (new_hp>cha.max_hp)? cha.max_hp: new_hp;
		cha.hp = Math.floor(new_hp+0.5);
	}
	cha.addHp = function(delta_hp){
		cha.setHp(cha.hp+delta_hp);
	}
	cha.addPower = function(new_power){
		cha.power.push(new_power);
		if(cha.power.length > POWER_MAX) cha.power.shift();
	}
	cha.setAtkMulti = function(new_atk_multi){ for(var i=0;i<5;i++) atk_multi[i]=new_atk_multi[i]; }
	cha.setDefMulti = function(new_def_multi){ for(var i=0;i<5;i++) def_multi[i]=new_def_multi[i]; }
	cha.getAtkMulti = function(){return atk_multi;};
	cha.getDefMulti = function(){return def_multi;};
	cha.setPowerAffinity = function(power_num, aff_lv){
		atk_multi[power_num-1] += 0.1*aff_lv;
		def_multi[power_num-1] -= 0.1*aff_lv;
		
		if(aff_lv>0)	cha.good_power = power_num;
		else			cha.weak_power = power_num;
	}
	//==========
	// :: CD Handle
	cha.countdownCD = function(){
		cha.cd_counter -= 1;
		if(cha.cd_counter > 0) return false;
		cha.cd_counter = cooldown + randPick([2,2,1]);
		cha.dmg_base *= 1.03;
		return true;
	}
	
	
	
	//==========
	// :: Skill
	cha.learnSkill = function(skill){
		cha.skills.push(skill);
	}
	cha.doSkillsEffect = function(target){
		var temp_atk_mult = [1,1,1,1,1];	//temp_atk_mult
		var power_arr = getPowerLen();
		
		for(var i=0;cha.skills[i]!=null;i++){
			var skill = cha.skills[i];
			if(!skill.isCondition(power_arr)) continue;
			cha.MSG_Box.add(cha.name +" 使用《"+skill.name+"》", skill.power_type);
			switch(skill.type){
				case "BUFF":	doSkillEffect_Buff(  skill, temp_atk_mult); break;
				case "DAMAGE":	doSkillEffect_Damage(skill, target); 		break;
				case "CURE":	doSkillEffect_Cure(  skill); break;
				case "EXTRA":	doSkillEffect_Extra( skill); break;
			}
		}
		
		//alert(temp_atk_mult);alert(temp_atk_mult);
		return temp_atk_mult;
	}
	//==========
	// :: Message Link
	cha.setMsg = function(Message){
		cha.MSG_Box = Message;
	}
	//=================
	//  Private Function
	//=================
	function getWeakPowerType(power_type){
		switch(power_type){
			case 1:	return 2;
			case 2:	return 3;
			case 3:	return 1;
			case 4:	return 5;
			case 5:	return 4;
			default:return power_type;
		}
	}
	function getPowerLen(){
		var arr = [0,0,0,0,0];
		for(var i=0;cha.power[i]!=null;i++) arr[cha.power[i]-1]++;
		return arr;
	}
	function getPowerNum(){
		var arr = getPowerLen();
		var num = 0;
		for(var i=0;i<5;i++) num += (arr[i]!=0)? 1: 0;
		return num;
	}
	//==========
	// :: Skill Effect
	function doSkillEffect_Buff(   skill, arr){
		var power_type = skill.getPara()[0];
		var mult       = skill.getPara()[1];
		
		if(power_type!=7)	arr[power_type-1] *= mult;
		else{
			for(var i=0;i<5;i++)	arr[i] *= mult;
		}
		cha.MSG_Box.add("--"+cha.name +" 攻擊倍率提高！", skill.power_type);
	}
	function doSkillEffect_Damage( skill, target){
		var power_type =  skill.getPara()[0];
		var damage = skill.getPara()[1];
		
		if(power_type<=5 && power_type>=1){
			damage *= atk_multi[power_type-1];
			damage *= target.getDefMulti()[power_type-1];
		}
		damage = Math.floor(damage+0.5);
		target.sufferDamage(damage);
		cha.MSG_Box.add("--造成"+damage+"傷害", skill.power_type);
	}
	function doSkillEffect_Cure(   skill){
		cha.addHp( skill.getPara()[0] );
		cha.MSG_Box.add("--"+cha.name +" 回復"+skill.getPara()[0]+"生命值", skill.power_type);
	}
	function doSkillEffect_Extra(  skill){
		var power_type = skill.getPara()[0];
		var num  = skill.getPara()[1];
		for(var i=0;i<num;i++)	cha.power.push(power_type);
		cha.MSG_Box.add("--"+cha.name +" 獲得"+num+"能量增幅", skill.power_type);
	}
	
	
}

/*=====================
	Class :: Skill
=====================*/
function Skill(level, type, power_type, name, condition, parameter){
	if(typeof(level)==='undefined')		level  = 1;
	if(typeof(type)==='undefined')		type		= null;	//類型
	if(typeof(power_type)==='undefined')power_type	= null;	//屬性
	if(typeof(name)==='undefined')		name		= null;
	if(typeof(condition)==='undefined')	condition	= null
	if(typeof(parameter)==='undefined')	parameter	= null;
	
	//CONSTANT CONFIG
	var LEVEL_MAX = 4;
	var TYPES = ["BUFF","DAMAGE","CURE","EXTRA"]
	// Public Variables
	var ski = this;
	ski.name = name;
	ski.level = level;
	ski.type = type;
	ski.power_type = power_type;
	
	//Private Variables
	var condition = condition;
	var parameter = parameter;
	
	//=================
	//  Public Function
	//=================
	// :: IsCondition
	ski.isCondition = function(power_num_arr){
		for(var i=0;i<5;i++)
			if( condition[i] > power_num_arr[i]) return false;
		return true;
	}
	// :: Access
	ski.getPara = function(){	return parameter;}
	ski.getCondition = function(){	return condition;}
	
	// :: Setting
	ski.setLevel = function(level){
		if(typeof(level)==='undefined')	level=1;
		
		if(level>LEVEL_MAX) ski.level = LEVEL_MAX;
		else if(level>=1)	ski.level = level;
		else				ski.level = 1;
	}
	ski.setRandSkill = function(level, type, power_type, name){
		if(typeof(level)==='undefined')	level=1;
		
		ski.setLevel(level);
		ski.type = type;
		ski.power= power_type;
		ski.name = name;
		
		setRandSkill();
	}
	// :: Text
	ski.getTypeText = function(){
		switch(ski.type){
			case "BUFF": 	return "攻擊增幅";
			case "DAMAGE":	return "直接傷害";
			case "CURE":	return "回復生命";
			case "EXTRA":	return "能量增幅";
		}
	}
	ski.getDescription = function(){
		var para = parameter;
		var power_text = ["火","水","自然","光","闇","","無"];
		switch(ski.type){
			case "BUFF": 
				power_text[6] = "全";
				return "瞬間提高自己"+(para[1]*100-100).toFixed(0)+"%"+power_text[para[0]-1]+"屬性的傷害";
			case "DAMAGE":
				return "對敵人造成"+para[1]+"點基本"+power_text[para[0]-1]+"屬性傷害";
			case "CURE":
				return "回復自己"+para[0]+"點生命值";
			case "EXTRA":
				return "增加自己"+para[1]+"格"+power_text[para[0]-1]+"屬性能量";
		}
	}
	ski.toString = function(){
		return ski.name+",level="+ski.level+",type="+ski.type+",power_type="+ski.power_type+",["+condition+"],para=["+parameter+"]";
	}
	//=================
	//  Private Function
	//=================
	// :: Translate
		function getTypeNum(type){
			return TYPES.indexOf(type);
		}
	//:: Random Spawn
		function setRandSkill(){
			//ski.level -= ((ski.level>1)? randPick([4,1]): 0);
			var lv = ski.level;
				if(ski.type      ==null){ ski.type = getRandType(lv);}
			var type = ski.type;
				if(ski.power_type==null){ ski.power_type = getRandPowerType(type);}
			var power_type = ski.power_type;
				if(ski.name      ==null){ ski.name = getRandName(lv, type, power_type);}
				if(ski.condition ==null){ condition= getRandCond(lv, power_type);}
				if(ski.parameter ==null){ parameter= getRandPara(lv, type, power_type);}
		}
		function getRandType(level){
			var type_num = (level<2)? randPick([2,2,1]): randPick([3 ,3,2,2]);
			return TYPES[type_num];
		}
		function getRandPowerType(type){
			var type_num = getTypeNum(type);
			var power_type = (type_num==2)? 7: (type_num==3)? randInt(5)+1: randPick([3,3,3,3,3,0,1])+1;
			return power_type;
		}
		
		function getRandCond(level, power_type){
			var arr=[0,0,0,0,0];
			var base_level = Math.floor((level)*(2/3)+0.5)+1;
			
			if(power_type!=7)	arr[power_type-1] += base_level;
			else{
				for(var i=0;i<base_level;i++) arr[randInt(5)]++;
			}
			if(level>1) arr[randInt(5)]++;
			return arr;
		}
		function getRandPara(level, type, power_type){
			var type_num = getTypeNum(type);
			switch(type_num){
				case 0:	return getRandPara_Buff(level, power_type);
				case 1:	return getRandPara_Damage(level, power_type);
				case 2:	return getRandPara_Cure(level);
				case 3:	return getRandPara_Extra(level, power_type);
			}
			return [];
		}
			function getRandPara_Buff(level, power_type){
				var MULT_BASE = [0.05,0.3,0.6,1.5,2.0];
				var mult = MULT_BASE[level];
				//if(power_type==7)	mult *= 0.2;
				return [7, 1 + mult];
			}
			function getRandPara_Damage(level, power_type){
				var DAMAGE_BASE = [50,200,600,1000,1500];
				return [power_type, DAMAGE_BASE[level]];
			}
			function getRandPara_Cure(level){
				var CURE_BASE = [50,100,250,600,900];
				return [CURE_BASE[level]];
			}
			function getRandPara_Extra(level, power_type){
				var EXTRA_BASE = [1,1,2,3,4];
				return [power_type, EXTRA_BASE[level]];
			}
		function getRandName(level, type, power_type){
			var type_num = getTypeNum(type);
			var str = "";
			str += getRandNamePrefix(power_type);
			str += getRandNameType(type_num);
			return str;
		}
		function getRandNamePrefix(type){
			var TEXT_BY_TYPE = [];
			TEXT_BY_TYPE[1] = ["火焰","烈焰","燃炎","地獄","熾光","炎神","赤魔"];
			TEXT_BY_TYPE[2] = ["大海","深淵","水神","浪濤","狂渦","海龍","水獸"];
			TEXT_BY_TYPE[3] = ["自然","森林","蓋亞","飛葉","魔藤","野獸","大地"]
			TEXT_BY_TYPE[4] = ["聖光","光輝","雷霆","天使","信仰","飛仙","神聖"]
			TEXT_BY_TYPE[5] = ["暗夜","漆黑","死靈","黯色","混沌","毒"];
			TEXT_BY_TYPE[7] = ["虛無","虛空","真實"];
			return TEXT_BY_TYPE[type][randInt(TEXT_BY_TYPE[type].length)];
		}
		function getRandNameType(type){
			var TEXT_BY_TYPE = [];
			TEXT_BY_TYPE[0] = ["怒火","強化","威光","靈光"];
			TEXT_BY_TYPE[1] = ["魔炮","重擊","射線","加農","噴射"];
			TEXT_BY_TYPE[2] = ["賜福","回復","療癒"];
			TEXT_BY_TYPE[3] = ["增幅","魔劍","千擊","怪力"]
			return TEXT_BY_TYPE[type][randInt(TEXT_BY_TYPE[type].length)];
		}
	
	//Initialize
	{
		ski.setLevel(ski.level);
		setRandSkill();
		
	}
	
}
//==========================
function randInt(num){
	return Math.floor(Math.random()*(num));
}
function randPick(weight_arr){
	var accum_weight_arr = [];
	accum_weight_arr[0] = weight_arr[0];
	for(var i=1;weight_arr[i]!=null;i++)
		accum_weight_arr[i] = accum_weight_arr[i-1] + weight_arr[i];
	for(var i=0;accum_weight_arr[i]!=null;i++)
		accum_weight_arr[i] /= accum_weight_arr[accum_weight_arr.length-1];
	
	var rand = Math.random();
	for(var i=0;;i++)
		if(rand<accum_weight_arr[i]) return i;
}