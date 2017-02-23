var $search = $("#search");
var $src = $("#src");
var $des = $("#des");
var $srcCity = $("#srcCity");
var $desCity = $("#desCity");
var $result = $("#result")
var $container = $("#container");
var $back = $("#back");
var $srcTip = $('#srcTip');
var $desTip = $('#desTip');
var ak = 'hNwsSIXFOPTIQQuze00VDuYydoIXgAFF';
var city;
// var city = remote_ip_info['city'];
// $('#city').html(city);

$back.click(function () {
	$container.removeClass("active")
})
$search.on('click',function(){
	var srcVal = $src.val();
	var desVal = $des.val();
	var srcCityVal = $srcCity.val();
	var desCityVal = $desCity.val();
	if (!srcVal || !desVal || !srcCityVal || !desCityVal) {
		return false
	}
	getRoute(srcVal,desVal,srcCityVal,desCityVal,function () {
		$container.addClass("active")
		console.log(1)
		$result.empty()
	})
})
$src.on('blur',function () {
	setTimeout(function () {
		$srcTip.empty()
	},300)
	
}).on('input propertychange',function () {
	var place = $(this).val()
	var srcCityVal = $srcCity.val();
	getTotalPlace(place,srcCityVal,$srcTip,appendList)
})
$des.on('blur',function () {
	setTimeout(function () {
		$desTip.empty()
	},300)
}).on('input propertychange',function () {
	var place = $(this).val()
	var desCityVal = $desCity.val();
	getTotalPlace(place,desCityVal,$desTip,appendList)
})

function getTotalPlace(place,placeCity,$wrap,cb) {
	var url = 'https://api.map.baidu.com/place/v2/suggestion?query='+place+'&region='+placeCity+'&city_limit=true&output=json&ak=' + ak;
	$.getJSON(url + '&callback=?')
	.done(function (res) {
		if (res.status === 0) {
			cb($wrap,res.result)
		}
		else{
			console.log('没有找到该地址信息')
		}
	})
}
function appendList($wrap,result) {
	if (result.length<=0) {return false}
	var html = '<ul class="tip-list">';
	$.each(result,function (index,value) {
		html += '<li>'+value.name+'</li>'
	})
	html+='</ul>'
	$wrap.empty()
	.append(html)

	$wrap.find('li')
	.on('click',function () {
		var place = $(this).text();
		console.log(place)
		$wrap.prev().val(place);
		$wrap.empty()
	})
}
// 获取路程信息
function getRoute(begin,end,beginCity,endCity,cb) {
	var url = 'https://api.map.baidu.com/direction/v1?mode=driving&origin='+begin+'&destination='+end+'&origin_region='+beginCity+'&destination_region='+endCity+'&output=json&ak='+ak;    
    $.getJSON(url + '&callback=?')
    .done(function (res) {
        if (res.status === 0) {
        	cb && cb()
            // console.log(res)
            var html = '<p id="searchText">从<b>'+res.result.origin.cname+' ' +res.result.origin.wd+'</b>';
            html += '到'+res.result.destination.cname+' ' +res.result.destination.wd+'</b></p>';

            html += '<p id="distance">距离：'+getKM(res.result.routes[0].distance)+'</p>'
            html += '<p id="duration">耗时：'+formatSeconds(res.result.routes[0].duration)+'</p>'
            html += '<ul id="steps">'
            $.each(res.result.routes[0].steps,function (index,value) {
            	html += '<li id="step'+index+'" class="'+(index===0?"active":"")+'"><p>'+(index+1)+':'+value.instructions+'。</p><p class="routes-info">路段长度：'+getKM(value.distance)+'。耗时:'+formatSeconds(value.duration)+'</p></li>'
            })
            html += '</ul>'
            $result.append(html)
            $result.find("li")
            .on("click",function () {
            	if ($(this).hasClass("active")) {
            		return false
            	}
            	$(this).addClass("active").siblings(".active")
            	.removeClass("active")
            })

        }else{
            console.log('没有找到该地址信息')
        }
    })
}
// 米转千米
function getKM(m) {
	return m/1000 + '千米'
}
// 秒转时分秒
function formatSeconds(value) { 
	var theTime = parseInt(value);// 秒 
	var theTime1 = 0;// 分 
	var theTime2 = 0;// 小时 
	// console.log(theTime); 
	if(theTime > 60) { 
		theTime1 = parseInt(theTime/60); 
		theTime = parseInt(theTime%60); 
		// console.log(theTime1+"-"+theTime); 
		if(theTime1 > 60) { 
			theTime2 = parseInt(theTime1/60); 
			theTime1 = parseInt(theTime1%60); 
		} 
	} 
	var result = ""+parseInt(theTime)+"秒"; 
	if(theTime1 > 0) { 
		result = ""+parseInt(theTime1)+"分"+result; 
	} 
	if(theTime2 > 0) { 
		result = ""+parseInt(theTime2)+"小时"+result; 
	} 
	return result; 
} 