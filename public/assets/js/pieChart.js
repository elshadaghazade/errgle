var siteID = $("#piechartdiv").data("siteid");

$.ajax({
  url: "/dashboard/chart/pie",
  method: "POST",
  data: { siteID },
}).then((response) => {
  am4core.ready(function () {
    // Themes begin
    try {
      am4core.useTheme(am4themes_animated);
    } catch (error) {}
    // Themes end

    // Create chart instance
    var chart = am4core.create("piechartdiv", am4charts.PieChart);

    // Set data
    var selected;

    var types = [
      {
        type: "Images",
        percent: response.imgTotal,
        color: chart.colors.getIndex(0),
        subs: response.imgArray,
      },
      {
        type: "CSS",
        percent: response.cssTotal,
        color: chart.colors.getIndex(1),
        subs: response.cssArray,
      },
      {
        type: "Scripts",
        percent: response.scriptTotal,
        color: chart.colors.getIndex(2),
        subs: response.scriptArray,
      },
      {
        type: "XML Requests",
        percent: response.xmlTotal,
        color: chart.colors.getIndex(3),
        subs: response.xmlArray,
      },
      {
        type: "Other",
        percent: response.otherTotal,
        color: chart.colors.getIndex(4),
        subs: response.otherArray,
      },
    ];

    // Add data
    chart.data = generateChartData();

    // Add and configure Series
    var pieSeries = chart.series.push(new am4charts.PieSeries());
    pieSeries.dataFields.value = "percent";
    pieSeries.dataFields.category = "type";
    pieSeries.slices.template.propertyFields.fill = "color";
    pieSeries.slices.template.propertyFields.isActive = "pulled";
    pieSeries.slices.template.strokeWidth = 0;

    function generateChartData() {
      var chartData = [];
      for (var i = 0; i < types.length; i++) {
        if (i == selected) {
          for (var x = 0; x < types[i].subs.length; x++) {
            chartData.push({
              type: types[i].subs[x].type,
              percent: types[i].subs[x].percent,
              color: types[i].color,
              pulled: true,
            });
          }
        } else {
          chartData.push({
            type: types[i].type,
            percent: types[i].percent,
            color: types[i].color,
            id: i,
          });
        }
      }
      return chartData;
    }

    pieSeries.slices.template.events.on("hit", function (event) {
      if (event.target.dataItem.dataContext.id != undefined) {
        selected = event.target.dataItem.dataContext.id;
      } else {
        selected = undefined;
      }
      chart.data = generateChartData();
    });
  }); // end am4core.ready()
});


//Chart Popup  
$('.fileSize-btnCon').on('click', function () {
  $('.chart-popup').show(300)
  $('.chart-popup').addClass('active')

})

$(document).mouseup(function (e) {
  if ($('.chart-popup').hasClass('active') && !$('.pie-chart').is(e.target) && $('.pie-chart')
      .has(e.target).length === 0) {
      $('.chart-popup').removeClass('active');
      $('.chart-popup').hide(300)

  }
});

$('.pie-close').on('click', () => {
  $('.chart-popup').hide(300)
});