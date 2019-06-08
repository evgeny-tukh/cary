Cary.ui.Window = function (desc)
{
    var instance = this;
    var paneMode;
    var attach;

    Cary.ui.Window.instances.push (this);

    if (Cary.tools.isNothing (desc))
        desc = {};
    
    attach   = 'attach' in desc ? desc.attach : null;
    paneMode = 'paneMode' in desc && desc.paneMode;
    
    if (paneMode)
        desc.noCloseIcon = true;
    
    this.wnd       = attach === null ? document.createElement ('div') : attach;
    this.closeIcon = paneMode ? null : document.createElement ('div');
    this.client    = paneMode ? null : document.createElement ('div');
    this.parent    = Cary.tools.isNothing (desc.parent) ? document.getElementsByTagName ('body') [0] : desc.parent;
    this.desc      = desc;
    this.adjustPos = function () { adjustPosition (this); };

    this.wnd.wndObject = this;

    if (this.client)
        this.client.wndObject = this;

    if (this.closeIcon !== null)
    {
        this.closeIcon.className = 'windowCloseIcon';
        this.closeIcon.onclick   = function () { instance.close () };
        this.closeIcon.innerText = Cary.symbols.cross;
    }

    if (paneMode)
        this.wnd.className = 'pane';
    else if (attach === null)
        this.wnd.className = 'window';
    else
        this.wnd.className = 'attachedWindow';
        
    this.wnd.id        = 'id' in desc ? desc.id : null;
    this.wnd.innerText = 'title' in desc ? desc.title : '';

    adjustPosition (this);
    
    if (this.client !== null)
    {
        this.client.className = 'windowClient';
        this.client.id        = this.wnd.id === null ? null : this.wnd.id + '_client';
    
        if ('padding' in desc)
        {
            if (typeof (desc.padding) === 'number')
                this.client.style.padding = int2pix (desc.padding);
            else
                this.client.style.padding = desc.padding;
        }

        this.wnd.appendChild (this.client);
    }
    
    if (!('noCloseIcon' in desc) || !desc.noCloseIcon)
        this.wnd.appendChild (this.closeIcon);

    if ('userInit' in desc)
        desc.userInit (this);
        
    this.onInitialize ();
    
    if ('visible' in desc && desc.visible)
        this.show ();

    if ('zOrder' in desc && desc.zOrder)
        this.wnd.style.zIndex = desc.zOrder.toString ();

    function adjustPosition (instance)
    {
        function getWidth ()
        {
            var result;
            
            if (desc.position.width === null)
                result = 'fit-content';
            else if (typeof (desc.position.width) === 'number')
                result = Cary.tools.int2pix (desc.position.width);
            else
                result = desc.position.width;
            
            return result; //desc.position.width === null ? 'fit-content' : Cary.tools.int2pix (desc.position.width);
        }
        
        function getHeight ()
        {
            var result;
            
            if (desc.position.height === null)
                result = 'fit-content';
            else if (typeof (desc.position.height) === 'number')
                result = Cary.tools.int2pix (desc.position.height);
            else
                result = desc.position.height;
            
            return result; //desc.position.width === null ? 'fit-content' : Cary.tools.int2pix (desc.position.width);
        }
        
        if ('position' in desc)
        {
            if ('hcenter' in desc.position && desc.position.hcenter)
            {
                instance.wnd.style.left  = Cary.tools.int2pix ((window.innerWidth - desc.position.width) >> 1);
                instance.wnd.style.width = getWidth ();
            }
            else
            {
                if (desc.position.left)
                    instance.wnd.style.left = Cary.tools.int2pix (desc.position.left);

                if (desc.position.width)
                    instance.wnd.style.width = getWidth ();

                if (desc.position.right)
                    instance.wnd.style.right = Cary.tools.int2pix (desc.position.right);
            }

            if ('vcenter' in desc.position && desc.position.vcenter)
            {
                instance.wnd.style.top    = Cary.tools.int2pix ((window.innerHeight - desc.position.height) >> 1);
                instance.wnd.style.height = getHeight ();
            }
            else
            {
                if (desc.position.top)
                    instance.wnd.style.top = Cary.tools.int2pix (desc.position.top);

                if (desc.position.height)
                    instance.wnd.style.height = getHeight ();

                if (desc.position.bottom)
                    instance.wnd.style.bottom = Cary.tools.int2pix (desc.position.bottom);
            }
            
            if ('absolute' in desc.position && desc.position.absolute)
                instance.wnd.style.position = 'absolute';
        }
    }
};

Cary.ui.Window.instances = [];

Cary.ui.Window.findObjectByHtmlObject = function (object)
{
    var result = null;

    for (var i = 0; i < Cary.ui.Window.instances.length; ++ i)
    {
        if (Cary.ui.Window.instances [i].wnd === object || Cary.ui.Window.instances [i].client === object)
        {
            result = Cary.ui.Window.instances [i]; break;
        }
    }

    return result;
};

Cary.ui.Window.findObjectByKey = function (key, value)
{
    var result = null;

    for (var i = 0; i < Cary.ui.Window.instances.length; ++ i)
    {
        if (key in Cary.ui.Window.instances [i] && Cary.ui.Window.instances [i][key] === value)
        {
            result = Cary.ui.Window.instances [i]; break;
        }
    }

    return result;
};

Cary.ui.Window.prototype.onInitialize = function ()
{
    if ('userInit' in this)
        this.userInit ();
};

Cary.ui.Window.prototype.close = function (quiet)
{
    if (Cary.tools.isNothing (quiet))
        quiet = false;
    
    if (quiet || this.queryClose ())
    {
        if ('onClose' in this.desc)
            this.desc.onClose ();

        this.hide ();

        this.wnd.removeChild (this.client);
        this.wnd.removeChild (this.closeIcon);
    }
};

Cary.ui.Window.prototype.open = function ()
{
    this.onInitialize ();
    this.show ();
};

Cary.ui.Window.prototype.show = function ()
{
    this.parent.appendChild (this.wnd);
};

Cary.ui.Window.prototype.hide = function ()
{
    if (this.parent.contains (this.wnd))
        this.parent.removeChild (this.wnd);
};

Cary.ui.Window.prototype.queryClose = function ()
{
    return true;
};

Cary.ui.Window.prototype.setTitle = function (title)
{
    this.wnd.firstChild.data = title;
};

Cary.ui.Window.prototype.setWidth = function (width)
{
    if (typeof (width) === 'number')
        this.wnd.style.width = Cary.tools.int2pix (width);
    else
        this.wnd.style.width = width;
};

Cary.ui.Window.prototype.setHeight = function (height)
{
    var top;
    var oldHeight = parseInt (this.wnd.style.height);
    
    if (typeof (height) === 'number')
    {
        this.wnd.style.height = Cary.tools.int2pix (height);
    }
    else
    {
        this.wnd.style.height = height;
        
        height = parseInt (height);
    }
    
    top = parseInt (this.wnd.style.top);
    
    if (top > 0)
    {
        top -= (height - oldHeight) / 2;
    
        this.wnd.style.top = Cary.tools.int2pix (top)
    }
};

Cary.ui.Window.prototype.getChildById = function (id)
{
    var children = this.client.getElementsByTagName ('*');
    var result   = null;

    for (var i = 0; i < children.length; ++ i)
    {
        if (children [i].id === id)
        {
            result = children [i]; break;
        }
    }
        
    return result;
};
