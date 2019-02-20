Cary.LayoutManager = function (layoutDefs)
{
    var instance = this;
    
    this.layouts = [];
    
    layoutDefs.forEach (function (layoutDef)
                        {
                            var layout = new Cary.Layout (layoutDef);
                            
                            layout.adjust ();
                            
                            instance.layouts.push (layout);
                        });
};

Cary.LayoutManager.prototype.getDiv = function (id)
{
    var result,i;
    
    for (result = null, i = 0; i < this.layouts.length; ++ i)
    {
        if (this.layouts [i].id === id)
        {
            result = this.layouts [i].div; break;
        }
    }
    
    return result;
};

Cary.LayoutManager.prototype.showLayout = function (id, show)
{
    var i, j;
    
    if (Cary.tools.isNothing (show))
        show = true;
    
    for (i = 0; i < this.layouts.length; ++ i)
    {
        var layout =  this.layouts [i];
        
        if (layout.id === id)
        {
            layout.show (show);

            if (layout.type !== Cary.paneTypes.FULL_SCREEN)
            {
                for (j = 0; j < this.layouts.length; ++ j)
                {
                    if (i !== j)
                    {
                        if (this.layouts [j].type === Cary.paneTypes.CENTER)
                        {
                            switch (this.layouts [i].type)
                            {
                                case Cary.paneTypes.LEFT_ANCHORDER:
                                    if (show)
                                        this.layouts [j].adjust ();
                                    else
                                        this.layouts [j].expandLeft ();

                                    break;

                                case Cary.paneTypes.RIGHT_ANCHORDER:
                                    if (show)
                                        this.layouts [j].adjust ();
                                    else
                                        this.layouts [j].expandRight ();

                                    break;
                            }

                            break;
                        }
                        else if (this.layouts [j].type === Cary.paneTypes.CENTER_LEFT)
                        {
                            if (this.layouts [i].type === Cary.paneTypes.RIGHT_ANCHORDER)
                            {
                                if (show)
                                    this.layouts [j].adjust ();
                                else
                                    this.layouts [j].expandRight ();
                            }

                            break;
                        }
                        else if (this.layouts [j].type === Cary.paneTypes.CENTER_RIGHT)
                        {
                            if (this.layouts [i].type === Cary.paneTypes.LEFT_ANCHORDER)
                            {
                                if (show)
                                    this.layouts [j].adjust ();
                                else
                                    this.layouts [j].expandLeft ();
                            }

                            break;
                        }
                    }
                }
            }
            
            break;
        }
    }
};

Cary.Layout = function (layoutDef)
{
    this.type       = layoutDef.type;
    this.width      = layoutDef.width;
    this.left       = layoutDef.left;
    this.right      = layoutDef.right;
    this.id         = layoutDef.id;
    this.hideable   = layoutDef.hideable;
    this.div        = document.createElement ('div');
    this.div.id     = layoutDef.id;
    this.moreStyles = 'moreStyles'in layoutDef ? layoutDef.moreStyles : {};
    
    document.getElementsByTagName ('body')[0].appendChild (this.div);
};

Cary.Layout.prototype.adjust = function ()
{
    var style = { position: 'absolute', top: 0, bottom: 1, padding: 0, margins: 0, olverflow: 'hidden' };
    
    switch (this.type)
    {
        case Cary.paneTypes.FULL_SCREEN:
        case Cary.paneTypes.SINGLE:
            style.left  = 0;
            style.right = 1;
            
            break;
            
        case Cary.paneTypes.CENTER:
            style.left  = this.width >> 1;
            style.right = style.left;
            
            break;
            
        case Cary.paneTypes.CENTER_LEFT:
            style.left  = 0;
            style.right = this.right;
            
            break;
            
        case Cary.paneTypes.CENTER_RIGHT:
            style.left  = this.left;
            style.right = 0;
            
            break;
            
        case Cary.paneTypes.LEFT_ANCHORDER:
            style.left  = 0;
            style.width = this.width;
            
            break;
            
        case Cary.paneTypes.RIGHT_ANCHORED:
            style.right = 3;
            style.width = this.width;
            
            break;
    }
    
    for (var styleName in style)
    {
        if (typeof (style [styleName]) === 'number')
            this.div.style [styleName] = Cary.tools.int2pix (style [styleName]);
        else
            this.div.style [styleName] = style [styleName];
    }
    
    this.div.style.zIndex = this.type === Cary.paneTypes.FULL_SCREEN ? 0 : 1;
    
    for (var styleName in this.moreStyles)
        this.div.style [styleName] = this.moreStyles [styleName];
};

Cary.Layout.prototype.expandLeft = function ()
{
    if (this.type === Cary.paneTypes.CENTER || this.type === Cary.paneTypes.CENTER_RIGHT)
        this.div.style.left = '0px';
};

Cary.Layout.prototype.expandRight = function ()
{
    if (this.type === Cary.paneTypes.CENTER || this.type === Cary.paneTypes.CENTER_LEFT)
        this.div.style.right = '0px';
};

Cary.Layout.prototype.show = function (show)
{
    if (Cary.tools.isNothing (show))
        show = true;
    
    this.div.style.display = show ? null : 'none';
};

Cary.paneTypes = { SINGLE: 1, CENTER: 2, LEFT_ANCHORDER: 3, RIGHT_ANCHORED: 4, CENTER_LEFT: 5, CENTER_RIGHT: 6, FULL_SCREEN: 7 };
