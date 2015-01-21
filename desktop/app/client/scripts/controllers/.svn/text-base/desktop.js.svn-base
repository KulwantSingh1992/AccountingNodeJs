'use strict';

/**
 * @ngdoc function
 * @name paxcomTerminalApp.controller:DesktopCtrl
 * @description
 * # DesktopCtrl
 * Controller of the paxcomTerminalApp
 */
angular.module('paxcomTerminalApp').controller('DesktopCtrl', function ($scope, desktopService, orderService, notificationService, configService) {
    //var localStorage = chrome.storage.local;
    $scope.orderList = {};
    $scope.orderPanel = {};
	$scope.linechartValues = {};
	$scope.bar = {};
	$scope.bar.Option = '';
    $scope.showHeader = false;
    $scope.orderFilterForm = {};
	var tt = $('div.ex-tooltip');
	var leftOffset = -($('html').css('padding-left').replace('px', '') + $('body').css('margin-left').replace('px', ''));
	var topOffset = -32;
			
    init();
    function init(){
        //localStorage.get("widgetList", function(localWidgetList){
            //console.log($.isEmptyObject(localWidgetList));
            var widgetList;
            if(true/*$.isEmptyObject(localWidgetList)*/) {
                widgetList = [
                    { title: 'Order', drag: true,url:"order-widget.html" },
                    { title: 'Accounts', drag: true, url:"accounting-widget.html" },
                    /*{ title: 'Inventory', drag: true, url:"inventory-widget.html" },*/
                    /*{ title: 'Sale Coach', drag: true, url:"sale-coach-widget.html" },*/
                    { title: 'Sale Chart 1', drag: true, url:"sale-chart-widget.html" },
                    { title: 'Sale Chart 3', drag: true, url:"sale-chart3-widget.html" }
                    /*{ title: 'Top Order Charts', drag: false, width: 12, url:"top-orders-chart.html" }*/
                ];
                //localStorage.set({"widgetList": widgetList});
            } else {
                //widgetList = localWidgetList.widgetList;
            }
            $scope.widgetList = widgetList;
        //});
    };

    $scope.dropCallback = function (event, ui) {
        //localStorage.remove('widgetList');
        //localStorage.set({"widgetList": $scope.widgetList});
    };
    
    $scope.onUpdate = function (order){
        console.log('Notification');
    }
	
	$scope.linechart = function(){
		
		var margin = {top: 20, right: 55, bottom: 30, left: 40},
			width  = 600 - margin.left - margin.right,
			height = 160  - margin.top  - margin.bottom;

		var x = d3.scale.ordinal().rangeRoundBands([0, width], 0);

		var y = d3.scale.linear().rangeRound([height, 0]);

		var xAxis = d3.svg.axis().scale(x);
		  
		var yAxis = d3.svg.axis().scale(y).orient("left");

		var line = d3.svg.line()
					  .interpolate("linear")
					  .x(function (d) { return x(d.label) + x.rangeBand() / 2; })
					  .y(function (d) { return y(d.value); });

		var color = d3.scale.ordinal().range(["#FF8000", "#00CC00", "#DC143C" ,"#6495ED" , "#DAA520"]);

		var svg = d3.select("#sales").append("svg")
					  .attr("width",  width  + margin.left + margin.right)
					  .attr("height", height + margin.top  + margin.bottom)
					  .append("g")
					  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		d3.json("/getSalesData", function (error, result) {
			var data = [];
			var channels = [];
                result.map(function(item){
                if(channels.indexOf(item.orders_channel_id) == -1) {
                    channels.push(item.orders_channel_id)
                }
            });
			result.map(function(item){
				var mapData = {};
                channels.map(function (channel) {
                    mapData[channel] = 0;
                });
				var indexOfItem = arrayObjectIndexOf(data, item.orderdate, 'orderDate');
				if(indexOfItem == -1) {
					mapData.orderDate = item.orderdate;
					mapData[item.orders_channel_id] = item.total || 0;
					data.push(mapData);
				} else {
					data[indexOfItem][item.orders_channel_id] = item.total || 0;
				}
			});
		
			var labelVar = 'orderDate';
			var varNames = d3.keys(data[0]).filter(function (key) { return key !== labelVar;});
			color.domain(varNames);

			var seriesData = varNames.map(function (name) {
				return {
					name: name,
					values: data.map(function (d) {
					  return {name: name, label: d[labelVar], value: +d[name]};
					})
				};
			});

			x.domain(data.map(function (d) { return d.orderDate; }));
			y.domain([
			  d3.min(seriesData, function (c) { 
				return d3.min(c.values, function (d) { return d.value; });
			  }),
			  d3.max(seriesData, function (c) { 
				return d3.max(c.values, function (d) { return d.value; });
			  })
			]);

			svg.append("g")
				.attr("class", "x axis")
				.attr("transform", "translate(0," + height + ")")
				.style({'stroke':'black', 'fill':'none', 'stroke-width': '1px', 'shape-rendering': 'crispEdges'})
				.call(xAxis);

			svg.append("g")
				.attr("class", "y axis")
				.style({'stroke':'black', 'fill':'none', 'stroke-width': '1px', 'shape-rendering': 'crispEdges'})
				.call(yAxis)
				.append("text")
				.attr("transform", "rotate(-90)")
				.attr("y", 6)
				.attr("dy", ".71em")
				.style("text-anchor", "end")
				.text("Total Sales");
				
			var series = svg.selectAll(".series")
				.data(seriesData)
				.enter().append("g")
				.attr("class", "series");
		
			$('text').attr('font-size','8px').attr('stroke','#666');

			series.append("path")
			  .attr("class", "line")
			  .attr("d", function (d) { return line(d.values); })
			  .style("stroke", function (d) { return color(d.name); })
			  .style("stroke-width", "2px")
			  .style("fill", "none");

			series.selectAll(".point")
			   .data(function (d) { return d.values; })
			   .enter().append("circle")
			   .attr("class", "point")
			   .attr("cx", function (d) { return x(d.label) + x.rangeBand()/2; })
			   .attr("cy", function (d) { return y(d.value); })
			   .attr("r", "2px")
			   .style("fill", function (d) { return color(d.name); })
			   .style("stroke", "grey")
			   .style("stroke-width", "1.5px")
			   .on("mouseover", function (d) { showPopLine.call(this, d); })
			   .on("mouseout",  function (d) { removePopovers(); });

			var legend = svg.selectAll(".legend")
				.data(varNames.slice().reverse())
				.enter().append("g")
				.attr("class", "legend")
				.attr("transform", function (d, i) { return "translate(55," + i * 20 + ")"; });

			legend.append("rect")
				.attr("x", width - 10)
				.attr("width", 10)
				.attr("height", 10)
				.style("fill", color);

			legend.append("text")
				.attr("x", width - 12)
				.attr("y", 6)
				.attr("dy", ".35em")
				.style("text-anchor", "end")
				.text(function (d) { return d; });
		});
		
		function showPopLine (d) {
			$(this).popover({
				title: d.name,
				placement: 'auto top',
				container: 'body',
				trigger: 'manual',
				html : true,
				content: function() {
                    var total = d.value == 0 ? 0 : d3.format(",")(d.value ? d.value: d.y1 - d.y0);
					return "Date: " + d.label + "<br/>Total: " + total; 
                }
			});
			$(this).popover('show');
		}
	}
	
	$scope.barchart = function(){
		var margin = {top: 20, right: 20, bottom: 30, left: 40},
			width = 600 - margin.left - margin.right,
			height = 160 - margin.top - margin.bottom;

		//var x0 = d3.scale.ordinal().rangeRoundBands([0, width], .1);
		var x0 = d3.scale.ordinal().rangePoints([0, width], 0.5);

		var x1 = d3.scale.ordinal();

		var y = d3.scale.linear().range([height, 0]);

		var color = d3.scale.ordinal().range(["#DC143C" ,"#6495ED" ,"#FF8000", "#00CC00", "#DAA520"]);
		//["#FF7F0E", "#1F77B4", "#FFBB78" ,"#FF3366" , "#2CA02C"]);

		var xAxis = d3.svg.axis().scale(x0).orient("bottom");

		var yAxis = d3.svg.axis().scale(y).orient("left").tickFormat(d3.format(".2s"));

		var svg = d3.select("#purchase-revenue").append("svg")
					.attr("width", width + margin.left + margin.right)
					.attr("height", height + margin.top + margin.bottom)
					.append("g")
					.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
		
		d3.json("/getSalesAndRevenueData", function(error, data) {
			
			var ageNames = d3.keys(data[0]).filter(function(key) { return key !== "orderdate"; });
			
			data.forEach(function(d) {
				d.ages = ageNames.map(function(name) { return {name: name, value: +d[name]}; });
			});

		  x0.domain(data.map(function(d) { return d.orderdate; }));
		  //x1.domain(ageNames).rangeRoundBands([0, x0.rangeBand()]);
		  x1.domain(ageNames).rangeRoundBands([0, 60]);
		  y.domain([0, d3.max(data, function(d) { return d3.max(d.ages, function(d) { return d.value; }); })]);

		  svg.append("g")
			  .attr("class", "x axis")
			  .attr("transform", "translate(0," + height + ")")
			  .style({'stroke':'black', 'fill':'none', 'stroke-width': '1px'})
			  .call(xAxis);

		  svg.append("g")
			  .attr("class", "y axis")
			  .style({'stroke':'black', 'fill':'none', 'stroke-width': '1px'})
			  .call(yAxis)
			  .append("text")
			  .attr("transform", "rotate(-90)")
			  .attr("y", 6)
			  .attr("dy", ".71em")
			  .style("text-anchor", "end")
			  .text("Cost");
			  
		  $('text').attr('font-size','8px').attr('stroke','#666');
		  
		  var month = svg.selectAll(".month")
			  .data(data)
			  .enter().append("g")
			  .attr("class", "g")
			  .attr("transform", function(d) { return "translate(" + x0(d.orderdate) + ",0)"; });

		  month.selectAll("rect")
			  .data(function(d) { return d.ages; })
			  .enter().append("rect")
			  //.attr("width", x1.rangeBand())
			  .attr("width", "30px")
			  .attr("x", function(d) { return x1(d.name); })
			  .attr("y", function(d) { return y(d.value); })
			  .attr("height", function(d) { return height - y(d.value); })
			  .style("fill", function(d) { return color(d.name); })
			  .on("mouseover", function (d) { showPopBar.call(this, d); })
			  .on("mouseout",  function (d) { removePopovers(); });

		  var legend = svg.selectAll(".legend")
			  .data(ageNames.slice())
			  .enter().append("g")
			  .attr("class", "legend")
			  .attr("transform", function(d, i) { return "translate(30," + i * 20 + ")"; });

			legend.append("rect")
				.attr("x", width - 10)
				.attr("width", 10)
				.attr("height", 10)
				.style("fill", color);

			legend.append("text")
				.attr("x", width - 12)
				.attr("y", 6)
				.attr("dy", ".35em")
				.style("text-anchor", "end")
				.text(function (d) { return d; });
		});
		
		function showPopBar (d) {
			$(this).popover({
				title: d.name,
				placement: 'auto top',
				container: 'body',
				trigger: 'manual',
				html : true,
				content: function() { 
					return "Total: " + d3.format(",")(d.value ? d.value: d.y1 - d.y0); }
			});
			$(this).popover('show');
		}
	}
	
	$scope.donutChart = function(id){
		
		var pathMostProduct = '/topSellingProducts';
		var pathMostCancel = '/mostCancelledProducts';
		
		var width = 300,
			height = 145,
			radius = Math.min(width, height) / 2;

		var color;
		
		var arc = d3.svg.arc().outerRadius(radius).innerRadius(radius - 40);

		var pie = d3.layout.pie().sort(null).value(function(d) { return d.total_quantity; });
		
		var svg = d3.select("#"+id).append("svg")
					.attr("width", width)
					.attr("height", height)
				    .append("g")
					.attr("transform", "translate(80," + height / 2 + ")");
			if(id == 'top_order'){
				
				color = d3.scale.ordinal().range(["#FF8000", "#00CC00", "#DC143C" ,"#6495ED" , "#DAA520"]);
				
				svg.append("svg:text")
					.attr("class", "aster-score")
					.attr("dy", "-.80em")
					.attr("text-anchor", "middle") // text-align: right
					.text("Top 5");
			
				svg.append("svg:text")
					.attr("class", "aster-score")
					.attr("dy", ".75em")
					.attr("text-anchor", "middle") // text-align: right
					.text("Selling");
			
				svg.append("svg:text")
					.attr("class", "aster-score")
					.attr("dy", "2.0em")
					.attr("text-anchor", "middle") // text-align: right
					.text("Products");
			}else{
				
				color = d3.scale.ordinal().range(["#6495ED" ,"#DAA520", "#00CC00",  "#FF8000", "#DC143C"]);
				
				svg.append("svg:text")
					.attr("class", "aster-score")
					.attr("dy", "-.80em")
					.attr("text-anchor", "middle") // text-align: right
					.text("Most");
			
				svg.append("svg:text")
					.attr("class", "aster-score")
					.attr("dy", ".75em")
					.attr("text-anchor", "middle") // text-align: right
					.text("Cancelled");
			
				svg.append("svg:text")
					.attr("class", "aster-score")
					.attr("dy", "2.0em")
					.attr("text-anchor", "middle") // text-align: right
					.text("Products");

			}
			
		d3.json(id == 'top_order' ? pathMostProduct : pathMostCancel, function(error, data) {
			
			if(data.length >= 1){
				var ageNames = data.map(function(item){return item.order_item});

				var g = svg.selectAll(".arc")
							.data(pie(data))
							.enter().append("g")
							.attr("class", "arc")
							.on("mouseover", function (d) { showPopDonut.call(this, d); })
							.on("mouseout",  function (d) { removePopovers(); });;

					g.append("path")
					 .attr("d", arc)
					 .style("fill", function(d) { return color(d.data.order_item); });

					g.append("text")
					  .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
					  .attr("dy", ".35em")
					  .style("text-anchor", "middle")
					  .text(function(d) { return d.data.total_quantity; });
				  
				 var legend = svg.selectAll(".legend")
								  .data(ageNames.slice().reverse())
								  .enter().append("g")
								  .attr("class", "legend")
								  .attr("transform", function(d, i) { 
								  var y = i * 20 - 60;
								  return "translate(-200," + y + ")"; 
								  });

					legend.append("rect")
					  .attr("x", width - 10)
					  .attr("width", 10)
					  .attr("height", 10)
					  .style("fill", color);

					legend.append("text")
					  .attr("x", width - 12)
					  .attr("y", 6)
					  .attr("dx", "1.7em")
					  .attr("dy", ".32em")
					  .style("text-anchor", "start")
					  .text(function(d) { return d.length > 24 ? d.substring(0, 25)+'...' : d ;});
			
			} else {
				var data = [{order_item:"No Data",total_quantity:1}];
				var ageNames = data.map(function(item){return item.order_item});
				var g = svg.selectAll(".arc")
						.data(pie(data))
						.enter().append("g")
						.attr("class", "arc")
						.style('stroke', 'black')
						.style('stroke-width', .5);
		   
					g.append("path")
					 .attr("d", arc)
					 .style("fill", function(d) { return "#ffffff"; });
			}
			
			function showPopDonut (d) {
				$(this).popover({
					title: '',
					placement: 'auto top',
					container: 'body',
					trigger: 'manual',
					html : true,
					content: function() { 
						return "Product: " + d.data.order_item + "<br/>Quantity: " + d3.format(",")(d.value ? d.value: d.y1 - d.y0); 
					}
				});
				$(this).popover('show')
			}
		});
	}
	
	$scope.notSoldProducts = function() {
        var salesData = [];
		desktopService.notSoldProducts().$promise.then(function (products) {
			console.log(products);
			for(var i=0;i<products.length;i++){
                salesData.push({product:products[i].order_item_name, date:new Date(products[i].order_item_created_timestamp)});
            }
            $scope.salesData = salesData;
		});
    }
	
	function removePopovers () {
		$('.popover').each(function() {
			$(this).remove();
		}); 
	}
			
    $scope.getOrders = function () {
        //notificationService.subscribe('order', $scope.onUpdate);
        $scope.main.dashboard='order';
        $scope.orderFilterForm.endDate = new Date().toLocaleDateString();
        $scope.orderFilterForm.arrangement = 'product';
        
        setOrderDeatilPanel();
        getOrders();
        //notificationService.update('order', 'dasds');
    };
    $scope.submitOrderFilterForm = function() {
        setOrderDeatilPanel();
        getOrders();
    };
    
    //set tag and heading
    function setOrderDeatilPanel() {
        if($scope.orderFilterForm.status==='SLA') {
            $scope.orderFilterForm.tag = 'sla';
            $scope.orderPanel.heading = 'SLA Breached';
        }else if($scope.orderFilterForm.status==='PENDING') {
            $scope.orderFilterForm.tag = 'pending';
            $scope.orderPanel.heading = 'Total Pending';
        }else if($scope.orderFilterForm.status==='DUE-TODAY') {
            $scope.orderFilterForm.tag = 'dueToday';
            $scope.orderPanel.heading = 'Due Today';
        }else {
            $scope.orderFilterForm.tag = 'all';
            if($scope.orderFilterForm.status !== '0') {
                $scope.orderPanel.heading = camelCase($scope.orderFilterForm.status) + ' Order';
            }else {
                $scope.orderPanel.heading = 'Order';
            }
        }
    }
    function getOrders() {
        var params = $scope.orderFilterForm;
        console.log(params);
        $scope.orderList = [];
        orderService.getOrders(params).$promise.then(function (orders) {
            console.log(orders.length);
            var orderList;
            if($scope.orderFilterForm.arrangement === 'product') {
                orderList = orderService.groupOrdersByProduct(orders);
            }else if($scope.orderFilterForm.arrangement === 'order') {
                orderList = orders;
            }
            console.log(orderList);
            $scope.orderList = orderList;
        });
    }
	
	$scope.getInventory = function(){
		$scope.main.dashboard='inv';
	}
	
	$(document).on('focus', "#range", function(e){
			
		// Set the default dates
		var startDate	= Date.create().addDays(-6);	// 7 days ago
		var	endDate		= Date.create(); 				// today

		var range = $('#range');
		
		// Show the dates in the range input
		range.val(startDate.format('{MM}/{dd}/{yyyy}') + ' - ' + endDate.format('{MM}/{dd}/{yyyy}'));
		
		range.daterangepicker({
			
			startDate: startDate,
			endDate: endDate,
			
			ranges: {
				'Today': ['today', 'today'],
				'Yesterday': ['yesterday', 'yesterday'],
				'Last 7 Days': [Date.create().addDays(-6), 'today'],
				'Last 30 Days': [Date.create().addDays(-29), 'today']
			}
		},function(start, end){
			
			ajaxLoadChart(start, end);
			
		});
		
		function ajaxLoadChart(startDate,endDate) {
			start = startDate.format('{yyyy}-{MM}-{dd}');
			end = endDate.format('{yyyy}-{MM}-{dd}');
		}
		
	});
	
});
