# Cadaxo Smart Table Demo
Playing around with SAP Fiori [Smart Table](https://experience.sap.com/fiori-design-web/smart-table/), annotations and more.

## Check it out
Here is [the link](https://zbpsmarttable-a17cc5c5c.dispatcher.hana.ondemand.com/index_mockServer.html) to Cadaxo Smart Table Demo with Mock Data.

## OData Version
We have also implemented [a live version](https://zbpsmarttable-a17cc5c5c.dispatcher.hana.ondemand.com/index_a4hServer.html) with an OData service in the background. Unfortunately this OData service is for private use only and if you are interessted in seeing it, please get in touch with me.

## Implemented Features
- Display records from a (SAPGUI) DB table
- Full Screen Mode Toggle
- Export to Excel
- All [Table Personalization Dialog](https://experience.sap.com/fiori-design-web/table-personalization-dialog/) Features
- Filter Bar
- Toggle Edit/Read Mode
- Single and Multiple Delete item Option
- Save Data to DB

## Planned Features
- Variant Management
- Business Partner ID generated in Backend
- Last Name, First Name required - validation (check next paragraph)
- Role Validation according to Search Help values

## Last Name, First Name required - validation
Validation should be done just in metadata.xml description. Nevertheless I am having issues with implementation:
- [stackoverflow.com/questions/43409026/sapui5-smart-table-smart-field-make-field-mandatory-with-annotation](https://stackoverflow.com/questions/43409026/sapui5-smart-table-smart-field-make-field-mandatory-with-annotation)
- [answers.sap.com/questions/178531/sapui5-smart-table-smart-field-make-field-mandator.html](https://answers.sap.com/questions/178531/sapui5-smart-table-smart-field-make-field-mandator.html)

## Made By
[Cadaxo](http://www.cadaxo.com/), Dusan Sacha  
Email: dusan.sacha@cadaxo.com  
Twitter: [sacha_dusan](http://twitter.com/sacha_dusan)

## License
This project is licensed under the MIT license.
