CaryLoader = function (root)
{
    var instance = this;
    
    CaryLoader.scripts.forEach (function (path)
                                {
                                    if (path.length > 0)
                                        instance.loadScript (root + '/' + path);
                                });
};

CaryLoader.prototype.loadScript = function (path)
                                  {
                                        var script = document.createElement ('script');

                                        script.src = path;

                                        document.getElementsByTagName ('head') [0].appendChild (script);
                                  };

CaryLoader.scripts = [];

CaryLoader.scripts.push ('');
CaryLoader.scripts.push ('cary.js');
CaryLoader.scripts.push ('cary.min.1.js');
CaryLoader.scripts.push ('geo_util.js');
CaryLoader.scripts.push ('loader.js');
CaryLoader.scripts.push ('service.js');
CaryLoader.scripts.push ('tools.js');
CaryLoader.scripts.push ('gm/brg_rgn_tag.js');
CaryLoader.scripts.push ('gm/gm_panel.js');
CaryLoader.scripts.push ('gm/img_button.js');
CaryLoader.scripts.push ('gm/maps.js');
CaryLoader.scripts.push ('gm/map_controls.js');
CaryLoader.scripts.push ('gm/map_locker.js');
CaryLoader.scripts.push ('gm/map_menu.js');
CaryLoader.scripts.push ('gm/mf_balloon.js');
CaryLoader.scripts.push ('gm/pos_indicator.js');
CaryLoader.scripts.push ('gm/drawers/circle_drawer.js');
CaryLoader.scripts.push ('gm/drawers/gen_drawer.js');
CaryLoader.scripts.push ('gm/drawers/icon_drawer.js');
CaryLoader.scripts.push ('gm/drawers/icon_grp_drawer.js');
CaryLoader.scripts.push ('gm/drawers/polygon_drawer.js');
CaryLoader.scripts.push ('gm/drawers/polyline_drawer.js');
CaryLoader.scripts.push ('ui/dlg/browser_wnd.js');
CaryLoader.scripts.push ('ui/dlg/coord_edit.js');
CaryLoader.scripts.push ('ui/dlg/msg_box.js');
CaryLoader.scripts.push ('ui/dlg/pos_edit.js');
CaryLoader.scripts.push ('ui/dlg/usr_plg_props.js');
CaryLoader.scripts.push ('ui/dlg/usr_pln_props.js');
CaryLoader.scripts.push ('ui/generic/browsebox.js');
CaryLoader.scripts.push ('ui/generic/browser.js');
CaryLoader.scripts.push ('ui/generic/buttons.js');
CaryLoader.scripts.push ('ui/generic/calendar.js');
CaryLoader.scripts.push ('ui/generic/checkbox.js');
CaryLoader.scripts.push ('ui/generic/datehourbox2.js');
CaryLoader.scripts.push ('ui/generic/details.js');
CaryLoader.scripts.push ('ui/generic/editbox.js');
CaryLoader.scripts.push ('ui/generic/gen_ctl.js');
CaryLoader.scripts.push ('ui/generic/listbox.js');
CaryLoader.scripts.push ('ui/generic/listview.js');
CaryLoader.scripts.push ('ui/generic/treeview.js');
CaryLoader.scripts.push ('ui/generic/wnd.js');
CaryLoader.scripts.push ('usr_obj/gen_obj.js');
CaryLoader.scripts.push ('usr_obj/multi_pt_obj.js');
CaryLoader.scripts.push ('usr_obj/usr_circle.js');
CaryLoader.scripts.push ('usr_obj/usr_icn.js');
CaryLoader.scripts.push ('usr_obj/usr_icn_grp.js');
CaryLoader.scripts.push ('usr_obj/usr_plg.js');
CaryLoader.scripts.push ('usr_obj/usr_pln.js');

