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
		onOpenFormDialog: function() {
			
			var oView = this.getView();
	        var oDialog = oView.byId("addBusinessPartnerDialog");
	         // create dialog lazily
	        if (!oDialog) {
	           // create dialog via fragment factory
	           oDialog = sap.ui.xmlfragment(oView.getId(), "zbp_smarttable.view.AddForm", this);
	           oView.addDependent(oDialog);
	        }
	
	        oDialog.open();
	        var oEntry = this.getModel().createEntry("/BusinessPartnerSet('1666')",{properties:{"Partner":"1666","NameLast":"", "NameFirst":"", "RoleCode":"", "Name_fc":"", "Xdele":"", "Crdattime":""}});
	        //this.getView().byId("addBusinessPartnerDialog").bindElement(oEntry.getPath());
	        this.getView().byId("addBusinessPartnerDialog").setBindingContext(oEntry);
	         
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
			MessageBox.warning(this.getResourceBundle().getText("confirmDelete"), {
			    title: this.getResourceBundle().getText("delete"),                                    
			    onClose: this._deleteAction.bind(this),                                    
			    actions: [sap.m.MessageBox.Action.DELETE, sap.m.MessageBox.Action.CANCEL],
			    textDirection: sap.ui.core.TextDirection.Inherit    
			});
		},
		onCloseDialog: function(oEvent) {
			this.getModel().deleteCreatedEntry(this.getView().byId("addBusinessPartnerDialog").getBindingContext());
			this.getModel().refresh();
			oEvent.getSource().getParent().close();	
		},
		_deleteAction: function(oAction) {
			if(oAction === sap.m.MessageBox.Action.DELETE) {
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
			}
		},
		_handleUpdateSuccess: function(oData) {
			MessageToast.show(this.getResourceBundle().getText("updateSuccess"));
		},
		_handleUpdateError: function(oError) {
			MessageBox.error(this.getResourceBundle().getText("updateError"));
		},
		_handleDeleteSuccess: function(oData) {
			MessageToast.show(this.getResourceBundle().getText("deleteSuccess"));
			this.getView().byId("deleteButton").setEnabled(false);
		},
		_handleDeleteError: function(oError) {
			MessageBox.error(this.getResourceBundle().getText("deleteError"));
		}
	});
});