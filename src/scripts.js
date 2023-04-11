"use strict";

var rowCount = 0; // global counter for generating row IDs
var numUndeletedRows = 0; // global counter for tracking the number of undeleted rows
var std = {
    littleUnit: "oz",
    bigUnit: "lb",
    bigUnitOutputName: "lb"
};
var met = {
    littleUnit: "g",
    bigUnit: "g100",
    bigUnitOutputName: "100 g"
};
var eggWeight = { // standard egg weights and sizes
    properties: {
        1: { name: "small", oz: "1.5", lb: "0.09375", g: "42", g100: "0.425243" },
        2: { name: "med", oz: "1.75", lb: "0.109375", g: "49", g100: "0.4961167" },
        3: { name: "large", oz: "2", lb: "0.125", g: "56", g100: "0.56699" },
        4: { name: "xlarge", oz: "2.25", lb: "0.140625", g: "63", g100: "0.6378643" },
        5: { name: "jumbo", oz: "2.5", lb: "0.15625", g: "70", g100: "0.708738" }
    }
};

$(document).ready(function () {
    $('#unitsPopUp').hide();
    $('#aboutPopUp').hide();
    addFirstRow(); // adds default values to first row
    for (var i = 0; i < 4; i++) {
        addRow(); // 4 more rows!
    }

    /* Event Handlerers */

    window.onresize = updateTable; // the output is formatted as $2/lb or $2 per lb, depending on window width

    // the add button will adds a new row
    $('#addButton').on('click', function () {
        addRow();
    });

    // updates the unit of weight
    $('#weightUnitTable').on('change', function (e) {
        hideUnitsPopUp();
        updateAboutPopUp(); // update the reference table of weights in the about pop up
        updateTable();
    });

    $('#unitsButton').click(showUnitsPopUp); // show units popup
    $('#hideUnitsPopUp').click(hideUnitsPopUp); // hide units popup
    $('#aboutButton').click(showAboutPopUp); // show about popup
    $('#hideAboutPopUp').click(hideAboutPopUp); // hide about popup

    // hide popup when user clicks outside of the popup
    $('body').click(function (evt) {
        // don't hide if the click came from the popups or the buttons to open the popup
        if (evt.target.id == "unitsPopUp" || evt.target.id == "unitsButton" || evt.target.id == "aboutPopUp" || evt.target.id == "aboutButton") {
            return;
        }
        // and don't hide if it came from a descendant of the the popups
        else if ($(evt.target).closest('#unitsPopUp').length | $(evt.target).closest('#aboutPopUp').length) {
                return;
            }
        hideUnitsPopUp();
        hideAboutPopUp();
    });
});

function showUnitsPopUp() {
    if ($('#unitsPopUp').is(":hidden")) {
        hideAboutPopUp();
        $('#unitsPopUp').show(250);
        $('#unitsButton').css('color', '#444444');
    }
}

function hideUnitsPopUp() {
    if ($('#unitsPopUp').is(":visible")) {
        $('#unitsPopUp').hide(250);
        $('#unitsButton').css('color', '#878787');
    }
}

function showAboutPopUp() {
    if ($('#aboutPopUp').is(":hidden")) {
        hideUnitsPopUp();
        $('#aboutPopUp').show(250);
        $('#aboutButton').css('color', '#444444');
    }
}

function hideAboutPopUp() {
    if ($('#aboutPopUp').is(":visible")) {
        $('#aboutPopUp').hide(250);
        $('#aboutButton').css('color', '#878787');
    }
}

function updateTable() {
    // check all rows,
    for (var i = 0; i < rowCount; i++) {
        // and for every row that exists,
        if ($('#row' + i).length) {
            // capture values,
            var sze = $('#sze' + i).val();
            var num = $('#num' + i).val();
            var prc = $('#prc' + i).val();
            if (num !== "" && prc !== "") {
                // and recalculate if the row contains data
                var tmpRes = Math.round(100 * prc / (eggWeight.properties[sze][window[$('#weightUnitTable').val()].bigUnit] * num)) / 100;
                var extraZeros = ""; // JS truncates "2.50" to "2.5" and "2.00" to "2", so we need to add these 0's back in
                if (tmpRes * 100 % 100 == 0) {
                    extraZeros = ".00";
                } else if (tmpRes * 100 % 10 == 0) {
                    extraZeros = "0";
                }
                // make the output prettier when we have room for it
                var tmpDivider;
                if ($(window).width() < 380) {
                    if ($('#weightUnitTable').val() == "std") {
                        tmpDivider = "/";
                    } else {
                        tmpDivider = "/<br>";
                    }
                } else tmpDivider = " per ";
                $('#res' + i).html("$" + tmpRes + extraZeros + tmpDivider + window[$('#weightUnitTable').val()].bigUnitOutputName);
            } else {
                // else, clear the calculated value
                $('#res' + i).html("");
            }
        }
    }
}

function addRow() {
    // template for new row
    var newRow = "  <tr id=\"row" + rowCount + "\">\n                        <td>\n                            <i class=\"fas fa-dollar-sign dollarSign\"></i>&nbsp;<input type=\"number\" class=\"prc\" id=\"prc" + rowCount + "\" min=\"0.01\">\n                        </td>\n                        <td>\n                            <input type=\"number\" class=\"num\" id=\"num" + rowCount + "\" min=\"1\" pattern=\"[0-9]*\">\n                        </td>\n                        <td><select class=\"eggSize\" id=\"sze" + rowCount + "\">\n                                <option value=\"1\">small</option>\n                                <option value=\"2\">med</option>\n                                <option value=\"3\" selected>large</option>\n                                <option value=\"4\">xlarge</option>\n                                <option value=\"5\">jumbo</option>\n                            </select>\n                        </td>\n                        <td>\n                            <i class=\"fas fa-long-arrow-alt-right\"></i>\n                        </td>\n                        <td id=\"res" + rowCount + "\"></td>\n                        <td>\n                            <i class=\"far fa-minus-square removeButton\" onclick=\"deleteRow('" + rowCount + "');\"></i>\n                        </td>\n                    </tr>";

    $('#eggTable').append(newRow);

    // add listeners for every new row
    document.getElementById('prc' + rowCount).addEventListener("input", updateTable);
    document.getElementById('num' + rowCount).addEventListener("input", updateTable);
    document.getElementById('sze' + rowCount).addEventListener("change", updateTable);

    // update our counters
    numUndeletedRows++;
    rowCount++;
}

function addFirstRow() {
    addRow();
    $('#prc0').val(2.75); // autofill first row values
    $('#prc0').addClass("defaultValue");
    $('#num0').val(12);
    $('#num0').addClass("defaultValue");
    document.getElementById('prc0').addEventListener("click", clearRow0DefaultPrice);
    document.getElementById('num0').addEventListener("click", clearRow0DefaultNumber);
    updateTable();
}

// clear row0 default price on first click
function clearRow0DefaultPrice() {
    if ($('#prc0').hasClass("defaultValue")) {
        $('#prc0').val("");
        $('#prc0').removeClass("defaultValue");
        updateTable(); // clear the default calculated value
    }
}

// clear row0 default number of eggs on first click
function clearRow0DefaultNumber() {
    if ($('#num0').hasClass("defaultValue")) {
        $('#num0').val("");
        $('#num0').removeClass("defaultValue");
        updateTable(); // clear the default calculated value
    }
}

function deleteRow(tmpRowCount) {
    // if there is only one row left, don't delete it
    if (numUndeletedRows > 1) {
        $('#row' + tmpRowCount).remove();
        numUndeletedRows--;
    }
}

function updateAboutPopUp() {
    var tmpUnit = window[$('#weightUnitTable').val()].littleUnit;
    $('#aboutSmall .aboutUnit').html(eggWeight.properties[1][tmpUnit] + " " + tmpUnit);
    $('#aboutMedium .aboutUnit').html(eggWeight.properties[2][tmpUnit] + " " + tmpUnit);
    $('#aboutLarge .aboutUnit').html(eggWeight.properties[3][tmpUnit] + " " + tmpUnit);
    $('#aboutXLarge .aboutUnit').html(eggWeight.properties[4][tmpUnit] + " " + tmpUnit);
    $('#aboutJumbo .aboutUnit').html(eggWeight.properties[5][tmpUnit] + " " + tmpUnit);
}