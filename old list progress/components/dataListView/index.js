'use strict';

app.dataListView = kendo.observable({
    onShow: function() {},
    afterShow: function() {}
});

// START_CUSTOM_CODE_dataListView
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes

// END_CUSTOM_CODE_dataListView
(function(parent) {
    var dataProvider = app.data.progressDataProvider,
        jsdoOptions = {
            name: 'Person',
            autoFill: false
        },
        dataSourceOptions = {
            type: 'jsdo',
            transport: {},

            schema: {
                model: {
                    fields: {
                        'firstName': {
                            field: 'firstName',
                            defaultValue: ''
                        },
                        'lastName': {
                            field: 'lastName',
                            defaultValue: ''
                        },
                    }
                }
            },
        },
        dataSource = new kendo.data.DataSource({
            pageSize: 50
        }),
        dataListViewModel = kendo.observable({
            dataSource: dataSource,
            _dataSourceOptions: dataSourceOptions,
            _jsdoOptions: jsdoOptions,
            itemClick: function(e) {
                app.mobileApp.navigate('#components/dataListView/details.html?uid=' + e.dataItem.uid);
            },
            detailsShow: function(e) {
                var item = e.view.params.uid,
                    dataSource = dataListViewModel.get('dataSource'),
                    itemModel = dataSource.getByUid(item);
                if (!itemModel.firstName) {
                    itemModel.firstName = String.fromCharCode(160);
                }
                dataListViewModel.set('currentItem', itemModel);
            },
            currentItem: null
        });

    if (typeof dataProvider.sbProviderReady === 'function') {
        dataProvider.sbProviderReady(function dl_sbProviderReady() {
            parent.set('dataListViewModel', dataListViewModel);
        });
    } else {
        parent.set('dataListViewModel', dataListViewModel);
    }
    parent.set('onShow', function() {
        dataProvider.loadCatalogs().then(function _catalogsLoaded() {
            var jsdoOptions = dataListViewModel.get('_jsdoOptions'),
                jsdo = new progress.data.JSDO(jsdoOptions),
                dataSourceOptions = dataListViewModel.get('_dataSourceOptions'),
                dataSource;

            dataSourceOptions.transport.jsdo = jsdo;
            dataSource = new kendo.data.DataSource(dataSourceOptions);
            dataListViewModel.set('dataSource', dataSource);
        });
    });

})(app.dataListView);

// START_CUSTOM_CODE_dataListViewModel
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes

// you can handle the beforeFill / afterFill events here. For example:
/*
app.dataListView.dataListViewModel.get('_jsdoOptions').events = {
    'beforeFill' : [ {
        scope : app.dataListView.dataListViewModel,
        fn : function (jsdo, success, request) {
            // beforeFill event handler statements ...
        }
    } ]
};
*/
// END_CUSTOM_CODE_dataListViewModel