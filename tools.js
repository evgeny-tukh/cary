Cary.tools.DAY_INTERVAL = 24 * 3600000;

Number.prototype.inRange = function (val1, val2)
{
    return this >= val1 && this <= val2 || this >= val2 && this <= val1;
};

Cary.tools.isNothing = function (value)
{
    return typeof  (value) === 'undefined' || value === null;
};

Cary.tools.int2pix = function (value)
{
    return value === null ? null : value.toFixed (0) + 'px';
};

Cary.tools.int2perc = function (value)
{
    return value === null ? null : value.toFixed (0) + '%';
};

Cary.tools.round = function (value, precision)
{
    return parseFloat (value.toFixed (precision));
};

Cary.tools.formatNumberWithLZ = function (value, maxDigits)
{
    var stringValue = value.toString ();
    
    while (stringValue.length < maxDigits)
        stringValue = '0' + stringValue;
    
    return stringValue;
};

Cary.tools.formatNumberWithThousandSep = function (value)
{
    var result;
    
    if (Math.abs (value) >= 1000)
    {
        var thousands = Math.trunc (value / 1000);
        var units     = Math.abs (value) - Math.abs (thousands) * 1000;
        
        result = thousands.toString () + ' ' + units.toFixed (0);
    }
    else
    {
        result = value.toFixed (0);
    }
    
    return result;
};

Cary.tools.formatFloatWithLZ = function (value, maxDigits, digitsAfterPoint)
{
    var stringValue = value.toFixed (digitsAfterPoint);
    
    while (stringValue.length < maxDigits)
        stringValue = '0' + stringValue;
    
    return stringValue;
};

Cary.tools.formatTimeInterval = function (interval, showSeconds)
{
    var days, hours, minutes, seconds, result;
    
    if (Cary.tools.isNothing (showSeconds))
        showSeconds = false;
    
    days     = Math.floor (interval / Cary.tools.DAY_INTERVAL);
    interval = interval % Cary.tools.DAY_INTERVAL;
    hours    = Math.floor (interval / 3600000);
    interval = interval % 3600000;
    minutes  = Math.floor (interval / 60000);
    seconds  = interval % 60000;
    
    if (days > 0)
        days = days.toString () + 'd ';
    else
        days = '';
    
    if (hours > 0)
        hours = hours.toString () + 'h ';
    else
        hours = '';
    
    if (minutes > 0)
        minutes = minutes.toString () + 'm ';
    else
        minutes = '';
    
    result = days + hours + minutes;
    
    if (showSeconds)
        result += seconds + 's';
    
    return result;
};

Cary.tools.formatLat = function (lat, degChar)
{
    var absLat   = Math.abs (lat);
    var latDeg   = Math.floor (absLat);
    var minLat   = (absLat - latDeg) * 60.0;
    var latHS    = lat >= 0 ? 'N' : 'S';
    
    if (Cary.tools.isNothing (degChar))
        degChar = ' ';
    
    return Cary.tools.formatNumberWithLZ (latDeg, 2) + degChar + Cary.tools.formatFloatWithLZ (minLat, 6, 3) + ' ' + latHS;
};

Cary.tools.formatLon = function (lon, degChar)
{
    var absLon   = Math.abs (lon);
    var lonDeg   = Math.floor (absLon);
    var minLon   = (absLon - lonDeg) * 60.0;
    var lonHS    = lon >= 0 ? 'E' : 'W';
    
    if (Cary.tools.isNothing (degChar))
        degChar = ' ';
    
    return Cary.tools.formatNumberWithLZ (lonDeg, 3) + degChar + Cary.tools.formatFloatWithLZ (minLon, 6, 3) + ' ' + lonHS;
};

Cary.tools.formatTimeZone = function (offset)
{
    var absValue     = Math.abs (offset);
    var integralPart = Math.floor (absValue);
    var fraction     = absValue - integralPart;

    return 'UTC ' + (offset > 0 ? '+' : '-') + absValue.toFixed (0) + ':' + Cary.tools.formatNumberWithLZ (fraction * 60, 2);
};

Cary.tools.formatTimestampLocal = function (timestamp, showSeconds)
{
    // Timestamp arg case
    if (typeof (dateTime) === 'number')
        dateTime = new Date (dateTime);

    return Cary.tools.formatDateTimeLocal (new Date (timestamp), showSeconds);
};

Cary.tools.formatTimestampUTC = function (timestamp, showSeconds)
{
    // Timestamp arg case
    if (typeof (dateTime) === 'number')
        dateTime = new Date (dateTime);

    return Cary.tools.formatDateTimeUTC (new Date (timestamp), showSeconds);
};

Cary.tools.formatDateTimeUTC = function (dateTime, showSeconds)
{
    var result;

    // Timestamp arg case
    if (typeof (dateTime) === 'number')
        dateTime = new Date (dateTime);

    if (isUndefinedOrNull (showSeconds))
        showSeconds = false;

    if (!dateTime)
    {
        result = Cary.tools.formatDateTimeUTC (new Date (), showSeconds);
    }
    else
    {
       
        result = dateTime.getUTCFullYear ().toString () + '-' + Cary.tools.formatNumberWithLZ (dateTime.getUTCMonth () + 1, 2) + '-' +
                 Cary.tools.formatNumberWithLZ (dateTime.getUTCDate (), 2) + ' ' + Cary.tools.formatNumberWithLZ (dateTime.getUTCHours (), 2) + ':' +
                 Cary.tools.formatNumberWithLZ (dateTime.getUTCMinutes (), 2);

        if (showSeconds)
            result += (':' + Cary.tools.formatNumberWithLZ (dateTime.getUTCSeconds (), 2));
    }

    return result+' UTC';
};

Cary.tools.formatDateTimeLocal = function (dateTime, showSeconds)
{
    var result;

    // Timestamp arg case
    if (typeof (dateTime) === 'number')
        dateTime = new Date (dateTime);

    if (!showSeconds)
        showSeconds = false;

    if (!dateTime)
    {
        result = Cary.tools.formatDateTimeLocal (new Date (), showSeconds);
    }
    else
    {
        result = dateTime.getFullYear ().toString () + '-' + Cary.tools.formatNumberWithLZ (dateTime.getMonth () + 1, 2) + '-' +
                 Cary.tools.formatNumberWithLZ (dateTime.getDate (), 2) + ' ' + Cary.tools.formatNumberWithLZ (dateTime.getHours (), 2) + ':' +
                 Cary.tools.formatNumberWithLZ (dateTime.getMinutes (), 2);

        if (showSeconds)
            result += (':' + Cary.tools.formatNumberWithLZ (dateTime.getSeconds (), 2));
    }

    return result+' LT';
};

Cary.tools.formatDateLocal = function (dateTime, separator)
{
    // Timestamp arg case
    if (typeof (dateTime) === 'number')
        dateTime = new Date (dateTime);

    if (!separator)
        separator = '-';

    return dateTime.getFullYear ().toString () + separator + Cary.tools.formatNumberWithLZ (dateTime.getMonth () + 1, 2) + separator +
           Cary.tools.formatNumberWithLZ (dateTime.getDate (), 2);
};

Cary.tools.formatTimeLocal = function (dateTime)
{
    // Timestamp arg case
    if (typeof (dateTime) === 'number')
        dateTime = new Date (dateTime);

    return Cary.tools.formatNumberWithLZ (dateTime.getHours (), 2) + ':' + Cary.tools.formatNumberWithLZ (dateTime.getMinutes (), 2) + ':' +
           Cary.tools.formatNumberWithLZ (dateTime.getSeconds (), 2) + '.' + Cary.tools.formatNumberWithLZ (dateTime.getMilliseconds (), 3);
};

Cary.tools.formatDurationHours = function (duration)
{
    var result;

    if (!duration)
    {
        // Null arg case
        result = null;
    }
    else if (typeof (duration) === 'Object')
    {
        // Object arg case - recursive call for Date, null return otherwise
        if ('getTime' in duration)
            result = Cary.tools.formatDurationHours (duration.getTime () / 3600000);
        else
            result = null;
    }
    else if (typeof (duration) !== 'number')
    {
        // Non-numeric arg case, null return
        result = null;
    }
    else if (duration < 24)
    {
        // Less than one day, just nnh string
        result = duration.toFixed (0) + 'h';
    }
    else
    {
        // Long duration, return in form nnd mmh
        var days  = Math.floor (duration / 24);
        var hours = Math.round (duration - days * 24);

        result = days.toFixed (0) + 'd' + hours.toFixed (0) + 'h';
    }

    return result;
};

Cary.tools.formatHourLocal = function (dateTime)
{
    if (!dateTime)
        return '';

    // Timestamp arg case
    if (typeof (dateTime) === 'number')
        dateTime = new Date (dateTime);

    return Cary.tools.formatNumberWithLZ (dateTime.getHours (), 2);
};

Cary.tools.formatHourMinLocal = function (dateTime, separator)
{
    if (!dateTime)
        return '';

    // Timestamp arg case
    if (typeof (dateTime) === 'number')
        dateTime = new Date (dateTime);

    if (!separator)
        separator = 'h';

    return Cary.tools.formatNumberWithLZ (dateTime.getHours (), 2) + separator + Cary.tools.formatNumberWithLZ (dateTime.getMinutes (), 2);
};

Cary.tools.formatDateLocal = function (dateTime, separator)
{
    if (!dateTime)
        return '';

    if (!separator)
        separator = '-';

    // Timestamp arg case
    if (typeof (dateTime) === 'number')
        dateTime = new Date (dateTime);

    return dateTime.getFullYear ().toString () + separator + Cary.tools.formatNumberWithLZ (dateTime.getMonth () + 1, 2) + separator +
           Cary.tools.formatNumberWithLZ (dateTime.getDate (), 2);
};

Cary.tools.formatDateUTC = function (dateTime, separator)
{
    if (!dateTime)
        return '';

    if (!separator)
        separator = '-';

    // Timestamp arg case
    if (typeof (dateTime) === 'number')
        dateTime = new Date (dateTime);

    return dateTime.getUTCFullYear ().toString () + separator + Cary.tools.formatNumberWithLZ (dateTime.getUTCMonth () + 1, 2) + separator +
           Cary.tools.formatNumberWithLZ (dateTime.getUTCDate (), 2);
};

Cary.tools.formatTimeUTC = function (dateTime)
{
    // Timestamp arg case
    if (typeof (dateTime) === 'number')
        dateTime = new Date (dateTime);

    return Cary.tools.formatNumberWithLZ (dateTime.getUTCHours (), 2) + ':' + Cary.tools.formatNumberWithLZ (dateTime.getUTCMinutes (), 2) + ':' +
           Cary.tools.formatNumberWithLZ (dateTime.getUTCSeconds (), 2) + '.' + Cary.tools.formatNumberWithLZ (dateTime.getUTCMilliseconds (), 3);
};

Cary.tools.formatHourUTC = function (dateTime)
{
    // Timestamp arg case
    if (typeof (dateTime) === 'number')
        dateTime = new Date (dateTime);

    return Cary.tools.formatNumberWithLZ (dateTime.getUTCHours (), 2);
};

Cary.tools.formatHourMinUTC = function (dateTime, separator)
{
    // Timestamp arg case
    if (typeof (dateTime) === 'number')
        dateTime = new Date (dateTime);

    if (!separator)
        separator = 'h';

    return Cary.tools.formatNumberWithLZ (dateTime.getUTCHours (), 2) + separator + Cary.tools.formatNumberWithLZ (dateTime.getUTCMinutes (), 2);
};

Cary.tools.formatHourLocal = function (dateTime)
{
    if (!dateTime)
        return '';

    // Timestamp arg case
    if (typeof (dateTime) === 'number')
        dateTime = new Date (dateTime);

    return Cary.tools.formatNumberWithLZ (dateTime.getHours (), 2);
};

Cary.tools.createCssClass = function (className, styles)
{
    var head         = document.getElementsByTagName ('head') [0];
    var styleElement = document.createElement ('style');
    var rules;
    var styleLines = '';
    
    for (var key in styles)
        styleLines += key + ': ' + styles [key] + ';';
    
    
    rules = document.createTextNode ('.' + className + '{' + styleLines + '}');
    
    styleElement.type = 'text/css';
    
    if (styleElement.styleSheet)
        styleElement.styleSheet.cssText = rules.nodeValue;
    else
        styleElement.appendChild (rules);
    
    head.appendChild (styleElement);
    
    return styleElement;
};

Cary.tools.openLink = function (href, newTab)
{
    var link = document.createElement ('a');
    
    if (Cary.tools.isNothing (newTab))
        newTab = false;
    
    link.href = href;
    
    if (newTab)
        link.target = '_blank';

    document.body.appendChild (link);

    setTimeout (function ()
                {
                    var event = document.createEvent ("MouseEvents");

                    event.initMouseEvent ("click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);

                    link.dispatchEvent (event);

                    document.body.removeChild (link);
                }, 66);
};

Cary.tools.saveFile = function (content, fileName, encoding, escapeContent)
{
    var link = document.createElement ('a');
    var href;
    
    if (Cary.tools.isNothing (encoding))
        encoding = 'utf-8';
    
    if (Cary.tools.isNothing (escapeContent))
        escapeContent = true;
    
    href = "data:'text/plain;' charset="+ encoding + "," + (escapeContent ? escape (content) : content);
    
    link.href = href;

    // For MS Edge
    if (window.navigator.userAgent.indexOf ('Edge') >= 0)
    {
        var blob = new Blob ([content], { type: "application/json" });

        return window.navigator.msSaveBlob (blob, fileName);
    }
        
    // For IE v10
    if (window.MSBlobBuilder)
    {
        var blobBuilder = new MSBlobBuilder ();
        
        blobBuilder.append (content);
        
        return navigator.msSaveBlob (blobBuilder, fileName);
    }
    
    // FireFox v20, Chrome v19
    if ('download' in link)
    {
        link.setAttribute ("download", fileName);
        
        link.innerHTML = "downloading...";
        
        document.body.appendChild (link);
        
        setTimeout (function ()
                    {
                        var event = document.createEvent ("MouseEvents");
            
                        event.initMouseEvent ("click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
            
                        link.dispatchEvent (event);
            
                        document.body.removeChild (link);
                    }, 66);
                    
        return;
    }
    else
    {
        // Other browsers
        var frame = document.createElement ("iframe");
    
        document.body.appendChild (frame);
    
        frame.src = "data:text/plain" + (window.btoa ? ";base64" : "") + "," + (window.btoa ? window.btoa : escape) (content);
    
        setTimeout (function () { document.body.removeChild (frame); }, 333);
    }
};


Cary.tools.loadFile = function (file, onLoad)
{
    if (window.FileReader)
    {
        var reader = new FileReader ();

        reader.onload = function (event)
                        {
                            onLoad (event.target.result);
                        };

        reader.readAsText (file);
    }
};

Cary.tools.cancelMouseEvent = function (event)
{
    if (window.event.stopPropagation)
        window.event.stopPropagation ();

    if (window.event.preventDefault)
        window.event.preventDefault ();
};

Cary.tools.FileBroswer = function (parent, callbacks, mode)
{
    var instance = this;
    var fileName = null;
    
    if (Cary.tools.isNothing (mode))
        mode = Cary.tools.FileBroswer.readAsText;
    
    this.browser   = document.createElement ('input');
    this.reader    = new FileReader ();
    this.callbacks = Cary.tools.isNothing (callbacks) ? {} : callbacks;

    parent.appendChild (this.browser);
    
    this.browser.type          = 'file';
    this.browser.style.display = 'none';
                            
    this.execute = function ()
    {
        instance = this;
        
        this.cbCalled         = false;
        this.browser.value    = null;
        this.browser.onchange = onBrowserChange;
        this.reader.onload    = onReaderDone;
        this.reader.onloadend = onReaderDone;
        
        this.browser.click ();
    };
    
    function onReaderDone (event)
    {
        if (!instance.cbCalled)
        {
            instance.cbCalled = true;
            
            if ('onSelect' in instance.callbacks)
            {
                instance.callbacks.onSelect (event.target.result, fileName);
            }
        }
    }
    
    function onBrowserChange ()
    {
        var file = instance.browser.files [0];
        
        fileName = file.name;
        
        switch (mode)
        {
            case Cary.tools.FileBroswer.readAsText:
                instance.reader.readAsText (file); break;
                
            case Cary.tools.FileBroswer.readAsBuffer:
                instance.reader.readAsArrayBuffer (file); break;
                
            case Cary.tools.FileBroswer.readAsBinStr:
                instance.reader.readAsBinaryString (file); break;
                
            default:
                instance.reader.readAsDataURL (file);
        }
    }
};

Cary.tools.FileBroswer.readAsText   = 1;
Cary.tools.FileBroswer.readAsBuffer = 2;
Cary.tools.FileBroswer.readAsBinStr = 3;
Cary.tools.FileBroswer.readAsUrl    = 4;

Cary.tools.updateProperty = function (object, name, value)
{
    var result = {};
    
    for (var key in object)
        result [key] = object [key];
    
    result [name] = value;
    
    return result;
};

Cary.tools.unicode2char = function (source)
{
    var regExp = /\\u([\d\w]{4})/gi;
    var result = source.replace (regExp, function (match, group) { return String.fromCharCode (parseInt (group, 16)); } );

    return unescape (result);
};

Cary.tools.checkDecode = function (value)
{
    return (typeof (value) === 'string') ? Cary.tools.unicode2char (value) : value;
};

Cary.tools.insertChildAfter = function (parentObject, newObject, existingObject)
{
    var i;
    
    for (i = 0; i < parentObject.children.length; ++ i)
    {
        if (parentObject.children [i] === existingObject)
        {
            if (i < (parentObject.children.length - 1))
            {
                parentObject.insertBefore (newObject, parentObject.children [i+1]); return;
            }
        }
    }
    
    parentObject.appendChild (newObject);
};

Cary.tools.contentTypes = { json: 'application/json; charset=UTF-8', xml: 'text/xml', plainText: 'text/plain', formData: 'multipart/form-data', urlEncoded: 'application/x-www-form-urlencoded' };
Cary.tools.methods      = { get: 'GET', post: 'POST' };
Cary.tools.resTypes     = { plain: 1, json: 2, xml: 3 };

Cary.tools.sendRequest = function (options)
{
    var request = new XMLHttpRequest ();
    var method  = 'method' in options ? options.method : Cary.tools.methods.post;
    var content = 'content' in options ? options.content : Cary.tools.contentTypes.plainText;
    var resType = 'resType' in options ? options.resType : Cary.tools.resTypes.plain;
    var async   = 'async' in options ? options.async : true;

    request.open (method, options.url, async);
    request.setRequestHeader ('Content-Type', content);

    if ('onLoad' in options)
        request.onload = function ()
                         {
                             var result = (resType === Cary.tools.resTypes.json) ? JSON.parse (this.responseText) : this.responseText;
                                 
                             options.onLoad (result);
                         };

    if ('onError' in options)
        request.onerror = options.onError;

    if (method === Cary.tools.methods.get)
        request.send ();
    else if (content === Cary.tools.contentTypes.json)
        request.send (JSON.stringify (options.param));
    else
        request.send (options.param);
};

Cary.tools.time = function ()
{
    return new Date ().getTime ();
};

Cary.tools.pathRemoveFileName = function (path)
{
    var elements = path.split ('/');
    
    if (elements.length > 1)
        elements.splice (elements.length - 1);
    
    return elements.join ('/');
};

Cary.tools.copyObjectProp = function (dest, source, propName, defValue)
{
    if (Cary.tools.isNothing (defValue))
        defValue = null;
    
    if (propName in source)
        dest [propName] = source [propName];
    else
        dest [propName] = defValue;
};

function circlePath (centerX, centerY, radius)
{
    var diameter = radius + radius;
    
    return 'M ' + centerX + ' ' + centerY + ' m -' + radius + ', 0 a ' + radius + ',' + radius + ' 0 1,0 ' + diameter + ',0 a ' +
           radius + ',' + radius + ' 0 1,0 -' + diameter + ',0';
}

Cary.tools.simpleVesselIconPath = function ()
{
    //return circlePath (0, 0, 5) + ' M 0 -5 L 0 -20 L -5 -15 M 0 -20 L 5 -15';
    //return 'M 0 10 L 5 10 L 5 -5 L 0 -10 L -5 -5 L -5 10 L 0 10';
    return 'M 0 5 L 2 5 L 2 -2 L 0 -5 L -2 -2 L -2 5 L 0 5';
};

Cary.tools.vesselIconPath = function ()
{
    return 'M -4 -3 L -4 6 L -1 10 L 1 10 L 4 6 L 4 -3 L 0 -10 L -4 -3';
    //return circlePath (0, 0, 5) + ' M 0 -5 L 0 -20 L -5 -15 M 0 -20 L 5 -15';
};

Cary.tools.diamondIconPath = function ()
{
    return 'M -7 0 L 0 7 L 7 0 L 0 -7 L -7 0';
};

Cary.tools.smallDiamondIconPath = function ()
{
    return 'M -2 0 L 0 2 L 2 0 L 0 -2 L -2 0';
};

Cary.tools.getHtmlBody = function ()
{
    return document.getElementsByTagName ('body') [0];
};

Cary.tools.findChildByID = function (element, id, fullSearch)
{
    var i, count, result = null, children;
    
    if (!Cary.tools.isNothing (fullSearch))
        fullSearch = false;
    
    if (!Cary.tools.isNothing (element))
    {
        for (i = 0, children = element.children, count = children.length; i < count; ++ i)
        {
            if ('id' in children [i] && children [i].id === id)
            {
                result = children [i]; break;
            }
            
            if (fullSearch && 'children' in fullSearch)
            {
                var subResult = Cary.tools.findChildByID (children [i], id, fullSearch);
                
                if (subResult)
                {
                    result = subResult; break;
                }
            }
        }
    }
    
    return result;
};

Cary.tools.WaitForCondition = function (condition, onElapsed, interval, param)
{
    if (Cary.tools.isNothing (param))
        param = null;
    
    if (condition ())
    {
        if (!Cary.tools.isNothing (onElapsed))
            onElapsed (param);
    }
    else
    {
        var timer = setInterval (checkCondition, Cary.tools.isNothing (interval) ? 500 : interval);

        function checkCondition ()
        {
            if (condition ())
            {
                clearInterval (timer);

                if (!Cary.tools.isNothing (onElapsed))
                    onElapsed (param);
            }
        }
    }
};

Cary.tools.waitForCondition = Cary.tools.WaitForCondition;

Cary.tools.utf8ToAnsi = function (source)
{
    var result;
    var i;
    var byte0, byte1, byte2;

    for (i = 0, result = ''; i < source.length; )
    {
        byte0 = source.charCodeAt (i);

        if (byte0 < 128)
        {
            result += String.fromCharCode (byte0);
            
            i ++;
        }
        else if ((byte0 > 191) && (byte0 < 224))
        {
            byte1   = source.charCodeAt (i+1);
            result += String.fromCharCode(((byte0 & 31) << 6) | (byte1 & 63));
            
            i += 2;
        }
        else 
        {
            byte1   = source.charCodeAt (i+1);
            byte2   = source.charCodeAt (i+2);
            result += String.fromCharCode (((byte0 & 15) << 12) | ((byte1 & 63) << 6) | (byte2 & 63));
            
            i += 3;
        }
    }

    return result;
};

Cary.tools.toPhpTime = function (timestamp)
{
    return Math.ceil (timestamp / 1000);
};

Cary.tools.keys = function (hash)
{
    var keys = [];
    
    for (var key in hash)
        keys.push (key);
    
    return keys;
};

Cary.tools.getGermanDate = function (source)
{
    var components = source.split ('.');
    
    return new Date (parseInt (components [2]), parseInt (components [1]) - 1, parseInt (components [0]));
};

Cary.tools.degMinToDouble = function (deg, min, char)
{
    var sign = (!char) ? 1 : ('NnEe'.indexOf (char) >= 0 ? 1 : -1);

    return (deg + min / 60) * sign;
};

Cary.tools.getCtlDescField = function (desc, fieldName, defaultValue)
{
    if (typeof (defaultValue) === 'undefined')
        defaultValue = null;
    
    return fieldName in desc ? desc [fieldName] : defaultValue;    
};

Cary.tools.getCtlParent = function (desc)
{
    return Cary.tools.getCtlDescField (desc, 'parent', document.getElementsByTagName ('body') [0]);
};

Cary.tools.getCtlText = function (desc)
{
    return Cary.tools.getCtlDescField (desc, 'text');
};

Cary.tools.getCtlID = function (desc)
{
    return Cary.tools.getCtlDescField (desc, 'id');
};

Cary.tools.getCtlToRightFlag = function (desc)
{
    return Cary.tools.getCtlDescField (desc, 'toRight', false);
};

Cary.tools.getCtlClickHandler = function (desc)
{
    return Cary.tools.getCtlDescField (desc, 'onClick');
};

Cary.tools.dateDiff = function (begin, end)
{
    var difference = (end - begin) / 1000;
    var minLength  = 60;
    var hourLength = 3600;
    var dayLength  = hourLength * 24;
    var days       = Math.floor (difference / dayLength);
    var hours      = Math.floor ((difference % dayLength) / hourLength);
    var minutes    = Math.floor ((difference % hourLength) / minLength);
    var seconds    = difference % minLength;
    var result     = '';

    if (days > 0)
        result = result + days.toString () + ' d';

    if (hours > 0)
    {
        if (result !== '')
            result = result + ' ';

        result = result + hours.toString () + ' h';
    }

    if (minutes > 0)
    {
        if (result !== '')
            result = result + ' ';

        result = result + minutes.toString () + ' m';
    }

    if (seconds > 0)
    {
        if (result !== '')
            result = result + ' ';

        result = result + seconds.toString () + ' s';
    }

    return result;
};

// Deformats DATE ONLY, zero time assumed!
// UTC assumed if missing
Cary.tools.stringToDateUTC = function (dateString, utcMode)
{
    var firstSepPos = dateString.indexOf ('-');
    var separator;
    var parts;
    var year;
    var month;
    var day;
    var result = new Date ();

    if (!dateString || dateString === '')
        return null;

    if (!utcMode)
        utcMode = true;

    if (firstSepPos < 0)
        firstSepPos = dateString.indexOf ('/');

    if (firstSepPos < 0)
        firstSepPos = dateString.indexOf ('.');

    if (firstSepPos < 0)
        // Strange date format, return now ()
        return null;

    separator = dateString.charAt (firstSepPos);

    parts = dateString.split (separator);

    if (parts.length < 3)
        // Strange date format, return now ()
        return null;

    if (firstSepPos === 4)
    {
        year  = parseInt (parts [0]);
        month = parseInt (parts [1]);
        day   = parseInt (parts [2]);
    }
    else if (firstSepPos === 2)
    {
        switch (separator)
        {
            case '.':
                // German date
                year  = parseInt (parts [2]);
                month = parseInt (parts [1]);
                day   = parseInt (parts [0]);

                break;

            case '/':
            case '-':
                // American or European date
                year  = parseInt (parts [0]);
                month = parseInt (parts [1]);
                day   = parseInt (parts [2]);

                break;

            default:
                // Strange date format, return now ()

                return null;
        }
    }
    else
    {
        // Strange date format, return now ()

        return null;
    }

    if (year < 30)
        year += 2000;
    else if (year < 100)
        year += 1900;

    // Rough check
    if (month > 0 && month < 13 && day > 0 && day < 32)
    {
        if (utcMode)
        {
            result.setUTCDate (day);
            result.setUTCMonth (month - 1);
            result.setUTCFullYear (year);
            result.setUTCHours (0);
            result.setUTCMinutes (0);
            result.setUTCSeconds (0);
        }
        else
        {
            result.setDate (day);
            result.setMonth (month - 1);
            result.setFullYear (year);
            result.setHours (0);
            result.setMinutes (0);
            result.setSeconds (0);
        }
    }
    else
    {
        result = null;
    }

    return result;
};

Cary.tools.stringToDate = function (dateString)
{
    return dateString ? new Date (dateString.substr (0, 10) + 'T' + dateString.substr (11, 8) + 'Z') : new Date ();
};

Cary.tools.stringToTimestamp = function (dateString)
{
    var dateTime = Cary.tools.stringToDate (dateString);

    return dateTime === null ? null : dateTime.getTime ();
};

Cary.tools.isIE = function ()
{
    return navigator.userAgent.indexOf ('.NET') >= 0 || navigator.userAgent.indexOf ('ie') >= 0;
};

Cary.tools.isChrome = function ()
{
    return navigator.userAgent.indexOf ('Chrome') >= 0;
};

Cary.tools.isFirefox = function ()
{
    return navigator.userAgent.indexOf ('.NET') < 0 && navigator.userAgent.indexOf ('Mozilla') >= 0;
};

