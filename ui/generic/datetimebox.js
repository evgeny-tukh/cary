Cary.ui.DateTimeBox = function (desc)
{
    var control    = document.createElement ('div'),
        datePicker = document.createElement ('input'),
        timePicker = document.createElement ('input');
    var parent     = Cary.tools.getCtlParent (desc);
    var dateTime   = Cary.tools.getCtlDescField (desc, 'value');

    control.className = getClassName ('dateTimeBox');
    
    datePicker.type      = 'date';
    datePicker.className = getClassName ('dateBox');
    datePicker.id        = 'id' in desc ? desc.id + '_date' : null;

    timePicker.type      = 'time';
    timePicker.className = getClassName ('timeBox');
    timePicker.id        = 'id' in desc ? desc.id + '_time' : null;

    if (dateTime !== null)
    {
        var date = Cary.tools.formatDateUTC (dateTime);
        var time = Cary.tools.formatTimeUTC (dateTime);
        
        datePicker.value = date;
        timePicker.value = time;
    }
    
    control.appendChild (datePicker);
    control.appendChild (timePicker);
    parent.appendChild (control);
    
    this.htmlObject = control;
    this.setValue   = setValue;
    
    function getClassName (defaultClass)
    {
        return 'extraClass' in desc ? defaultClass + ' ' + desc.extraClass : defaultClass;
    }
    
    function setValue (value)
    {
        var date = Cary.tools.formatDateUTC (value);
        var time = Cary.tools.formatTimeUTC (value);
        
        datePicker.value = date;
        timePicker.value = time;
    }
}
