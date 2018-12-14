var row_number;

function display_concerts(data) {
    for (var i = 0; i < data.length; i++) {
        var id_number = i + 1;
        var row = "<td class='book-tickets-row'>" + id_number + "</td>";
        for (var x in data[i]) {
            row += '<td id="' + x + "-" + i + '">' + data[i][x] + '</td>';
        }
        var tr_id = "ticket-table-row-" + i;
        row += "<td><button class='btn btn-success see-tickets-btn' type='submit' onclick=\"on(" + i + ")\">Buy a ticket</button></td>";
        $('#concerts-table tbody').append('<tr class="table-element" id=' + tr_id + '>' + row + '</tr>').css({
            "margin": "auto",
            "width": "70%", "color": "black"
        })
    }
}


function get_concerts(){
    $.ajax({
        type: "GET",
        url: "login/concerts",
        success: function (data) {
            display_concerts(data);
        },
        error: function (data) {
            console.log('error');
            console.log(data)
        }
    });
}

$(document).ready(function (e) {
    get_concerts()
});


function ticket_details() {
    $("#buy_ticket-container-data").html("<p1>" +
        "Date: " + $("#date-" + row_number).text() +
        "<br>Location: " + $("#location-" + row_number).text() +
        "<br>Band: " + $("#band-" + row_number).text() +
        "<br>Price: $" + $("#price-" + row_number).text() +
        "<br>Seats Left: " + $("#seats_left-" + row_number).text() + "</p1>");
}

function add_remove_tickets(operation_type) {
    var actual_number;
    var seats_left;
    var ticket_number = $("#ticket-number");
    var seats_id = $("#seats_left-" + row_number);
    actual_number = parseInt(ticket_number.text());
    seats_left = parseInt(seats_id.text());

    if (operation_type === "add") {
        if (actual_number < 6 && actual_number < seats_left) {
            actual_number += 1;
        }
    }
    else if (operation_type === "remove") {
        if (actual_number > 1) {
            actual_number -= 1;
        }
    }

    ticket_number.html(actual_number);
}

function seats_field() {
    var ticket_number = $("#ticket-number");
    return parseInt(ticket_number.text());
}

function price_total() {
    var price_field_html = $("#price-" + row_number).text();
    var price = parseInt(price_field_html);
    var seats = seats_field();
    return seats * price;
}

function authorize_order() {
    console.log("authorize");
    $.ajax({
        type: "GET",
        url: "tickets/buy/buy_tickets",
        success: function (data) {
            console.log(data);
        },
        error: function (data) {
            console.log('error');
            console.log(data)
        }
    });
}

function accept_tickets(){
    authorize_order();
    $("#seats_ordered").val(seats_field());
    $("#date_order").val($("#date-" + row_number).text());
    $("#band_order").val($("#band-" + row_number).text());
    $("#buy-ticket-form").hide();
    $("#seats-chosen").html("<p2> Number of seats: " + seats_field() + "" +
        "<br> Price Total: $" + price_total() + "</p2>").show();
    $("#enter-authorization-code").animate({opacity: "toggle"}, "slow").show();
}

function add_ticket() {
    add_remove_tickets("add")
}

function remove_ticket() {
    add_remove_tickets("remove")
}



$("#accept-code-button").click(function (e) {
    e.preventDefault();
    var form = $('#authorization-form');
    console.log(form.serialize());
    $.ajax({
        type: "POST",
        url: "tickets/buy/buy_tickets/authorize",
        dataType: 'json',
        data: form.serialize(),
        success: function (data) {
            if(data.status === 200){
                $("#enter-authorization-code").hide();
                $("#message").html(data.message).css({"color": "green"}).show();
                $("#authorization-message-end").animate({opacity: "toggle"}, "slow").show();

            }
            else {
                $("#message").html(data.message).css({"color": "red"}).show();
            }
        },
        error: function (data) {
            console.log('error');
            console.log(data)
        }
    });
});


$("#resend-code-button").click(function (e) {
    $.ajax({
        type: "GET",
        url: "tickets/buy/buy_tickets/refresh",
        success: function (data) {
            if(data.status === 200){
                $("#message").html(data.message).css({"color": "green"}).show();
            }
            else {
                $("#message").html(data.message).css({"color": "red"}).show();
            }

        },
        error: function (data) {
            console.log('error');
            console.log(data)
        }
    });

});


$("#cancel-code-button").click(function (e) {
    off();
});

$("#authorization-message-end-button").click(function (e) {
    off();
    $("#display-concerts-tbody").html("");
    get_concerts();
});

function on(i) {
    $("#message").html("");
    row_number = i;
    ticket_details();
    $("#authorization-message-end").hide();
    $("#enter-authorization-code").hide();
    $("#seats-chosen").hide();

    $("#input-authorization-code").val("");
    $("#ticket-number").html(1);
    $("#buy-ticket-form").css({"display": "block"});
    $("#overlay").animate({opacity: "toggle"}, "slow").show();
    $("#center-buy_ticket-container").animate({opacity: "toggle"}, "slow").show();
}

function off() {
    $("#message").hide();
    $("#overlay").hide();
    $("#center-buy_ticket-container").hide();
}