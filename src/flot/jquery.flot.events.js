
/*
flot plugin for displaying events (either ranges or points) along with 
JSON content that can be used for color, label, and/or styling

*/

(function ($) {
    var options = {
        series: { 
            events: {
                stream_id: null,
                show: false,
                selected: false,
                selected_event: null,
                settings: {
                    color: {
                        type: 'fixed', //fixed, attribute, numeric
                        value: {
                          fixed: null,     //use this color (initialized to default)
                          attribute: '', //use this attribute as CSS color
                          numeric: {         //apply a color map
                            attribute: '', //use this attribute as the numeric value for the event
                            min: 0,    //left end of color map
                            max: 100,      //right end of color map
                          }
                        }
                      }
                }    
            } 
        },
        eventInfoOverlay: false //plot hover functionality (highlights and tooltips)
    }

    function init(plot) {
       
        plot.hooks.drawSeries.push(
            function(plot, ctx, series) {
                var axes = plot.getAxes();               
                var plotOffset = plot.getPlotOffset();
                var plot_height = plot.height();
                if(!series.events.show)
                    return; //not an event series
                ctx.save();
                ctx.translate(plotOffset.left, plotOffset.top);
                series.data
                  .map(event=>{
                    var box = _box(axes,plot_height,
                        series.events.settings.height,
                        series.events.settings.position, 
                        event);
                    if(box==null){
                        return; //event is off the screen
                    }
                    ctx.fillStyle = computeColor(series.events.settings.color, event);
                    event_width = box[2]
                    if(event_width>0){
                        //if there is a non-zero width draw a bounding box
                        ctx.fillRect(...box);
                    }
                    //draw the marker
                    ctx.save();
                    ctx.fillStyle = removeAlpha(ctx.fillStyle);
                    //center the marker in the event
                    let marker_px = series.events.settings.marker.size
                    ctx.translate(box[0]+box[2]/2-marker_px/2,box[1]+box[3]/2-marker_px/2);
                    /*ctx.save()
                    ctx.fillStyle='black'
                    ctx.fillRect(0,0,marker_px,marker_px);
                    ctx.restore();*/
                    let marker = computeMarker(series.events.settings.marker, event);
                    //shrink the svg to roughly 10x10 then apply the scaling factor
                    //NOTE: this is not exactly correct, some SVG's are not in the center of the 
                    //square or are smaller than 10x10 when scaled
                    let marker_scale = series.events.settings.marker.size/10;
                    ctx.scale(0.02*marker_scale,0.02*marker_scale);
                    ctx.fill(new Path2D(marker));
                    ctx.restore();
                   
                    //draw a check on selected events
                    if(event.selected){
                        ctx.save();
                        //same location as the marker
                        ctx.translate(box[0]+box[2]/2-10,box[1]+box[3]/2-25);
                        ctx.scale(0.04,0.04);
                        ctx.fillStyle='LimeGreen'
                        ctx.shadowOffsetX = 2;
                        ctx.shadowOffsetY = 2;
                        ctx.shadowColor = '#444'
                        ctx.shadowBlur =6;
                        ctx.fill(new Path2D(svg_check));
                        ctx.restore();
                    }

                    //draw the label
                    var label = computeLabel(series.events.settings.label, event);
                    if(label==null)
                        return;
                    ctx.save();
                    ctx.fillStyle='black';
                    ctx.font = series.events.settings.label.size+'px sans-serif'
                    ctx.translate(box[0]+box[2]/2,box[1]-2);//origin is the top middle of event with some padding
                    var text = ctx.measureText(label);
                    ctx.fillText(label,text.width/-2,0);
                    ctx.restore();
                  });
                ctx.restore();
            }) 
        /*plot.hooks.drawOverlay.push(function (plot, ctx){
            var axes = plot.getAxes();               
            var plot_height = plot.height();
            var plotOffset = plot.getPlotOffset();

            ctx.save();
            ctx.translate(plotOffset.left, plotOffset.top);
            ctx.strokeStyle = "rgba(255,255,0,0.50)";
            ctx.lineWidth = 2;
            plot.getData()
                //look for a selected event series
                .filter(series=>series.events.show && series.events.selected)
                .map(series=>{
                    //draw a highlight around each event in the series
                    series.data.map(event=>{
                        var box = _box(axes,plot_height,
                            series.events.settings.height,
                            series.events.settings.position, 
                            event);
                        ctx.strokeRect(...box);
                    })
                })
            ctx.restore();
        })*/

        

        plot.hooks.bindEvents.push(function (plot, eventHolder) {

            // get plot options
            let options = plot.getOptions();
			
            // if overlay features of plugin not enabled return
            if (options.eventInfoOverlay === false || typeof options.eventInfoOverlay === 'undefined') return;


            // bind event
            $( plot.getPlaceholder() ).on("plothover", plothover);
        });
        
        function plothover(event, pos, item){
            var axes = plot.getAxes();
            var plot_height = plot.height();
            var offset = plot.getPlotOffset();
            var canvas_rect =  event.target.getBoundingClientRect();
            plot.getData()
                .filter(series=>series.events.show)
                .map(series=>{
                    var selected = series.events.selected;
                    var selected_event = null;
                    //is the cursor inside an event in this series?
                    series.data.map(event=>{
                        var c_pos = { //canvas coordinates of cursor
                            x:pos.pageX-canvas_rect.x-offset.left, 
                            y:pos.pageY-canvas_rect.y-offset.top}
                        var box = _box(axes,plot_height,
                            series.events.settings.height,
                            series.events.settings.position, 
                            event);
                        if(_contains(box,c_pos)){
                            selected_event = event;
                        }
                    })
                    //save the highlight status
                    series.events.selected=(selected_event!=null);
                    series.events.selected_event=selected_event;
                    //disable data point cursor if we are inside an event rectangle
                    /*if(selected_event!=null){
                        console.log("disable cursor")
                        plot.getOptions().grid.autoHighlight=false
                    }
                    else{
                        console.log("enable cursor")
                        plot.getOptions().grid.autoHighlight=true
                    }*/
                    //highlight the series if the cursor is inside an event
                    /*if(!selected && selected_event!=null){
                        //plot.getPlaceholder().trigger("eventSettingsChanged", series.events);
                        plot.triggerRedrawOverlay(); //add highlight
                    }
                    if(selected && selected_event==null){
                        //plot.getPlaceholder().trigger("eventSettingsChanged", series.events);
                        plot.triggerRedrawOverlay(); //remove highlight
                    }*/
   
            })
        }
        function _box(axes, plot_height, height_settings, position_settings, event){
            let xaxis = axes.xaxis;
            let xright = xaxis.p2c(Math.min(xaxis.max,event.end_time))
            let xleft = xaxis.p2c(Math.max(xaxis.min,event.start_time))
            //if the event is off the screen don't draw it
            if(xleft>=xright)
                return null;
            let width = xright-xleft
            //compute height based on settings
            event_height = 0;
            switch(height_settings.type){
                case 'fixed':
                    event_height = height_settings.value.fixed;
                    break;
                case 'attribute':
                    event_height = event.content[height_settings.value.attribute];
                    if(typeof(event_height)!='number'){
                        console.log("missing height attribute ", height_settings.value.attribute)
                        return null;
                    }
                    break;
                default:
                    console.log("invalid height type ", height.settings.type);
                    return null;
            }
            //convert height to pixels
            height = 0;
            axis = null;
            switch(position_settings.axis){
                case 'left':
                    axis = axes.yaxis;
                    if(axis.used==false){
                        //console.log("cannot display event on unused axis");
                        return null;
                    }
                    height =  axis.p2c(0) - axis.p2c(event_height);
                    break;
                case 'right':
                    axis = axes.y2axis;
                    if(axis.used==false){
                        console.log("cannot display event on unused axis");
                        return null;
                    }
                    height = axis.p2c(0) - axis.p2c(event_height)
                    break;
                case 'float':
                    height = plot_height*event_height;
                    break;
            }
            //compute offset based on position settings
            event_offset = 0;
            switch(position_settings.type){
                case 'fixed':
                    event_offset = position_settings.value.fixed;
                    break;
                case 'attribute':
                    event_offset = event.content[position_settings.value.attribute];
                    if(typeof(event_offset)!='number'){
                        console.log("missing position attribute ", position_settings.value.attribute)
                        return null;
                    }
                    break;
                default:
                    console.log("invalid position type ", position.settings.type);
                    return null;
            }
            //convert offset to pixels
            let offset = plot_height/2;
            if(position_settings.axis=='float'){
                //1 = top of plot, 0 = center, -1 = bottom
                offset = plot_height/2-(plot_height/2)*event_offset;
            } else {
                //if(event_offset < axis.min || event_offset > axis.max)
                //    return null; //outside of plot area
                offset = axis.p2c(event_offset)-height/2
            }
            //TODO: get height and y offset from series
            let ytop = offset-height/2;

            //truncate height and ytop based on plot_height
            if(ytop<0){
                height=height+ytop;
                ytop=0;
            }
            //if the whole event is above the plot don't display it
            if((ytop+height)<0)
                return null;
            
            //do the same for the bottom of the plot
            if(ytop>plot_height)
                return null;
            if(ytop+height>plot_height){
                height = plot_height-ytop;
            }
            //make sure the box has a positive height
            if(height<0){
                height = height*-1;
                ytop = ytop-height;
            }
            return [xleft,ytop,width,height]
            

        }
        function _contains(box,pos){
            if(box==null){
                return false;
            }
            //check with pos is inside of box
            var left = box[0]
            var right = box[0]+box[2]
            if(pos.x<left || pos.x>right)
                return false;
            var top =  box[1]
            var bottom =  box[1]+box[3]
            if((pos.y<top)||(pos.y>bottom))
                return false;
            return true;
        }
    }
    
    //utility functions
    function computeColor(color_settings, event){
        switch(color_settings.type){
            case 'fixed':
                return color_settings.value.fixed;
            case 'attribute':
                let color = event.content[color_settings.value.attribute];
                if(color===undefined||color==null||color==''){
                    color = color_settings.value.fixed;
                }
                return color
            case 'numeric':
                console.log("NUMERIC not implemented")
                return "#FF00FF";
        }
    }
    function removeAlpha(color){
        if(color==null||color.length==0)
            return color;
        if(color[0]=='#')
            return color.slice(0,7);
        if(color.slice(0,4)=='rgba'){
            return color.split(',').slice(0,3).join(',')+', 1.0)';
        }
    }
    function computeLabel(label_settings, event){
        switch(label_settings.type){
            case 'fixed':
                return label_settings.value.fixed;
            case 'none':
                return null;
            case 'attribute':
                label = event.content[label_settings.value.attribute];
                if(label===undefined||label==null){
                    return '?';
                }
                //truncate floats to 2 decimal points
                if(typeof(label)=='number' && !Number.isInteger(label)){
                    return label.toFixed(2);
                } else {
                    return label;
                }
        }
    }
    function computeMarker(marker_settings, event){
        let marker='.';
        switch(marker_settings.type){
            case 'fixed':
                marker = marker_settings.value.fixed;
                break;
            case 'attribute':
                marker = event.content[marker_settings.value.attribute];
                if(marker===undefined||marker==null||marker==''){
                    marker = marker_settings.value.fixed;
                }
        }
        switch(marker){

            case 'o':
                return svg_circle;
            case '+':
                return svg_plus;
            case '*':
                return svg_asterix;
            case '.':
                return svg_dot;
            case 'x':
                return svg_cross;
            case '-':
                return svg_horizontal_line;
            case '|':
                return svg_vertical_line;
            case 's':
                return svg_square;
            case 'd':
                return svg_diamond;
            case '^':
                return svg_upward_triangle;
            case 'v':
                return svg_downward_triangle;
            case '>':
                return svg_rightward_triangle;
            case '<':
                return svg_leftward_triangle;
            case 'p':
                return svg_pentagram;
            case 'h':
                return svg_hexagram;
            default:
                console.log("invalid marker", marker);
                return svg_circle;
        }
    }
    //fontawesome.com free fonts
    //regular cirle
    svg_circle = "M 256 8 C 119 8 8 119 8 256 s 111 248 248 248 s 248 -111 248 -248 S 393 8 256 8 Z m 0 448 c -110.5 0 -200 -89.5 -200 -200 S 145.5 56 256 56 s 200 89.5 200 200 s -89.5 200 -200 200 Z";
    //circle
    svg_dot = "M 256 8 C 119 8 8 119 8 256 s 111 248 248 248 s 248 -111 248 -248 S 393 8 256 8 Z";
    //plus
    svg_plus = "M 416 208 H 272 V 64 c 0 -17.67 -14.33 -32 -32 -32 h -32 c -17.67 0 -32 14.33 -32 32 v 144 H 32 c -17.67 0 -32 14.33 -32 32 v 32 c 0 17.67 14.33 32 32 32 h 144 v 144 c 0 17.67 14.33 32 32 32 h 32 c 17.67 0 32 -14.33 32 -32 V 304 h 144 c 17.67 0 32 -14.33 32 -32 v -32 c 0 -17.67 -14.33 -32 -32 -32 Z";
    //star-of-life
    svg_asterix   = "M 259.3 17.8 L 194 150.2 L 47.9 171.5 c -26.2 3.8 -36.7 36.1 -17.7 54.6 l 105.7 103 l -25 145.5 c -4.5 26.3 23.2 46 46.4 33.7 L 288 439.6 l 130.7 68.7 c 23.2 12.2 50.9 -7.4 46.4 -33.7 l -25 -145.5 l 105.7 -103 c 19 -18.5 8.5 -50.8 -17.7 -54.6 L 382 150.2 L 316.7 17.8 c -11.7 -23.6 -45.6 -23.9 -57.4 0 Z"
    //times
    svg_cross = "M 242.72 256 l 100.07 -100.07 c 12.28 -12.28 12.28 -32.19 0 -44.48 l -22.24 -22.24 c -12.28 -12.28 -32.19 -12.28 -44.48 0 L 176 189.28 L 75.93 89.21 c -12.28 -12.28 -32.19 -12.28 -44.48 0 L 9.21 111.45 c -12.28 12.28 -12.28 32.19 0 44.48 L 109.28 256 L 9.21 356.07 c -12.28 12.28 -12.28 32.19 0 44.48 l 22.24 22.24 c 12.28 12.28 32.2 12.28 44.48 0 L 176 322.72 l 100.07 100.07 c 12.28 12.28 32.2 12.28 44.48 0 l 22.24 -22.24 c 12.28 -12.28 12.28 -32.19 0 -44.48 L 242.72 256 Z";
    //ruler-vertical
    svg_vertical_line = "M 168 416 c -4.42 0 -8 -3.58 -8 -8 v -16 c 0 -4.42 3.58 -8 8 -8 h 88 v -64 h -88 c -4.42 0 -8 -3.58 -8 -8 v -16 c 0 -4.42 3.58 -8 8 -8 h 88 v -64 h -88 c -4.42 0 -8 -3.58 -8 -8 v -16 c 0 -4.42 3.58 -8 8 -8 h 88 v -64 h -88 c -4.42 0 -8 -3.58 -8 -8 v -16 c 0 -4.42 3.58 -8 8 -8 h 88 V 32 c 0 -17.67 -14.33 -32 -32 -32 H 32 C 14.33 0 0 14.33 0 32 v 448 c 0 17.67 14.33 32 32 32 h 192 c 17.67 0 32 -14.33 32 -32 v -64 h -88 Z";
    //ruler-horizontal
    svg_horizontal_line = "M 544 128 h -48 v 88 c 0 4.42 -3.58 8 -8 8 h -16 c -4.42 0 -8 -3.58 -8 -8 v -88 h -64 v 88 c 0 4.42 -3.58 8 -8 8 h -16 c -4.42 0 -8 -3.58 -8 -8 v -88 h -64 v 88 c 0 4.42 -3.58 8 -8 8 h -16 c -4.42 0 -8 -3.58 -8 -8 v -88 h -64 v 88 c 0 4.42 -3.58 8 -8 8 h -16 c -4.42 0 -8 -3.58 -8 -8 v -88 h -64 v 88 c 0 4.42 -3.58 8 -8 8 H 88 c -4.42 0 -8 -3.58 -8 -8 v -88 H 32 c -17.67 0 -32 14.33 -32 32 v 192 c 0 17.67 14.33 32 32 32 h 512 c 17.67 0 32 -14.33 32 -32 V 160 c 0 -17.67 -14.33 -32 -32 -32 Z";
    //square
    svg_square = "M 471.99 334.43 L 336.06 256 l 135.93 -78.43 c 7.66 -4.42 10.28 -14.2 5.86 -21.86 l -32.02 -55.43 c -4.42 -7.65 -14.21 -10.28 -21.87 -5.86 l -135.93 78.43 V 16 c 0 -8.84 -7.17 -16 -16.01 -16 h -64.04 c -8.84 0 -16.01 7.16 -16.01 16 v 156.86 L 56.04 94.43 c -7.66 -4.42 -17.45 -1.79 -21.87 5.86 L 2.15 155.71 c -4.42 7.65 -1.8 17.44 5.86 21.86 L 143.94 256 L 8.01 334.43 c -7.66 4.42 -10.28 14.21 -5.86 21.86 l 32.02 55.43 c 4.42 7.65 14.21 10.27 21.87 5.86 l 135.93 -78.43 V 496 c 0 8.84 7.17 16 16.01 16 h 64.04 c 8.84 0 16.01 -7.16 16.01 -16 V 339.14 l 135.93 78.43 c 7.66 4.42 17.45 1.8 21.87 -5.86 l 32.02 -55.43 c 4.42 -7.65 1.8 -17.43 -5.86 -21.85 Z"
    //ankh
    svg_diamond = "M 296 256 h -44.62 C 272.46 222.01 288 181.65 288 144 C 288 55.63 230.69 0 160 0 S 32 55.63 32 144 c 0 37.65 15.54 78.01 36.62 112 H 24 c -13.25 0 -24 10.74 -24 24 v 32 c 0 13.25 10.75 24 24 24 h 96 v 152 c 0 13.25 10.75 24 24 24 h 32 c 13.25 0 24 -10.75 24 -24 V 336 h 96 c 13.25 0 24 -10.75 24 -24 v -32 c 0 -13.26 -10.75 -24 -24 -24 Z M 160 80 c 29.61 0 48 24.52 48 64 c 0 34.66 -27.14 78.14 -48 100.87 c -20.86 -22.72 -48 -66.21 -48 -100.87 c 0 -39.48 18.39 -64 48 -64 Z";
    //caret-up
    svg_upward_triangle = "M 288.662 352 H 31.338 c -17.818 0 -26.741 -21.543 -14.142 -34.142 l 128.662 -128.662 c 7.81 -7.81 20.474 -7.81 28.284 0 l 128.662 128.662 c 12.6 12.599 3.676 34.142 -14.142 34.142 Z";
    //caret-down
    svg_downward_triangle = "M 31.3 192 h 257.3 c 17.8 0 26.7 21.5 14.1 34.1 L 174.1 354.8 c -7.8 7.8 -20.5 7.8 -28.3 0 L 17.2 226.1 C 4.6 213.5 13.5 192 31.3 192 Z";
    //carent-left
    svg_leftward_triangle = "M 192 127.338 v 257.324 c 0 17.818 -21.543 26.741 -34.142 14.142 L 29.196 270.142 c -7.81 -7.81 -7.81 -20.474 0 -28.284 l 128.662 -128.662 c 12.599 -12.6 34.142 -3.676 34.142 14.142 Z";
    //caret-right
    svg_rightward_triangle = "M 0 384.662 V 127.338 c 0 -17.818 21.543 -26.741 34.142 -14.142 l 128.662 128.662 c 7.81 7.81 7.81 20.474 0 28.284 L 34.142 398.804 C 21.543 411.404 0 402.48 0 384.662 Z";
    //adjust
    svg_pentagram = "M 8 256 c 0 136.966 111.033 248 248 248 s 248 -111.034 248 -248 S 392.966 8 256 8 S 8 119.033 8 256 Z m 248 184 V 72 c 101.705 0 184 82.311 184 184 c 0 101.705 -82.311 184 -184 184 Z";
    //ban
    svg_hexagram = "M 256 8 C 119.034 8 8 119.033 8 256 s 111.034 248 248 248 s 248 -111.034 248 -248 S 392.967 8 256 8 Z m 130.108 117.892 c 65.448 65.448 70 165.481 20.677 235.637 L 150.47 105.216 c 70.204 -49.356 170.226 -44.735 235.638 20.676 Z M 125.892 386.108 c -65.448 -65.448 -70 -165.481 -20.677 -235.637 L 361.53 406.784 c -70.203 49.356 -170.226 44.736 -235.638 -20.676 Z";
    //check (for selected events)
    svg_check = "M470.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L192 338.7 425.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"
    
    svg_default=svg_square;
    $.plot.plugins.push({
        init: init,
        options: options,
        name: 'events',
        version: '0.1'
    });
})(jQuery);