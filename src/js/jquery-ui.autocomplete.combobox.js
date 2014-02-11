(function ($) {
    $.widget("ui.combobox", {
        _create: function () {
            this.options = $.extend({}, $.combobox, this.options);
            var input,
                select,
                options = $.extend({}, this.options,/* $.combobox,*/
                {
                    delay: 0,
                    minLength: 0,
                    source: function (request, response) {
                        if (!request.term.length) {
                            request.term = input.val();
                            //response(self.options.initialValues);
                        }
                        if (typeof self.options.source === "function") {
                            self.options.source(request, response);
                        } else {
                            var renderResponse = function () {
                                return {
                                    label: this.replace(
                                        new RegExp(
                                            "(?![^&;]+;)(?!<[^<>]*)(" +
                                            $.ui.autocomplete.escapeRegex(request.term) +
                                            ")(?![^<>]*>)(?![^&;]+;)", "gi"
                                        ), "<strong>$1</strong>"),
                                    value: this
                                };
                            };
                            var matcher;
                            if (!self.options.readonly)
                                matcher = new RegExp($.ui.autocomplete.escapeRegex(request.term), "i");
                            function callResponse(data, getText) {
                                var items, renderFn = renderResponse;

                                if (self.options.readonly) {
                                    items = [].slice.call(data, 1);
                                    if (getText)
                                        items = items.map(getText);
                                }
                                else {
                                    if (data instanceof Array && data[0] instanceof Object && !getText) {
                                        getText = function () { return this.label; };
                                        renderFn = function () { return $.extend(renderResponse.call(this.label), { item: this.item }) };
                                    }
                                    if (getText) {

                                        items = $.map(data, function (val) {
                                            var text = getText.call(val);
                                            if (text && (!request.term || matcher.test(text)))
                                                return renderFn.call(val);
                                        });
                                    }
                                    else {
                                        items = $.map(data, function (val) {
                                            if (!request.term || matcher.test(val))
                                                return renderFn.call(val);
                                        })
                                    }
                                }
                                response(items);
                            }
                            if (typeof self.options.source === "string") { //url
                                //if (request.term.length != 1 )
                                $.ajax({
                                    url: self.options.source,
                                    data: request,
                                    type: "POST",
                                    dataType: "json",
                                    success: function (data, status) {
                                        callResponse(data);
                                        if (self.options.dataChanged)
                                            self.options.dataChanged.call(self, data);
                                    },
                                    error: function () {
                                        response([]);
                                    }
                                });
                            } else if (self.options.source instanceof Array) {
                                callResponse(self.options.source);
                            } else if (!self.options.source) {
                                self.options.source = 
                                callResponse(select.find('option'), function (option) {
                                    return $(option).text();
                                });
                            }
                        }
                    },
                    position: { collision: "flip" }
                    /*select: function( event, ui ) {
                        ui.item.option.selected = true;
                        self._trigger( "selected", event, {
                            item: ui.item.option
                        });
                    },
                    change: function( event, ui ) {
                        if ( !ui.item ) {
                            var matcher = new RegExp( "^" + $.ui.autocomplete.escapeRegex( $(this).val() ) + "$", "i" ),
                                valid = false;
                            select.children( "option" ).each(function() {
                                if ( $( this ).text().match( matcher ) ) {
                                    this.selected = valid = true;
                                    return false;
                                }
                            });
                            if ( !valid ) {
                                // remove invalid value, as it didn't match anything
                                $( this ).val( "" );
                                select.val( "" );
                                input.data( "autocomplete" ).term = "";
                                return false;
                            }
                        }
                    }*/
                });
            var self = this;
            select = this.element.hide();
                //selected = select.children( ":selected" ),
                //value = selected.val() ? selected.text() : "",
            var wrapper = this.wrapper = $("<span>")
                    .addClass("ui-combobox")
                    .insertAfter(select);

            if (self.options.menuClosing)
                options.close = self.options.menuClosing;
            if (!self.options.source && self.options.readonly !== false)
                self.options.readonly = true;

            input = $("<input>")
                .appendTo(wrapper)
                //.val( value )
                .addClass("ui-state-default ui-combobox-input")
                .autocomplete(options)
                .addClass("ui-widget ui-widget-content ui-corner-left");

            self.input = input;

            input.data("autocomplete")._renderItem = function (ul, item) {
                return $("<li></li>")
                    .data("item.autocomplete", item)
                    .append("<a>" + item.label + "</a>")
                    .appendTo(ul);
            };
            if (self.options.menuShowCallback) {
                var _resizeMenu = input.data("autocomplete")._resizeMenu;
                input.data("autocomplete")._resizeMenu = function () {
                    _resizeMenu.apply(this);
                    this.menu.element.addClass('ui-combobox-menu');
                    self.options.menuShowCallback.apply(self, [this.menu.element, this.element]);
                };
            }

            if (self.options.readonly)
                input.attr('readonly', 'readonly');
            self.button = $("<a>")
                .attr("tabIndex", -1)
                .attr("title", "Show All Items")
                .appendTo(wrapper)
                .button({
                    icons: {
                        primary: "ui-icon-triangle-1-s"
                    },
                    text: false
                })
                .removeClass("ui-corner-all")
                .addClass("ui-corner-right ui-combobox-toggle")
                .click(openCloseMenu);

            if (self.options.readonly)
                input.click(openCloseMenu);

            if (self.options.title) {
                input.val(self.options.title);
                if (!self.options.readonly) {
                    input.bind('focus.combobox', function () {
                        input.val('');
                        input.unbind('focus.combobox');
                    });
                }
            }

            function openCloseMenu() {
                    // close if already visible
                    if (input.autocomplete("widget").is(":visible")) {
                        input.autocomplete("close");
                        return;
                    }

                    // work around a bug (likely same cause as #5265)
                    $(this).blur();

                    // pass empty string as value to search for, displaying all results
                    /*if (!self.options.readonly && self.options.title && self.options.title == input.val())
                        input.focus();
                    else {*/
                    /*function wrapCall(method) {
                        if (!$.browser.msie)
                            method();
                        else
                            setTimeout(method, 0);
                    }
                    wrapCall(function () {
                        input.focus();
                        wrapCall(function () { input.autocomplete("search", ""); });
                    });
                    //}*/
                    input.autocomplete("search", "");
                    input.focus();
            }
        },

        destroy: function () {
            this.wrapper.remove();
            this.element.show();
            $.Widget.prototype.destroy.call(this);
        },

        disable: function () {
            this.input.autocomplete('disable')
                .attr('disabled', 'disabled');
            this.button.button('disable');

        }
    });
})(jQuery);