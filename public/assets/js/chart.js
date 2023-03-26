var siteID = $("#chartdiv").data("siteid");

$.ajax({
  url: "/dashboard/chart",
  method: "POST",
  data: { siteID },
}).then((response) => {
  am4core.ready(function () {
    // Themes begin
    am4core.useTheme(am4themes_dark);
    try {
      am4core.useTheme(am4themes_animated);
    } catch (error) {}
    // Themes end

    var chart = am4core.create("chartdiv", am4charts.XYChart);

    var data = [];
    var value = 0;
    for (let i = 0; i < response.length; i++) {
      var date = new Date(response[i].date);
      date.setHours(0, 0, 0, 0);
      value = response[i].count
      data.push({ date: date, value: value });
    }

    chart.data = data;

    // Create axes
    var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.minGridDistance = 60;

    var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

    // Create series
    var series = chart.series.push(new am4charts.LineSeries());
    series.dataFields.valueY = "value";
    series.dataFields.dateX = "date";
    series.tooltipText = "{value}";

    series.tooltip.pointerOrientation = "vertical";

    chart.cursor = new am4charts.XYCursor();
    chart.cursor.snapToSeries = series;
    chart.cursor.xAxis = dateAxis;

    //chart.scrollbarY = new am4core.Scrollbar();
    chart.scrollbarX = new am4core.Scrollbar();
  }); // end am4core.ready()
});
