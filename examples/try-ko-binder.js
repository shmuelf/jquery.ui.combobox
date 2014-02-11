ko.bindingHandlers.comboboxOptions = {
            init: function (element, valueAccessor, allBindingsAccessor) {
                //initialize datepicker with some optional options
                var options = ko.utils.unwrapObservable(valueAccessor())
                if (options) {
                    if (options.options)
                        comboOptions.source = options.options;
                    if (options.optionsText)
                        comboOptions.optionsText = options.optionsText;
                    if (options.value)
                        comboOptions.value = options.value;
                    if (options.event && options.event.change)
                        comboOptions
                }

                $(element).combobox(comboOptions);

                //handle the field changing
                ko.utils.registerEventHandler(element, "change", function () {
                    var observable = valueAccessor();
                    observable($(element).datepicker("getDate"));
                });

                //handle disposal (if KO removes by the template binding)
                ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
                    $(element).datepicker("destroy");
                });

            },
            update: function (element, valueAccessor) {
                var value = ko.utils.unwrapObservable(valueAccessor()),
            current = $(element).datepicker("getDate");

                if (value - current !== 0) {
                    $(element).datepicker("setDate", value);
                }
            }
        };