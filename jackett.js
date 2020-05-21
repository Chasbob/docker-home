// See https://github.com/Jackett/Jackett/issues/1576#issuecomment-453656413
////hack to add all free indexers in Jackett
$(document).ready(function () {
	EnableAllUnconfiguredIndexersList();
});


function EnableAllUnconfiguredIndexersList() {
    var UnconfiguredIndexersDialog = $($("#select-indexer").html());

    var indexersTemplate = Handlebars.compile($("#unconfigured-indexer-table").html());
    var indexersTable = $(indexersTemplate({ indexers: unconfiguredIndexers, total_unconfigured_indexers: unconfiguredIndexers.length  }));
    indexersTable.find('.indexer-setup').each(function (i, btn) {
        var indexer = unconfiguredIndexers[i];
        $(btn).click(function () {
            $('#select-indexer-modal').modal('hide').on('hidden.bs.modal', function (e) {
                displayIndexerSetup(indexer.id, indexer.name, indexer.caps, indexer.link, indexer.alternativesitelinks, indexer.description);
            });
        });
    });
    indexersTable.find('.indexer-add').each(function (i, btn) {

            $('#select-indexer-modal').modal('hide').on('hidden.bs.modal', function (e) {
                var indexerId = $(btn).attr("data-id");
                api.getIndexerConfig(indexerId, function (data) {
			        if (data.result !== undefined && data.result == "error") {
			            doNotify("Error: " + data.error, "danger", "glyphicon glyphicon-alert");
			            return;
			        }
	                api.updateIndexerConfig(indexerId, data, function (data) {
		                if (data == undefined) {
		                    reloadIndexers();
		                    doNotify("Successfully configured " + name, "success", "glyphicon glyphicon-ok");
		                } else if (data.result == "error") {
		                    if (data.config) {
		                        populateConfigItems(configForm, data.config);
		                    }
		                    doNotify("Configuration failed: " + data.error, "danger", "glyphicon glyphicon-alert");
		                }
			        }).fail(function (data) {
			            if(data.responseJSON.error !== undefined) {
                doNotify("An error occured while configuring this indexer<br /><b>" + data.responseJSON.error + "</b><br /><i><a href=\"https://github.com/Jackett/Jackett/issues/new?title=[" + indexerId + "] " + data.responseJSON.error + " (Config)\" target=\"_blank\">Click here to open an issue on GitHub for this indexer.</a><i>", "danger", "glyphicon glyphicon-alert", false);
            } else {
                doNotify("An error occured while configuring this indexer, is Jackett server running ?", "danger", "glyphicon glyphicon-alert");
            }

			        });
                });
            });

    });
    indexersTable.find("table").DataTable(
        {
            "stateSave": true,
            "fnStateSaveParams": function (oSettings, sValue) {
                sValue.search.search = ""; // don't save the search filter content
                return sValue;
            },
            "bAutoWidth": false,
            "pageLength": -1,
            "lengthMenu": [[10, 20, 50, 100, 250, 500, -1], [10, 20, 50, 100, 250, 500, "All"]],
            "order": [[0, "asc"]],
            "columnDefs": [
                {
                    "name": "name",
                    "targets": 0,
                    "visible": true,
                    "searchable": true,
                    "orderable": true
                },
                {
                    "name": "description",
                    "targets": 1,
                    "visible": true,
                    "searchable": true,
                    "orderable": true
                },
                {
                    "name": "type",
                    "targets": 2,
                    "visible": true,
                    "searchable": true,
                    "orderable": true
                },
                {
                    "name": "type_string",
                    "targets": 3,
                    "visible": false,
                    "searchable": true,
                    "orderable": true,
                },
                {
                    "name": "language",
                    "targets": 4,
                    "visible": true,
                    "searchable": true,
                    "orderable": true
                },
                {
                    "name": "buttons",
                    "targets": 5,
                    "visible": true,
                    "searchable" : false,
                    "orderable": false
                }
            ]
        });

    var undefindexers = UnconfiguredIndexersDialog.find('#unconfigured-indexers');
    undefindexers.append(indexersTable);

    UnconfiguredIndexersDialog.on('shown.bs.modal', function() {
        $(this).find('div.dataTables_filter input').focusWithoutScrolling();
    });

    UnconfiguredIndexersDialog.on('hidden.bs.modal', function (e) {
        $('#indexers div.dataTables_filter input').focusWithoutScrolling();
    });

    $("#modals").append(UnconfiguredIndexersDialog);

    UnconfiguredIndexersDialog.modal("show");
}
