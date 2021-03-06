Cary.ui.anchor = { NONE: 0, TOP: 1, BOTTOM: 2, LEFT: 4, RIGHT: 8 };

Cary.ui.Control = function (desc, styles)
{
    this.styles     = Cary.tools.isNothing (styles) ? {} : styles;
    this.htmlObject = null;
    this.desc       = desc;
    this.parent     = 'parent' in desc ? desc.parent : document.getElementsByTagName ('body') [0];
    
    this.initialize ();
};

Cary.ui.Control.prototype.setFocus = function ()
{
    if (this.htmlObject)
        this.htmlObject.focus ();
};

Cary.ui.Control.prototype.getParam = function (name, defValue)
{
    if (Cary.tools.isNothing (defValue))
        defValue = null;
    
    return name in this.desc ? this.desc [name] : defValue;
};

Cary.ui.Control.prototype.show = function (visible)
{
    if (Cary.tools.isNothing (visible))
        visible = true;
    
    if (this.htmlObject !== null)
    {
        if (!this.displayStyle)
        {
            if (this.htmlObject.style.display && this.htmlObject.style.display !== 'none')
                this.displayStyle = this.htmlObject.style.display;
        }

        var newDisplay = visible ? null : 'none';

        if (visible && this.parent && !this.parent.contains (this.htmlObject))
            this.parent.appendChild (this.htmlObject);
        
        this.htmlObject.style.display = visible ? (this.displayStyle ? this.displayStyle : null) : 'none';
    }
};

Cary.ui.Control.prototype.enable = function (enabled)
{
    if (Cary.tools.isNothing (enabled))
        enabled = true;
    
    if (this.htmlObject !== null)
        this.htmlObject.disabled = enabled ? null : true;
};

Cary.ui.Control.prototype.setValue = function (value)
{
    if (Cary.tools.isNothing (value))
        value = null;
    
    if (this.htmlObject !== null)
        this.htmlObject.value = value;
};

Cary.ui.Control.prototype.getValue = function ()
{
    return (this.htmlObject !== null) ? this.htmlObject.value : null;
};

Cary.ui.Control.prototype.setText = function (text)
{
    if (Cary.tools.isNothing (text))
        text = null;
    
    if (this.htmlObject !== null)
        this.htmlObject.innerText = text;
};

Cary.ui.Control.prototype.initialize = function ()
{
    if (this.htmlObject !== null)
    {
        var styleValue;
        var anchor = this.getParam ('anchor', Cary.ui.anchor.NONE);

        if ('id' in this.desc)
            this.htmlObject.id = this.desc.id;
        
        if ('className' in this.desc)
            this.htmlObject.className = this.desc.className;
        
        for (var styleName in this.styles)
            this.setStyle (styleName, this.styles [styleName]);

        if (anchor !== Cary.ui.anchor.NONE)
        {
            this.setStyle ('position', 'absolute');
            
            if (anchor & Cary.ui.anchor.TOP)
                this.setStyle ('top', 0);
                
            if (anchor & Cary.ui.anchor.BOTTOM)
                this.setStyle ('bottom', 0);
                
            if (anchor & Cary.ui.anchor.LEFT)
                this.setStyle ('left', 0);
                
            if (anchor & Cary.ui.anchor.RIGHT)
                this.setStyle ('right', 0);                
        }
        
        if ('visible' in this.desc && this.desc.visible)
            this.show ();
        
        if ('onClick' in this.desc)
            this.htmlObject.onclick = this.desc.onClick;

        this.htmlObject.control = this;
    }
};

Cary.ui.Control.prototype.setStyle = function (styleName, styleValue)
{
    if (typeof (styleValue) === 'number')
        this.htmlObject.style [styleName] = Cary.tools.int2pix (styleValue);
    else
        this.htmlObject.style [styleName] = styleValue;
};

// Control block implementation
Cary.ui.ControlBlock = function (desc, styles)
{
    if (!('className' in desc))
        desc.className = 'ctlBlock';
    
    Cary.ui.Control.apply (this, arguments);
};

Cary.ui.ControlBlock.prototype = Object.create (Cary.ui.Control.prototype);

Cary.ui.ControlBlock.prototype.initialize = function ()
{
    this.htmlObject           = document.createElement ('div');
    this.htmlObject.innerText = this.getParam ('text');
    
    Cary.ui.Control.prototype.initialize.apply (this, arguments);
};

Cary.ui.SVG = function (desc, styles)
{
    Cary.ui.ControlBlock.apply (this, arguments);
};

Cary.ui.SVG.prototype = Object.create (Cary.ui.ControlBlock.prototype);

Cary.ui.SVG.prototype.initialize = function ()
{
    var svg  = document.createElement ('svg');
    var path = document.createElement ('path');

    Cary.ui.ControlBlock.prototype.initialize.apply (this, arguments);

    if ('focusable' in this.desc)
        addAttribute (svg, 'focusable', this.desc.focusable ? 'true' : 'false');

    if ('viewbox' in this.desc)
        addAttribute (svg, 'viewBox', this.desc.viewbox);
        
    if ('height' in this.desc)
        addAttribute (svg, 'height', this.desc.height);
        
    if ('width' in this.desc)
        addAttribute (svg, 'width', this.desc.width);
        
    if ('path' in this.desc)
        addAttribute (path, 'd', this.desc.path);
    
    svg.appendChild (path);

    this.htmlObject.appendChild (svg);

    function addAttribute (element, attrName, attrValue)
    {
        var attr = document.createAttribute (attrName);

        attr.value = attrValue;

        element.setAttributeNode (attr);
    }
};
