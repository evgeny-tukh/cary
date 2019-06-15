Cary.ui.HourSelector = function (desc)
{
    var control = document.createElement ('div');
    var caption = document.createElement ('div');
    var close   = document.createElement ('button');
    var parent  = 'parent' in desc ? desc.parent : document.getElementsByTagName ('body') [0];
    var x       = 'x' in desc ? desc.x : 0;
    var y       = 'y' in desc ? desc.y : 0;
    var i;
    var j;
    var hour;
    var value;
    
    control.className  = 'hourSelector';
    control.style.left = Cary.tools.int2pix (100/*desc.x*/);
    control.style.top  = Cary.tools.int2pix (0/*desc.y*/);

    caption.className = 'hourSelectorCaption';
    caption.innerText = 'Hours';
    
    close.innerText = 'X';
    close.className = 'hourSelectorCloseIcon';
    close.onclick   = hide;
    
    control.appendChild (caption);
    caption.appendChild (close);
    
    for (i = 0; i < 4; ++ i)
    {
        for (j = 0; j < 6; ++ j)
        {
            hour = document.createElement ('div');
            
            value = i * 6 + j;
            
            hour.className  = ('value' in desc && desc.value === value) ? 'selHourDiv' : 'hourDiv';
            hour.innerText  = value.toString ();
            hour.style.left = int2pix (j * 26 + 2);
            hour.style.top  = int2pix (i * 26 + 23);
            hour.id         = 'h' + value.toString ();
            hour.onclick    = function ()
                              {
                                  if ('onSelect' in desc)
                                      desc.onSelect (parseInt (this.id.substr (1)));
                                  
                                  hide ();
                              };
            
            control.appendChild (hour);
        }
    }
    
    this.show = show;
    this.hide = hide;
    
    show ();
    
    function show ()
    {
        parent.appendChild (control);
    }
    
    function hide ()
    {
        if (parent.contains (control))
            parent.removeChild (control);
    }
};
