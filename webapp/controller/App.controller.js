sap.ui.define([
	"zbp_smarttable/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast",
	"sap/m/MessageBox"
], function(BaseController, JSONModel, MessageToast, MessageBox) {
	"use strict";

	return BaseController.extend("zbp_smarttable.controller.App", {
		onInit: function(){
			this._getSmartTableById().attachEditToggled(this._editToggled.bind(this));
			this._getSmartTableById().getTable().attachSelectionChange(this._selectionChanged.bind(this));
		},
		onBeforeRendering: function(){
			this.getView().getModel().metadataLoaded().then(this._onCreateModeMetadataLoaded.bind(this));
		},
		
		//GET Smart Table by Id, Don't use Smart Table ID in other places in code
		//use this function instead
		_getSmartTableById: function(){
			return this.getView().byId("smartTable_ResponsiveTable");
		},
		
		_selectionChanged: function(){
			var bDeleteEnabled = this._getSmartTableById().getTable().getSelectedItems().length > 0;
			this.getView().byId("deleteButton").setEnabled(bDeleteEnabled);
		},
		_editToggled: function() {
			var oSmartTable = this._getSmartTableById();
			var sMode = oSmartTable.getEditable() ? "MultiSelect" : "None";
			oSmartTable.getTable().setMode(sMode);
		},
		_onCreateModeMetadataLoaded: function() {
			this.getView().getModel().setUseBatch(true);
			this.getView().getModel().setDeferredGroups(["updateGroup","deleteGroup"]);
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
		},
		onSave: function(oEvent) {
			var oModel = this.getView().getModel();
	    	oModel.submitChanges({
	      		groupId: "updateGroup", 
	        	success: this._handleUpdateSuccess.bind(this),
	        	error: this._handleUpdateError.bind(this)
	     	});
		},
		onDelete: function(oEvent){
			this._getSmartTableById().getTable().getSelectedItems().forEach(function(oItem){
				var sPath = oItem.getBindingContextPath();	
				var mParameters = {"groupId":"deleteGroup"};
				oItem.getBindingContext().getModel().remove(sPath, mParameters);
			});
			
			var oModel = this.getView().getModel();
			oModel.submitChanges({
	      		groupId: "deleteGroup", 
	        	success: this._handleDeleteSuccess.bind(this),
	        	error: this._handleDeleteError.bind(this)
	     	});
		},
		_handleUpdateSuccess: function(oData) {
			MessageToast.show(this.getResourceBundle().getText("updateSuccess"));
		},
		_handleUpdateError: function(oError) {
			MessageBox.error(this.getResourceBundle().getText("updateError"));
		},
		_handleDeleteSuccess: function(oData) {
			MessageToast.show(this.getResourceBundle().getText("deleteSuccess"));
		},
		_handleDeleteError: function(oError) {
			MessageBox.error(this.getResourceBundle().getText("deleteError"));
		}
	});
});