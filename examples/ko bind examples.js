// ko examples
function bindCombobox(selectElement$, model, optionsText, removeTitle, options) {
    var title;
    if (removeTitle)
        title = model.Items.shift()[optionsText]();
    var defOptions = {
        source: model.Items().map(function (item, idx) { return { item: idx, label: item[optionsText]() }; }),
        select: function (e, ui) {
            model.selectItem(ui.item.value);
            model.performItemSelection();
        },
        dataChanged: function (data) {
            model.Items.removeAll();
            for (var i = 0; i < data.length; i++) 
                model.Items.push(ko.mapping.fromJS(data[i]));
        },
        readonly: true
    };
    if (removeTitle)
        defOptions.title = title;
    options = $.extend(defOptions, options);
    selectElement$.combobox(options);
    model.selectedItem.subscribe(function (item) {
        selectElement$.data('combobox').wrapper.find('input').val(item[optionsText]());
    });
}

var AddressModel = function () {
    this.Items = null;
    this.selectedItem = ko.observable();
    this.initialize = function (data) {
        this.Items = ko.mapping.fromJS(data);
        bindCombobox($("#shipAddressCombo"), this, 'AddressName');
        this.selectedItem(this.Items()[0]);
    }

    this.selectItem = function (name) {
        for (var i = 0; i < this.Items().length; i++) {
            if (this.Items()[i].AddressName() == name) {
                this.selectedItem(this.Items()[i]);
                break;
            }
        }
    }
    this.performItemSelection = function () {
        ko.applyBindings(this.selectedItem(), $("#addressName")[0]);
        // $('#addressName').text(this.selectedItem().AddressName());
        //if (this.selectedItem().searchType() != "") {
        //    clearSessionStorage();
        //    loadSearch(SaveSearchModel.selectedItem().searchName());
        //}
    }
}

var BarakCustomerModel = function () {
    this.Items = null;
    this.selectedItem = ko.observable();
    this.initialize = function (data) {
        this.Items = ko.mapping.fromJS(data);
        /*for (var i = 0; i < data.length; i++) {
            this.Items.push(ko.mapping.fromJS(data[i]));
        }*/
        //ko.mapping.fromJS(data);
        bindCombobox($("#barakCustomerCombo"), this, 'label', false, { readonly: false, source: GetBarakCustomers, title: 'Select Customer' });
        //this.selectedItem(this.Items()[0]);
    }

    this.selectItem = function (name) {
        for (var i = 0; i < this.Items().length; i++) {
            if (this.Items()[i].label() == name) {
                this.selectedItem(this.Items()[i]);
                break;
            }
        }
    }
    this.performItemSelection = function () {
        //ko.applyBindings(this.selectedItem(), $("#barakCustomerCombo")[0]);
    }
}