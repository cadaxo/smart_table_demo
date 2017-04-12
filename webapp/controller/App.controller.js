sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast",
	"sap/m/MessageBox"
], function(Controller, JSONModel, MessageToast, MessageBox) {
	"use strict";

	return Controller.extend("zbp_smarttable.controller.App", {
		onInit: function(){
			this.getView().byId("smartTable_ResponsiveTable").attachEditToggled(this._editToggled.bind(this));
		},
		onBeforeRendering: function(){
			this.getView().getModel().metadataLoaded().then(this._onCreateModeMetadataLoaded.bind(this));
		},
		_editToggled: function() {
			var oSmartTable = this.getView().byId("smartTable_ResponsiveTable");
			var sMode = oSmartTable.getEditable() ? "MultiSelect" : "None";
			oSmartTable.getTable().setMode(sMode);
		},
		_onCreateModeMetadataLoaded: function() {
			this.getView().getModel().setUseBatch(true);
			this.getView().getModel().setDeferredGroups(["updateGroup"]);
			this.getView().getModel().setChangeGroups({
			  "BusinessPartner": {
			    groupId: "updateGroup",
			    changeSetId: "updateGroup"
			  }
			});
			this.getView().getModel().attachPropertyChange(this._propertyChanged.bind(this));
		},
		_propertyChanged: function(oEvent) {
			var oParameters = oEvent.getParameters();
    		var sPath = oParameters.context.getPath();
    		var oData = {};
    		oData[oParameters.path] = oParameters.value;
    		var mParameters = {"groupId":"updateGroup"};
     		this.getView().getModel().update(sPath, oData, mParameters);
     		//this.getView().byId("saveButton").setEnabled(true);
		},
		onSave: function(oEvent) {
			var oModel = this.getView().getModel();
	    	oModel.submitChanges({
	      		groupId: "updateGroup", 
	        	success: this._handleSuccess.bind(this),
	        	error: this._handleError.bind(this)
	     	});
		},
		_handleSuccess: function(oData) {
			//this.getView().byId("saveButton").setEnabled(false);
			MessageToast.show("Update successfull!");
			console.log(oData);
		},
		_handleError: function(oError) {
			MessageBox.error("Update error. Check console log for more information.");
			console.log(oError);
		}
	});
});