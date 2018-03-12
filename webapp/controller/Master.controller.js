sap.ui.define([
    "com/oprtnl/demos/gridTableScrollbar/exec/controller/BaseController",
    "com/oprtnl/demos/gridTableScrollbar/exec/model/formatter",
    "sap/m/MessagePopover",
    "sap/m/MessagePopoverItem"
], function(Controller, formatter, MessagePopover, MessagePopoverItem) {

    "use strict";

    return Controller.extend("com.oprtnl.demos.gridTableScrollbar.exec.controller.Master", {

        formatter: formatter,

        onInit: function() {

            this.globalBusyOn();
            this.getRouter(this).getRoute("master").attachPatternMatched(this.onObjectMatched, this);
            this.getRouter(this).attachBypassed(this.onBypassed, this);
            
        },

        onAfterRendering: function() {

        },

        onBypassed: function() {
            this.showMessagePopover([{ status: "Error", message: "Unknown navigation path." }], false, false);
        },

        onObjectMatched: function(oEvent) {
            this.getView().getModel("mockData").attachEventOnce("requestCompleted", this.dataLoaded, this);
            this.getView().getModel("mockData").loadData(this.getGlobalProperty("/mock-data"));            
        },

        dataLoaded: function(oEvent) {
            var that = this;
            setTimeout(function() {    
                that.getView().getModel("mockData").refresh(true);
                that.getView().byId("table").rerender();
                that.globalBusyOff();
            }, 100);
            
        },

        onPanelExpand: function(oEvent) {
            var that = this;
            setTimeout(function() {   
                that.getView().byId("table").rerender();
                that.getView().byId("master").rerender();                
            }, 100);
        }

    });
});