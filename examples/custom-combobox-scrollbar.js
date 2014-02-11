var COMBOBOX_HEIGHT = 400;
$.combobox = {
    menuShowCallback: function (ul, input) {
        ul.height(COMBOBOX_HEIGHT);
        setTimeout(function () {
            ul.scrollbar('y', 'destroy');
            ul.scrollbar('y');
            input.data('menuUl', ul);
        }, 4);
    },
    menuClosing: function (e, ui) {
        $(this).data('menuUl').scrollbar('y', 'destroy');
    }

};