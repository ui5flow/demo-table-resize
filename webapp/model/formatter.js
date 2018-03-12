sap.ui.define([], function() {
    "use strict";
    return {

        getI18nText: function(text) {
            var resourceBundle = this.getView().getModel("i18n").getResourceBundle();
            return resourceBundle.getText(text);
        },

        getFormattedDateTime: function(isoTimestamp) {
            if (isoTimestamp) {
                var date = new Date(isoTimestamp);
                var padNumber = function(number) {
                    number = number.toString();
                    if (number.length === 1) {
                        return "0" + number;
                    }
                    return number;
                };
                return padNumber(date.getDate()) + "/" + padNumber(date.getMonth() + 1) + "/" + date.getFullYear() + " " + padNumber(date.getHours()) + ":" + padNumber(date.getMinutes()) + ":" + padNumber(date.getSeconds());
            } else {
                return "";
            }

        },

        getFormattedDate: function(isoTimestamp) {
            if (isoTimestamp) {
                var date = new Date(isoTimestamp);
                var padNumber = function(number) {
                    number = number.toString();
                    if (number.length === 1) {
                        return "0" + number;
                    }
                    return number;
                };
                return padNumber(date.getDate()) + "." + padNumber(date.getMonth() + 1) + "." + date.getFullYear();
            } else {
                return "";
            }

        },

        getPeriod: function(periodFrom, periodTo) {
            var txtPeriod = periodFrom.substring(0, 4) + "." + periodFrom.substring(4, 6) + " - " + periodTo.substring(0, 4) + "." + periodTo.substring(4, 6);
            return txtPeriod;
        },

        formatOrderCycle: function(value) {
            if (value) {
                return value.substring(4, 6) + '/' + value.substring(0, 4);
            }
            return "";
        }


    };
});