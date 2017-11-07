
var highcharts_in_w2ui_grid = highcharts_in_w2ui_grid || {};

highcharts_in_w2ui_grid.init = function(){
	// w2uiグリッドの生成
	$('#grid').w2grid({ 
        name: 'grid', 
        recordHeight : 150,
        columns: [                
            { field: 'a', caption: 'a', size: '50px' },
            { field: 'b', caption: 'b', size: '50px' },
            { field: 'c', caption: 'c', size: '50px' },
            { field: 'chart', caption: 'Highcharts', size: '100%' }
        ],
        onRefresh: function(event){
        	// event.onCompleteにセットした関数がrefresh後に呼び出される
        	event.onComplete = function(){
        		// Highcharts生成のターゲットとするdivを作成
        		highcharts_in_w2ui_grid.makeChartDiv();
				
				// Highchartsのチャート生成処理呼び出し
				highcharts_in_w2ui_grid.makeChart();
        	};
        }
    });

    // 適当に初期値をセット
    w2ui['grid'].records = [
		{a:11, b:22, c:15},
		{a:11, b:22, c:15},
		{a:11, b:22, c:15},
		{a:934, b:503, c:571},
		{a:934, b:503, c:571},
		{a:934, b:503, c:571},
	];
	w2ui['grid'].refresh();
	
	// 定周期でデータを更新
	setInterval(highcharts_in_w2ui_grid.updateRecords, 2000);
};

highcharts_in_w2ui_grid.updateRecords = function(){
	// 適当にデータを更新
	for(var i=0; i<w2ui['grid'].records.length; i++){
		w2ui['grid'].records[i].a += 10;
		w2ui['grid'].records[i].b -= 10;
	}
	
	// 更新をグリッドに反映
	w2ui['grid'].refresh();
};

highcharts_in_w2ui_grid.makeChartDiv = function(){
	// w2uiグリッド内のチャート生成先にしたいセルに、Highcharts生成のターゲットとするdivを作成
	var cells = $('tr[index] td.w2ui-grid-data[col=3]');
	cells.append('<div class="chart-cell"></div>');
	
	for(var i=0; i<cells.length; i++){
		var target = $(cells).get(i)
		var chart = $(target).children('.chart-cell');
		
		var optionClass = '';
		if(i%3===1){
			// [おまけ] 棒グラフのパターンへの対応
			optionClass += ' bar';
		}
		if(i%3===2){
			// [おまけ] アニメーションさせないパターンへの対応
			optionClass += ' no-animation';
		}
		$(chart).addClass(optionClass);
	}
};

highcharts_in_w2ui_grid.makeChart = function(){
	// 目印のクラスが付加されたdivを対象にチャートを生成
	var $targets = $('.chart-cell');
	for(var i=0; i<$targets.length; i++){
		var $target = $targets[i];
		
		// データはグリッドのレコードを使用
		// (データの成形タイミング自体は自由なので、divにカスタム属性として持たせておくとかでもOK)
		var record = w2ui['grid'].records[i];
		chartData = [record.a, record.b, record.c];
		
		var title = '';
		
		// [おまけ] 棒グラフのパターンへの対応
		var type = 'line';
		if($.inArray('bar', $target.classList) >= 0){
			type = 'bar';
			title += '+bar';
		}
		
		// [おまけ] アニメーションさせないパターンへの対応
		var animationFlg = true;
		if($.inArray('no-animation', $target.classList) >= 0){
			animationFlg = false;
			title += '+no-animation';
		}
		
		// チャート生成
		Highcharts.chart($target, {
			chart: {
				type: type,
				width: 200,
				height: 150,
			},
		    title: {
		        text: title
		    },
		    subtitle: {
		        text: null
		    },
		    yAxis: {
		        title: {
		            text: null
		        }
		    },
		    legend: {
		    	enabled: false
		    },
			series: [{
		        data: chartData
		    }],
		    plotOptions: {
			    line: {
			        animation: animationFlg
			    }
			}
		});
	}
};