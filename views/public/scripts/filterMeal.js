$(function() {
    $('input[type="checkbox"]').on('change', function () {
        var vals = []
        $('input[name="category"]').each(function() {
            if (this.checked) {
                vals.push(this.value);
            }
            $.ajax({
                type: "GET",
                url: "/filtermeal",
                data: vals,
                success: function (result) {
                    console.log(result);
                    var html = "";
                    for (var i = 0; i < result.length; i++) {
                        html += "<div class=\"meal\"><a href=\"/addMeal/" + result[i].id + "\">" +
                            "<p><img width='250' src='" + result[i].image + "'><br>" + result[i].name +
                            "</p></a></div>";
                    }
                    $('.meals').html(html);

                }
            });
        });
        });
    });

