Cary.ui.TabControl = function (desc, styles)
{
    this.startupItems = 'items' in desc ? desc.items : [];
    this.items        = [];

    if (!('className' in desc))
        desc.className = 'tabctrl';
    
    Cary.ui.Control.apply (this, arguments);
};

Cary.ui.TabControl.prototype = Object.create (Cary.ui.Control.prototype);

Cary.ui.TabControl.prototype.addItem = function (itemDesc)
{
    var instance = this;
    var itemDiv  = document.createElement ('div');

    this.htmlObject.appendChild (itemDiv);

    itemDiv.innerText = itemDesc.text;
    itemDiv.className = 'tabItem_Unselected';
    itemDiv.onclick   = onClickItem;

    itemDesc.itemDiv = itemDiv;

    this.items.push (itemDesc);

    function onClickItem (event)
    {
        instance.items.forEach (function (itemDesc)
                                {
                                    if (itemDesc.itemDiv === event.target)
                                    {
                                        itemDesc.itemDiv.className = 'tabItem_Selected';

                                        if ('onSelected' in itemDesc)
                                            itemDesc.onSelected ();
                                    }
                                    else
                                    {
                                        itemDesc.itemDiv.className = 'tabItem_Unselected';
                                    }
                                });
    }
};

Cary.ui.TabControl.prototype.selectItem = function (index)
{
    for (var i = 0; i < this.items.length; ++ i)
    {
        var itemDesc = this.items [i];
        
        if (i === index)
        {
            itemDesc.itemDiv.className = 'tabItem_Selected';

            if ('onSelected' in itemDesc)
                itemDesc.onSelected ();
        }
        else
        {
            itemDesc.itemDiv.className = 'tabItem_Unselected';
        }
    }
};

Cary.ui.TabControl.prototype.initialize = function ()
{
    var instance = this;
    
    this.htmlObject = document.createElement ('div');

    this.startupItems.forEach (function (itemDesc) { instance.addItem (itemDesc); });
    
    if (this.items.length > 0)
        this.selectItem (0);
    
    Cary.ui.Control.prototype.initialize.apply (this, arguments);
};
