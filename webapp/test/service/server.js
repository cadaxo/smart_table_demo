sap.ui.define([
	"sap/ui/core/util/MockServer"
], function (MockServer) {
	"use strict";

	return {

		init: function () {
			
			// enable 'mock' variant management
			jQuery.sap.require("sap.ui.fl.FakeLrepConnector");
			sap.ui.fl.FakeLrepConnector.enableFakeConnector("./test/service/component-test-changes.json");
			
			// create
			var oMockServer = new MockServer({
				rootUri: "/destinations/a4h_750_http_root/sap/opu/odata/sap/ZUI5_BP_SMARTTABLE_SRV/"
			});

			// configure
			MockServer.config({
				autoRespond: true,
				autoRespondAfter: 1000
			});

			// simulate
			var sPath = jQuery.sap.getModulePath("zbp_smarttable.test.service");
			oMockServer.simulate(sPath + "/metadata.xml", sPath);

			// start
			oMockServer.start();
		}
	};

});