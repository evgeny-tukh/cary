Cary.ui.DateHourBox = function (desc)
{
    var control    = document.createElement ('div'),
        datePicker = document.createElement ('input'),
        hourBox    = document.createElement ('input');
    var parent     = Cary.tools.getCtlParent (desc);
    var dateTime   = Cary.tools.getCtlDescField (desc, 'value');
    var minDate    = 'min' in desc ? desc.min : null;
    var maxDate    = 'max' in desc ? desc.max : null;
    var onChange   = 'onChange' in desc ? desc.onChange : null;
    var calendCtrl = null;
    var utcMode    = 'utc' in desc ? desc.utc : true;
    var defHours   = 'defHours' in desc ? desc.defHours : null;

    this.htmlObject = control;

    control.className = getClassName ('dateTimeBox');
    
    datePicker.type        = 'text';
    datePicker.className   = getClassName ('dateBox dateBox2', 'dpExtraClass');
    datePicker.id          = 'id' in desc ? desc.id + '_date' : null;
    datePicker.onclick     = processDateClick;

    hourBox.type      = 'text';
    hourBox.className = getClassName ('hourBox', 'hbExtraClass');
    hourBox.id        = 'id' in desc ? desc.id + '_hour' : null;
    hourBox.onclick   = function (event)
                        {
                            new Cary.ui.HourSelector ({ parent: control, x: event.clientX, y: event.clientY, value: parseInt (hourBox.value), utc: utcMode,
                                                        onSelect: function (value)
                                                                  {
                                                                      hourBox.value = value.toString ();
                                                                      
                                                                      if (onChange)
                                                                          onChange ();
                                                                  }});
                        };

    if (dateTime !== null)
    {
        var date = utcMode ? Cary.tools.formatDateUTC (dateTime) : Cary.tools.formatDateLocal (dateTime);
        var hour = utcMode ? Cary.tools.formatHourUTC (dateTime) : Cary.tools.formatHourLocal (dateTime);
        
        datePicker.value = date;
        hourBox.value    = hour.toString ();
    }
    
    control.appendChild (datePicker);
    control.appendChild (hourBox);
    parent.appendChild (control);
    
    if (desc.buttons)
    {
        new Cary.ui.Button ({ parent: control, text: Cary.symbols.check, visible: true, className: 'dhbButton',
                              onClick: () =>
                              {
                                  parent.removeChild (control);

                                  if (desc.onOk)
                                        desc.onOk (getValue ());

                                  event.cancelBubble = true;
                              } });
        new Cary.ui.Button ({ parent: control, text: Cary.symbols.cross, visible: true, className: 'dhbButton',
                              onClick: (event) =>
                              {
                                  parent.removeChild (control);

                                  if (desc.onCancel)
                                      desc.onCancel ();

                                  event.cancelBubble = true;
                              } });
    }
    
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

        if (Cary.ui.CalendarControl.instance !== null)
            Cary.ui.CalendarControl.instance.close ();

        calendarDesc = { position: { x: x, y: y }, utc: utcMode,
                         onSelect: function (date)
                                   {
                                        datePicker.value = Cary.tools.formatDateLocal (date);

                                        Cary.ui.CalendarControl.instance.close ();
                                        
                                        if ('onDateChanged' in desc)
                                            desc.onDateChanged (date);
                                   } };
            
        if (minDate !== null)
            calendarDesc.min = minDate;
        
        if (maxDate !== null)
            calendarDesc.max = maxDate;
        
        calendCtrl = new Cary.ui.CalendarControl (calendarDesc, this.value === '' ? new Date () : Cary.tools.stringToDateUTC (this.value /*+ 'T00:00:00Z'*/));
    }
    
    function getClassName (defaultClass, classKey)
    {
        if (!classKey)
            classKey = 'extraClass';
        
        return classKey in desc ? defaultClass + ' ' + desc [classKey] : defaultClass;
    }
    
    function getValue ()
    {
        var value = datePicker.value;
        var date  = Cary.tools.stringToDateUTC (value /*+ 'T00:00:00Z'*/);

        if (date !== null)
        {
            var hours = hourBox.value;
            
            if ((hours === null || hours === '') && defHours !== null)
                hours = defHours.toString ();
            
            if (utcMode)
                date.setUTCHours (parseInt (hours));
            else
                date.setHours (parseInt (hours));
        }
        
        return date;
    }
    
    function setValue (value)
    {
        var date = value ? (utcMode ? Cary.tools.formatDateUTC (value) : Cary.tools.formatDateLocal (value)) : null;
        var hour = value ? (utcMode ? Cary.tools.formatHourUTC (value) : Cary.tools.formatHourLocal (value)) : null;
        
        datePicker.value = date;
        hourBox.value    = hour;
    }
};

