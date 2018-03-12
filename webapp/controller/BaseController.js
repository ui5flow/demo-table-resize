sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "sap/m/BusyDialog",
    "sap/m/MessagePopover",
    "sap/m/MessagePopoverItem",
    "sap/m/MessageToast"
], function(Controller, History, BusyDialog, MessagePopover, MessagePopoverItem, MessageToast) {
    "use strict";

    return Controller.extend("com.oprtnl.demos.gridTableScrollbar.exec.controller.BaseController", {

        globalBusyDialog: new BusyDialog({ text: "Loading ..." }),

        onInit: function() {
            var oRouter, oTarget;
            oRouter = this.getRouter();
        },

        getContentDensityClass: function() {
            if (!this.sContentDensityClass) {
                if (!sap.ui.Device.support.touch) {
                    this.sContentDensityClass = "sapUiSizeCompact";
                } else {
                    this.sContentDensityClass = "sapUiSizeCozy";
                }
            }
            return this.sContentDensityClass;
        },

        getRouter: function(oView) {
            return sap.ui.core.UIComponent.getRouterFor(oView);
        },

        getGlobalProperty: function(sPath) {
            return this.getOwnerComponent().getModel("globalProperties").getProperty(sPath);
        },

        setGlobalProperty: function(sPath, oValue) {
            this.getOwnerComponent().getModel("globalProperties").setProperty(sPath, oValue);
            return true;
        },

        getI18nText: function(text) {
            var resourceBundle = this.getView().getModel("i18n").getResourceBundle();
            return resourceBundle.getText(text);
        },

        globalBusyOn: function() {
            
            var that = this;
            setTimeout(function() {
                if (!that.globalBusyDialog) {
                    that.globalBusyDialog = new sap.m.BusyDialog({ text: that.getI18nText("Master.defaultBusyText") });
                }
                that.globalBusyDialog.setText(that.getI18nText("Master.defaultBusyText"));
                that.globalBusyDialog.open();
            }, 0);
        },

        globalBusyOff: function() {
            
            var that = this;
            setTimeout(function() {
                that.globalBusyDialog.close();
            }, 0);
        },

        responseParse: function(res) {

            try {
                var stdMessage = { status: "", message: "", messageId: "" };
                if (res.responseJSON) {
                    var response = res.responseJSON;
                    if (typeof response == 'object') {
                        if (response.status) {
                            if (typeof response.message == 'object' && response.message) {
                                stdMessage.status = response.status;

                                if (response.message.errors) {
                                    stdMessage.message = response.message.errors.name.message;
                                    return stdMessage;
                                }
                                if (response.message.errmsg) {
                                    stdMessage.message = response.message.errmsg;
                                    return stdMessage;
                                }
                                return stdMessage;
                            } else {
                                stdMessage.status = response.status;
                                stdMessage.message = response.message;
                                return stdMessage;
                            }
                        } else {
                            return response; // Wrong format
                        }
                    } else {
                        return response; // Wrong format
                    }
                } else if (res.getParameter) {
                    if (res.getParameter("errorobject")) {
                        if (res.getParameter("errorobject").statusCode === 500 && res.getParameter("errorobject").responseText) {
                            var jsonErrorMessage = JSON.parse(res.getParameter("errorobject").responseText);
                            stdMessage.status = jsonErrorMessage.status ? jsonErrorMessage.status : "Error";
                            stdMessage.message = jsonErrorMessage.message ? jsonErrorMessage.message : "";
                            return stdMessage;
                        }
                    }
                } else if (res.headers) {
                    if (res.headers['Content-Type'] == "text/html") {
                        stdMessage.status = "Error";
                        stdMessage.message = "Unknown error with HTTP Status:" + res.status;
                        return stdMessage;
                    } else {
                        stdMessage.status = "Error";
                        stdMessage.message = res.message ? res.message : "Processing error.";
                        return stdMessage;
                    }
                } else if (res.status && res.message) {
                    if (res.status == "Success" || res.status == "Error" || res.status == "Warning") {
                        stdMessage.status = res.status;
                        stdMessage.message = res.message;
                    } else {
                        stdMessage.status = "Error";
                        stdMessage.message = res.message;
                    }
                    return stdMessage;
                } else {
                    stdMessage.status = "Error";
                    stdMessage.message = "Unknown error with HTTP Status:" + res.status;
                    return stdMessage;
                }


            } catch (ex) {
                return res; // Wrong format
            }
        },

        showMessageToast: function(message) {
            if (message.message) {
                MessageToast.show(message.message, {
                    duration: 3000, // default
                    width: "15em"
                });
            }
        },

        showMessagePopover: function(messages, isInit, keepClosed, controlId) {

            var controlId = controlId ? controlId : "bShowMessages";
            var that = this;

            if (!this.messages) {
                this.messages = [];
            }

            if (isInit != undefined) {
                if (isInit) {
                    this.messages = messages;
                } else {
                    this.messages = this.messages.concat(messages);
                }
            }

            var oMessagePopoverItem = {};
            if (!this.oMessagePopover) {
                this.oMessagePopover = new MessagePopover({
                    initiallyExpanded: true
                });

            }
            this.oMessagePopover.removeAllItems();
            for (var i = 0, length = this.messages.length; i < length; i++) {
                if (this.messages[i].status !== "Error" && this.messages[i].status !== "Warning" && this.messages[i].status !== "Success") {
                    oMessagePopoverItem = new MessagePopoverItem({
                        type: "Error",
                        title: this.messages.toString()
                    });
                } else {
                    oMessagePopoverItem = new MessagePopoverItem({
                        type: this.messages[i].status,
                        title: this.messages[i].message
                    });
                }
                this.oMessagePopover.insertItem(oMessagePopoverItem);
            }
            if (this.messages.length > 0) {
                this.getView().byId(controlId).setText(this.messages.length);
                this.getView().byId(controlId).setVisible(true);
                if (!keepClosed) {
                    var that = this;
                    setTimeout(function() {
                        that.oMessagePopover.openBy(that.getView().byId(controlId));
                    }, 100);
                }

            }
        }

    });
});