Cary.controls.GMSlider = function (map, location, options, containerStyles)
{
    var ctlOptions;

    Cary.controls.ImgButton.apply (this, [map, location, null, options, containerStyles]);
    
    this.options = options;
};

Cary.controls.GMSlider.prototype = Object.create (Cary.controls.ImgButton.prototype);

Cary.controls.GMSlider.prototype.initialize = function ()
{
    var instance = this;
    
    this.slider = document.createElement ('input');

    this.slider.type      = 'range';
    this.slider.id        = 'id' in this.options ? this.options.id : null;
    this.slider.className = 'className' in this.options ? this.options.className : null;

    ['min', 'max', 'value', 'step'].forEach (function (key)
                                             {
                                                 if (key in instance.options)
                                                     instance.slider [key] = instance.options [key];
                                             });

    if ('vertical' in this.options && this.options.vertical)
    {
        this.slider.style.width = '80px';
        this.slider.style.height = '18px';
        //this.container.width  = '200px';
        //this.container.height = '100px';
        this.container.style.transformOrigin = '80px 16px';
        this.container.style.transform = 'rotate(-90deg)';
        //this.container.style.padding   = '5px';
    }

    if ('onChange' in this.options)
    {
        this.slider.onchange = this.options.onChange;
        this.slider.oninput  = this.options.onChange;
    }
    
    this.container.appendChild (this.slider);
};
