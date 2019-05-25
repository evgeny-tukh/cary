Cary.WndFactory = function ()
{
    var instance = this;

    this.manifest = null;

    Cary.tools.sendRequest ({ method: Cary.tools.methods.get, content: Cary.tools.contentTypes.xml, resType: Cary.tools.resTypes.xml, url: 'manifest.xml', onLoad: onLoaded });

    function onLoaded (manifestText)
    {
        var parser    = new DOMParser;
        var xml       = parser.parseFromString (manifestText, 'text/xml');
        var manifests = xml.getElementsByTagName ('manifest');

        if (manifests.length > 0)
        {
            var manifest = manifests [0];
            var wndCol   = manifest.getElementsByTagName ('window');
            var panCol   = manifest.getElementsByTagName ('panel');

            instance.manifest = { windows: {}, panels: {} };

            for (var i = 0; i < wndCol.length; ++ i)
            {
                var wndDesc = Cary.WndFactory.getWindowDesc (wndCol [i]);

                instance.manifest.windows [wndDesc.id] = wndDesc;
            }

            for (var i = 0; i < panCol.length; ++ i)
            {
                var xmlPanDesc = panCol [i];

                if (xmlPanDesc.parentElement.parentElement === manifest)
                {
                    var panDesc = Cary.WndFactory.getWindowDesc (xmlPanDesc);

                    instance.manifest.panels [panDesc.id] = panDesc;
                }
            }
        }
    }
};

Cary.WndFactory.stringProps  = ['title'];
Cary.WndFactory.intProps     = ['x', 'y', 'width', 'height', 'anchor', 'padding', 'margin'];
Cary.WndFactory.boolProps    = ['visible'];
Cary.WndFactory.ctlTypes     = { LabeledBox: 0, EditBox: 1, ListBox: 2, CheckBox: 3, ListView: 4, Button: 5, PopUpButton: 6, ControlBlock: 7, SVG: 8, Unknown: -1 };
Cary.WndFactory.ctlTypeNames = ['labelbox', 'editbox', 'listbox', 'checkbox', 'listview', 'button', 'popupbutton', 'ctlblock', 'svg'];
Cary.WndFactory.actions      = {};

Cary.WndFactory.prototype.registerGlobalAction = function (name, handler)
{
    Cary.WndFactory.actions [name] = handler;
};

Cary.WndFactory.invokeGlobalAction = function (obj, name, param, evtObj)
{
    var htmlObject = obj.htmlObject;

    if (!htmlObject)
        htmlObject = obj.client;

    if (!htmlObject)
        htmlObject = obj.wnd;

    if (name in Cary.WndFactory.actions && (!evtObj.target || htmlObject === evtObj.target || obj === evtObj.target))
    {
        var handler = Cary.WndFactory.actions [name];

        if (typeof (handler) === 'function')
            handler (obj, param, evtObj);
    }
};

Cary.WndFactory.getWindowDesc = function (xmlWndDesc)
{
    var wndDesc = { props: {}, controls: [], panels: [] };
    var propsCol = xmlWndDesc.getElementsByTagName ('properties');
    var panesCol = xmlWndDesc.getElementsByTagName ('panels');
    var props    = propsCol.length > 0 ? propsCol [0].getElementsByTagName ('property') : [];
    var ctrlCol  = xmlWndDesc.getElementsByTagName ('controls');
    var controls = ctrlCol.length > 0 ? ctrlCol [0].children : [];
    var panels   = panesCol.length > 0 ? panesCol [0].children : [];
    var id       = xmlWndDesc.attributes ['id'] ? xmlWndDesc.attributes ['id'].nodeValue : null;

    wndDesc.id       = id;
    wndDesc.paneMode = xmlWndDesc.tagName === 'panel';
    wndDesc.events   = Cary.WndFactory.getEvents (xmlWndDesc);

    for (var j = 0; j < props.length; ++ j)
    {
        var prop     = props [j];
        var name     = prop.attributes.name;
        var val      = prop.attributes.value;
        var type     = prop.attributes.type;
        var propName = name.nodeValue.toLowerCase ();
        var propVal  = val.nodeValue;

        if (type)
            type = type.nodeValue.toLowerCase ();

        if (type === 'string' || Cary.WndFactory.stringProps.indexOf (propName) >= 0)
            wndDesc.props [propName] = propVal;
        else if (type === 'number' || Cary.WndFactory.intProps.indexOf (propName) >= 0)
            wndDesc.props [propName] = parseInt (propVal);
        else if (type === 'bool' || Cary.WndFactory.boolProps.indexOf (propName) >= 0)
            wndDesc.props [propName] = Cary.WndFactory.getBooleanPropVal (propVal);
        else
            // Implicitly string
            wndDesc.props [propName] = propVal;
    }

    for (var j = 0; j < controls.length; ++ j)
    {
        var ctl = controls [j];

        if (ctl.parentElement.parentElement !== xmlWndDesc)
            // Process direct children only!
            continue;

        switch (ctl.tagName)
        {
            case 'labeledBox':
                wndDesc.controls.push ({ desc: Cary.WndFactory.getLabeledBoxDesc (ctl), children: Cary.WndFactory.getChildrenCtlDescArray (ctl) }); break;

            default:
                wndDesc.controls.push ({ desc: Cary.WndFactory.getControlDesc (ctl) });
        }
    }

    for (var j = 0; j < panels.length; ++ j)
        wndDesc.panels.push (Cary.WndFactory.getWindowDesc (panels [j]));

    return wndDesc;
};

Cary.WndFactory.getCtlTypeByName = function (ctlTypeName)
{
    return Cary.WndFactory.ctlTypeNames.indexOf (ctlTypeName.toLowerCase ());
};

Cary.WndFactory.prototype.wait = function (onLoaded)
{
    var instance = this;

    Cary.tools.waitForCondition (function () { return instance.manifest != null; }, onLoaded, 200);
};

Cary.WndFactory.getChildrenCtlDescArray = function (ctlXmlDesc)
{
    var children  = ctlXmlDesc.getElementsByTagName ('controls');
    var descArray = [];

    if (children.length > 0)
    {
        children = children [0].children;

        for (var i = 0; i < children.length; ++ i)
        {
            var childXmlDesc = children [i];
            var ctlDesc      = { type: Cary.WndFactory.getCtlTypeByName (childXmlDesc.tagName), 
                                 props: Cary.WndFactory.getProperties (childXmlDesc),
                                 attrs: Cary.WndFactory.getAttributes (childXmlDesc),
                                 items: Cary.WndFactory.getItems (childXmlDesc),
                                 menu: Cary.WndFactory.getMenu (childXmlDesc),
                                 columns: Cary.WndFactory.getColumns (childXmlDesc) };

            descArray.push (ctlDesc);
        }
    }

    return descArray;
}

Cary.WndFactory.createControlFromDesc = function (options)
{
    var constructor;
    var parent  = options.parent;
    var desc    = options.desc;
    var items   = desc.items ? desc.items : [];
    var menu    = desc.menu ? desc.menu : [];
    var columns = desc.columns ? desc.columns : [];
    var props   = 'props' in desc ? desc.props : {};
    var attrs   = 'attrs' in desc ? desc.attrs : {};
    var menu    = 'menu' in desc ? desc.menu : [];
    var ctlDesc = {};
    //var styles  = Cary.WndFactory.getDefStyles (desc.type);
if(props.id==="gm")    
{
    var iii=0;
    ++iii;
}
    ctlDesc.parent  = parent;
    ctlDesc.visible = true;

    for (var key in props)
        ctlDesc [key] = props [key];

    styles = Cary.WndFactory.getStyles (ctlDesc, Cary.WndFactory.getDefStyles (desc.type));

    if (desc.type === Cary.WndFactory.ctlTypes.ListBox || desc.type === Cary.WndFactory.ctlTypes.ListView)
        ctlDesc.items = items;

    if (desc.type === Cary.WndFactory.ctlTypes.ListView)
        ctlDesc.columns = columns;

    if (desc.type === Cary.WndFactory.ctlTypes.PopUpButton)
        ctlDesc.popupMenu = menu;

    if (desc.type === Cary.WndFactory.ctlTypes.EditBox)
    {
        if ('width' in styles && 'paddingLeft' in styles && 'paddingRight' in styles)
        {
            var width    = getVal (styles.width),
                paddingL = getVal (styles.paddingLeft),
                paddingR = getVal (styles.paddingRight);

            styles.width = width - paddingL - paddingR;

            function getVal (value)
            {
                var result;

                if (typeof (value) === 'number')
                    result = value;
                else if (typeof (value) === 'string' && value.indexOf ('px') > 0)
                    result = parseInt (value);
                else
                    result = null;

                return result;
            }
        }
    }

    switch (desc.type)
    {
        case Cary.WndFactory.ctlTypes.EditBox:
            constructor = Cary.ui.EditBox; break;

        case Cary.WndFactory.ctlTypes.ListBox:
            constructor = Cary.ui.ListBox; break;

        case Cary.WndFactory.ctlTypes.CheckBox:
            constructor = Cary.ui.CheckBox; break;

        case Cary.WndFactory.ctlTypes.Button:
            constructor = Cary.ui.Button; break;

        case Cary.WndFactory.ctlTypes.PopUpButton:
            constructor = Cary.ui.PopUpButton; break;

        case Cary.WndFactory.ctlTypes.ListView:
            constructor = Cary.ui.ListView; break;

        case Cary.WndFactory.ctlTypes.ControlBlock:
            constructor = Cary.ui.ControlBlock; break;

        case Cary.WndFactory.ctlTypes.SVG:
            constructor = Cary.ui.SVG; break;

        default:
            constructor = null;
    }

    if (constructor)
        ctl = new constructor (ctlDesc, styles);
    else
        ctl = null;

    if (ctl)
    {
        if (desc.type === Cary.WndFactory.ctlTypes.ListView)
        {
            desc.items.forEach (function (item)
            {
                var colText = [];

                item.subitems.forEach (function (subItem) { colText.push (subItem); });
                
                ctl.addItem (colText, item.data);
            });
        }

        for (var attrName in attrs)
            ctl.htmlObject [attrName] = attrs [attrName];

        if ('events' in options.desc)
            options.desc.events.forEach (function (event)
            {
                var initiator = ctl;

                ctl.htmlObject.addEventListener (event.type, invoke);

                function invoke (evtObj)
                {
                    Cary.WndFactory.invokeGlobalAction (initiator, event.action, event.param, evtObj);
                }
            });
    }

    return ctl;
}

Cary.WndFactory.prototype.createWindowFromDesc = function (wndDesc)
{
    var instance = this;
    var descParm = {};
    var wnd;
    
    for (var key in wndDesc)
        descParm [key] = wndDesc [key];

    descParm.position = { absolute: true, left: wndDesc.props.x, top: wndDesc.props.y, width: wndDesc.props.width, height: wndDesc.props.height };
    descParm.title    = wndDesc.props.title;
    descParm.userInit = userInit;
    descParm.visible  = wndDesc.props.visible;

    wnd = new Cary.ui.Window (descParm);

    function userInit (wndObject)
    {
        var wnd        = wndObject;
        var anchor     = wndObject.desc.props.anchor;
        var htmlObject = wnd.client ? wnd.client : wnd.wnd;

        if ('events' in wndDesc)
        {
            var htmlObject = wnd.client ? wnd.client : wnd.wnd;

            wndDesc.events.forEach (function (event)
            {
                htmlObject.addEventListener (event.type,
                                             function (evtObj)
                                             {
                                                 Cary.WndFactory.invokeGlobalAction (htmlObject, event.action, event.param, evtObj);
                                             });
            });
        }

        for (var key in wndObject.desc.props)
        {
            if (key.substr (0, 6) === 'style:')
                htmlObject.style [key.substr (6)] = wndObject.desc.props [key];
        };

        if (anchor && anchor !== Cary.ui.anchor.NONE)
        {
            wnd.wnd.style.position = 'absolute';

            switch (anchor)
            {
                case Cary.ui.anchor.LEFT:
                    wnd.wnd.style.left   = '0px';
                    wnd.wnd.style.top    = '0px';
                    wnd.wnd.style.bottom = '0px';

                    break;

                case Cary.ui.anchor.RIGHT:
                    wnd.wnd.style.right  = '0px';
                    wnd.wnd.style.top    = '0px';
                    wnd.wnd.style.bottom = '0px';

                    break;
    
                case Cary.ui.anchor.TOP:
                    wnd.wnd.style.left  = '0px';
                    wnd.wnd.style.top   = '0px';
                    wnd.wnd.style.right = '0px';

                    break;

                case Cary.ui.anchor.BOTTOM:
                    wnd.wnd.style.left   = '0px';
                    wnd.wnd.style.right  = '0px';
                    wnd.wnd.style.bottom = '0px';

                    break;

                case (Cary.ui.anchor.LEFT | Cary.ui.anchor.TOP):
                    wnd.wnd.style.left = '0px';
                    wnd.wnd.style.top  = '0px';

                    break;

                case (Cary.ui.anchor.RIGHT | Cary.ui.anchor.TOP):
                    wnd.wnd.style.right = '0px';
                    wnd.wnd.style.top   = '0px';

                    break;

                case (Cary.ui.anchor.LEFT | Cary.ui.anchor.BOTTOM):
                    wnd.wnd.style.left   = '0px';
                    wnd.wnd.style.bottom = '0px';

                    break;

                case (Cary.ui.anchor.RIGHT | Cary.ui.anchor.BOTTOM):
                    wnd.wnd.style.right  = '0px';
                    wnd.wnd.style.bottom = '0px';

                    break;        
            }
        }

        wndDesc.panels.forEach (function (panScript)
        {
            var desc = panScript;

            desc.paneMode = true;
            desc.parent   = wnd.client ? wnd.client : wnd.wnd;

            instance.createWindowFromDesc (desc);
        });

        wndDesc.controls.forEach (function (ctlScript)
        {
            var ctl, child;
            var ctlDesc     = ctlScript.desc;
            var ctlChildren = 'children' in ctlScript ? ctlScript.children : [];
            var ctlItems    = 'items' in ctlScript ? ctlScript.items : [];
            var ctlCols     = 'columns' in ctlScript ? ctlScript.cols : [];
            var styles      = Cary.WndFactory.getStyles (ctlDesc.props, Cary.WndFactory.getDefStyles (ctlDesc.type));
            var parent      = wndObject.client ? wndObject.client : wndObject.wnd;

            switch (ctlDesc.type)
            {
                case Cary.WndFactory.ctlTypes.LabeledBox:
                    ctl = new Cary.ui.ControlBlock ({ parent: parent, text: ctlDesc.props.label, visible: ctlDesc.props.visible }, styles);

                    for (var i = 0; i < ctlChildren.length; ++ i)
                    {
                        child = ctlChildren.length > 0 ? Cary.WndFactory.createControlFromDesc ({ parent: ctl.htmlObject, desc: ctlChildren [i], items: ctlItems, columns: ctlCols }) : null;

                        if (child && child.htmlObject)
                        {
                            child.htmlObject.style.float = 'right';
                            child.htmlObject.style.right = '0px';
                        }
                    }

                    break;

                default:
                    ctl = Cary.WndFactory.createControlFromDesc ({ parent: parent, desc: ctlDesc, items: ctlItems, columns: ctlCols });
            }
        });
    }

    return wnd;
};

Cary.WndFactory.prototype.createWindow = function (wndID)
{
    return (wndID in this.manifest.windows) ? this.createWindowFromDesc (this.manifest.windows [wndID]) : null;
};

Cary.WndFactory.prototype.createPanel = function (panID)
{
    return (panID in this.manifest.panels) ? this.createWindowFromDesc (this.manifest.panels [panID]) : null;
};

Cary.WndFactory.getDefStyles = function (type, desiredWidth)
{
    var styles = { margin: 0, padding: '1%', borderStyle: 'none' };

    switch (type)
    {
        case Cary.WndFactory.ctlTypes.LabeledBox:
            styles.width       = desiredWidth ? desiredWidth : '98%';
            styles.left        = 0;
            styles.textAlign   = 'left';
            styles.padding     = 0;
            //styles.marginTop   = 10;
            styles.fontSize    = '12pt';
            styles.lineHeight  = 19;
            styles.paddingLeft = 5;

            break;

        case Cary.WndFactory.ctlTypes.CheckBox:
            styles.width         = 'fit-content';
            styles.height        = 'fit-content';
            styles.textAlign     = 'left';
            styles.marginLeft    = 0;
            styles.marginRight   = 0;
            styles.paddingTop    = 0;
            styles.paddingBottom = 0;
            styles.fontSize      = '12pt';

            break;

        case Cary.WndFactory.ctlTypes.PopUpButton:
            styles.width         = 90;
            styles.height        = 27;
            styles.textAlign     = 'left';
            styles.marginLeft    = 10;
            styles.marginRight   = 0;
            styles.paddingTop    = 0;
            styles.paddingBottom = 0;
            styles.fontSize      = '10pt';
            styles.lineHeight    = 8;

            break;

        case Cary.WndFactory.ctlTypes.Button:
            styles.width         = 'fit-content';
            styles.height        = 27;
            styles.textAlign     = 'center';
            styles.marginLeft    = 10;
            styles.marginRight   = 0;
            styles.paddingTop    = 0;
            styles.paddingBottom = 0;
            styles.fontSize      = '10pt';

            break;

        case Cary.WndFactory.ctlTypes.EditBox:
            //styles.marginLeft = -10;

        case Cary.WndFactory.ctlTypes.ListBox:
            styles.paddingLeft     = 5;
            styles.paddingRight    = 5;
            styles.paddingTop      = 2;
            styles.paddingBottom   = 2;
            styles.textAlign       = 'left';
            styles.fontSize        = '10pt';
            styles.backgroundColor = 'cyan';

            break;

        case Cary.WndFactory.ctlTypes.ListView:
            styles.padding         = 0;
            styles.textAlign       = 'left';
            styles.fontSize        = '10pt';
            styles.backgroundColor = 'white';
            styles.border          = 'solid 1px lightgray';

            break;
        }

    return styles;
};

Cary.WndFactory.getStyles = function (desc, defStyles)
{
    var styles = {};

    for (var key in defStyles)
        styles [key] = defStyles [key];

    for (var key in desc)
    {
        var val = desc [key];

        switch (key)
        {
            case 'x':
                styles.left = val; break;

            case 'y':
                styles.top = val; break;

            default:
                styles [key] = val;
        }
    }

    if ('left' in styles || 'right' in styles || 'top' in styles || 'bottom' in styles)
        styles.position = 'absolute';

    return styles;
};

Cary.WndFactory.getBooleanPropVal = function (value)
{
    var result;

    if (typeof (value) == 'number')
        result = value != 0;
    else if (typeof (value) == 'string')
        result = ['yes', 'true', 'on'].indexOf (value.toLowerCase ()) >= 0;
    else if (typeof (value) == 'undefined')
        result = false;
    else
        result = value !== null;

    return result;
};

Cary.WndFactory.getItems = function (element)
{
    var items    = [];
    var xmlProps = element.getElementsByTagName ('items') [0];
    var propsCol = xmlProps ? xmlProps.getElementsByTagName ('item') : [];

    for (var i = 0; i < propsCol.length; ++ i)
    {
        var prop = propsCol [i];

        var text     = 'text' in prop.attributes ? prop.attributes ['text'].nodeValue : '';
        var val      = 'data' in prop.attributes ? prop.attributes ['data'].nodeValue : null;
        var type     = 'type' in prop.attributes ? prop.attributes ['type'].nodeValue : 'string';
        var xmlSIs   =  prop.getElementsByTagName ('subitem');
        var subitems = [];

        if (!('text' in prop.attributes) && xmlSIs.length === 0)
            // Critical misformatting
            continue;

        for (var j = 0; j < xmlSIs.length; ++ j)
            subitems.push ('text' in xmlSIs [j].attributes ? xmlSIs [j].attributes ['text'].nodeValue : '');

        switch (type)
        {
            case 'string':
                // Keep val as is
                break;

            case 'number':
                val = parseInt (val); break;

            case 'float':
                val = parseFloat (val); break;

            case 'bool':
                val = Cary.WndFactory.getBooleanPropVal (val); break;

            default:
                val = null;
        }

        if (val !== null)
            items.push ({ text: text, data: val, subitems: subitems });
    }

    return items;
};

Cary.WndFactory.getMenu = function (element)
{
    var menu    = [];
    var xmlMenu = element.getElementsByTagName ('menu') [0];
    var itemCol = xmlMenu ? xmlMenu.getElementsByTagName ('item') : [];

    for (var i = 0; i < itemCol.length; ++ i)
    {
        var item = itemCol [i];

        var text = 'text' in item.attributes ? item.attributes ['text'].nodeValue : null;
        var id   = 'id' in item.attributes ? item.attributes ['id'].nodeValue : null;

        if (text)
            menu.push ({ text: text, id: id, action: function (param) {}, param: id });
    }

    return menu;
};

Cary.WndFactory.getEvents = function (element)
{
    var events    = [];
    var xmlEvents = element.getElementsByTagName ('events') [0];
    var eventCol  = xmlEvents ? xmlEvents.getElementsByTagName ('event') : [];

    for (var i = 0; i < eventCol.length; ++ i)
    {
        if (eventCol [i].parentElement.parentElement === element)
        {
            var event = eventCol [i];

            var type   = 'type' in event.attributes ? event.attributes ['type'].nodeValue : null;
            var action = 'action' in event.attributes ? event.attributes ['action'].nodeValue : null;
            var param  = 'param' in event.attributes ? event.attributes ['param'].nodeValue : null;

            if (type && action)
                events.push ({ type: type, param: param, action: action });
        }
    }

    return events;
};

Cary.WndFactory.getColumns = function (element)
{
    var columns = [];
    var xmlCols = element.getElementsByTagName ('columns') [0];
    var clmnCol = xmlCols ? xmlCols.getElementsByTagName ('column') : [];

    for (var i = 0; i < clmnCol.length; ++ i)
    {
        var column = clmnCol [i];

        if (!('title' in column.attributes))
            // Critical misformatting
            continue;

        var title = column.attributes ['title'].nodeValue;
        var width = 'width' in column.attributes ? parseInt (column.attributes ['width'].nodeValue) : 100;

        columns.push ({ title: title, width: width });
    }

    return columns;
};

Cary.WndFactory.getProperties = function (element)
{
    var props    = {};
    var xmlProps = element.getElementsByTagName ('properties') [0];
    var propsCol = xmlProps ? xmlProps.getElementsByTagName ('property') : [];

    for (var i = 0; i < propsCol.length; ++ i)
    {
        var prop = propsCol [i];
        var name = prop.attributes ['name'].nodeValue;
        var val  = prop.attributes ['value'].nodeValue;
        var type = 'type' in prop.attributes ? prop.attributes ['type'].nodeValue : 'string';

        switch (type)
        {
            case 'string':
                props [name] = val; break;

            case 'number':
                props [name] = parseInt (val); break;

            case 'float':
                props [name] = parseFloat (val); break;

            case 'bool':
                props [name] = Cary.WndFactory.getBooleanPropVal (val); break;
        }
    }

    return props;
};

Cary.WndFactory.getAttributes = function (element)
{
    var attrs    = {};
    var xmlAttrs = element.getElementsByTagName ('attributes') [0];
    var attrsCol = xmlAttrs ? xmlAttrs.getElementsByTagName ('attribute') : [];

    for (var i = 0; i < attrsCol.length; ++ i)
    {
        var attr = attrsCol [i];
        var name = attr.attributes ['name'].nodeValue;
        var val  = attr.attributes ['value'].nodeValue;

        attrs [name] = val;
    }

    return attrs;
};

Cary.WndFactory.getLabeledBoxDesc = function (xmlDesc)
{
    var ctl   = {};
    var props = Cary.WndFactory.getProperties (xmlDesc);
    var attrs = Cary.WndFactory.getAttributes (xmlDesc);
    var items = Cary.WndFactory.getItems (xmlDesc);

    return { type: Cary.WndFactory.ctlTypes.LabeledBox, props: props, attrs: attrs, items: items, ctl: ctl };
};

Cary.WndFactory.getControlDesc = function (xmlDesc)
{
    var ctl    = {};
    var props  = Cary.WndFactory.getProperties (xmlDesc);
    var attrs  = Cary.WndFactory.getAttributes (xmlDesc);
    var items  = Cary.WndFactory.getItems (xmlDesc);
    var cols   = Cary.WndFactory.getColumns (xmlDesc);
    var menu   = Cary.WndFactory.getMenu (xmlDesc);
    var events = Cary.WndFactory.getEvents (xmlDesc);

    return { type: Cary.WndFactory.getCtlTypeByName (xmlDesc.tagName), props: props, attrs: attrs, items: items, ctl: ctl, columns: cols, menu: menu, events: events };
};
