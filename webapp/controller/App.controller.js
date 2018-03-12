sap.ui.define([
   "com/oprtnl/demos/gridTableScrollbar/exec/controller/BaseController"
], function (Controller) {
   "use strict";
   return Controller.extend("com.oprtnl.demos.gridTableScrollbar.exec.controller.App", {
      
      onInit : function () {
      	this.getView().addStyleClass(this.getContentDensityClass());
      },

   });
});