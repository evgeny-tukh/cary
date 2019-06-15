Cary.ui.DateHourBox = function (desc)
{
    var control    = document.createElement ('div'),
        datePicker = document.createElement ('input'),
        hourBox    = document.createElement ('input');
    var parent     = Cary.tools.getCtlParent (desc);
    var dateTime   = Cary.tools.getCtlDescField (desc, 'value');
    var minDate    = 'min' in desc ? desc.min : null;
    var maxDate    = 'max' in desc ? desc.max : null;
    var calendCtrl = null;

    control.className = getClassName ('dateTimeBox');
//control.style.backgroundColor='blue';
//control.style.marginRight='0px';
    try
    {
        datePicker.type = 'date';
    }
    catch (exception)
    {
        datePicker.type = 'text';
    }
    
    datePicker.className = getClassName ('dateBox dateBox2');
    datePicker.id        = 'id' in desc ? desc.id + '_date' : null;
    datePicker.onclick   = processDateClick;
//datePicker.style.width='145px';
    /*try
    {
        hourBox.type = 'number';
        hourBox.min  = '0';
        hourBox.max  = '23';
    }
    catch (exception)
    {
        hourBox.type = 'text';
    }*/
    
    hourBox.type      = 'text';
    hourBox.className = getClassName ('hourBox');
    hourBox.id        = 'id' in desc ? desc.id + '_hour' : null;
    hourBox.onclick   = function (event)
                        {
                            new Cary.ui.HourSelector ({ parent: control, x: event.clientX, y: event.clientY, value: parseInt (hourBox.value),
                                                        onSelect: function (value) { hourBox.value = value.toString (); } });
                        };

    if (dateTime !== null)
    {
        var date = Cary.tools.formatDateUTC (dateTime);
        var hour = Cary.tools.formatHourUTC (dateTime);
        
        datePicker.value = date;
        hourBox.value    = hour.toString ();
    }
    
    control.appendChild (datePicker);
    control.appendChild (hourBox);
    parent.appendChild (control);
    
    this.htmlObject = control;
    this.setValue   = setValue;
    this.getValue   = getValue;
    this.setMin     = setMin;
    this.setMax     = setMax;
    this.enable     = enable;
    
    enable (!(('disabled' in desc) && desc.disabled));

    function enable (enabled)
    {
        var disabled = enabled ? null : 'disabled';
        
        control.disabled    = disabled;
        datePicker.disabled = disabled;
        hourBox.disabled    = disabled;
    }
    
    function setMin (date)
    {
        minDate = date;
        
        if (calendCtrl !== null)
            calendCtrl.setMin (date);
    }
    
    function setMax (date)
    {
        maxDate = date;
        
        if (calendCtrl !== null)
            calendCtrl.setMax (date);
    }
    
    function processDateClick (event)
    {
        var x;
        var y;
        var windowWidth  = window.innerWidth;
        var windowHeight = window.innerHeight;
        var calendarDesc;
        
        if (!event)
            event = window.event;
        
        x = event.clientX;
        y = event.clientY;
        
        if ((x + 220) > windowWidth)
            x = windowWidth - 220;
        
        if ((y + 180) > windowHeight)
            y = windowHeight - 180;

        if (CalendarControl.instance !== null)
            CalendarControl.instance.close ();

        calendarDesc = { position: { x: x, y: y },
                         onSelect: function (date)
                                   {
                                        datePicker.value = formatDateLocal (date);

                                        CalendarControl.instance.close ();
                                        
                                        if ('onDateChanged' in desc)
                                            desc.onDateChanged (date);
                                   } };
            
        if (minDate !== null)
            calendarDesc.min = minDate;
        
        if (maxDate !== null)
            calendarDesc.max = maxDate;
        
        calendCtrl = new Cary.ui.CalendarControl (calendarDesc, new stringToDate (this.value + 'T00:00:00Z'));
    }
    
    function getClassName (defaultClass)
    {
        return 'extraClass' in desc ? defaultClass + ' ' + desc.extraClass : defaultClass;
    }
    
    function getValue ()
    {
        var value = datePicker.value;
        var date  = stringToDate (value + 'T00:00:00Z');

        date.setHours (parseInt (hourBox.value));
        
        return date;
    }
    
    function setValue (value)
    {
        var date = Cary.tools.formatDateLocal (value);
        var hour = Cary.tools.formatHourLocal (value);
        
        datePicker.value = date;
        hourBox.value    = hour;
    }
};
