export const FLOT_FONT = {
	size: 12, 
	lineHeight: 13, 
	style: "normal", 
	weight: "normal", 
	family: "sans-serif", 
	variant: "normal", 
	color: "#555" 
}
export const FLOT_OPTIONS = {
		grid: {
			backgroundColor: "#FFFFFF",
			hoverable: true,
			clickable: true,
		},
		highlight: {
			color: "#3d79db",
		},
		selection: {
			mode: "x",
			interactive: false,
			color: "#e8cfac",   //left->right highlight color
			altColor: "#e8cfac" //right->left highlight color
		},
		tooltip: true,
		eventInfoOverlay: true,
		canvas: true,
		tooltipOpts:{
			content: "<strong>%s</strong> %y.2",
			lines: {
				track: true
			},
			defaultTheme: true
		},
		xaxis:{
			mode:"time",
			timezone: "browser",
			font: {
				size: 12, 
				lineHeight: 13, 
				style: "normal", 
				weight: "normal", 
				family: "sans-serif", 
				variant: "normal", 
				color: "#555" 
			},
			min: 0,
			max: 0
		},
		/*yaxis:{
			//min: 0,
			//max: 10
		},*/
		yaxes:[
			{
				 font: {
					size: 12, 
					lineHeight: 13, 
					style: "normal", 
					weight: "normal", 
					family: "sans-serif", 
					variant: "normal", 
					color: "#555" 
				},
				//axisLabel: "undefineds",
				//axisLabelPadding: 10,
				//show: false
			},
			{
				//axisLabel: "undefineds",
				position: "right",
				font: {
					size: 12, 
					lineHeight: 13, 
					style: "normal", 
					weight: "normal", 
					family: "sans-serif", 
					variant: "normal", 
					color: "#555" 
				},
				//axisLabelPadding: 10,
				//show: false
			},
			{ //left axis interval data
				min: -1,
				max: 1,
				position: "left", 
				show: false
			},
			{ //left axis interval data
				position: "right", 
				show: false
			},
			{//events axis
				position: "right",
				show:false
			}],
		zoom: {
			interactive: true,
		},
		pan:{
			interactive: true,
			cursor: "pointer",
			frameRate: 20,
		},
		crosshair: {
			mode: ""
		},
		//shadowSize: 1,
		series:{
			lines:{
				show: true,
				fill: false,
				//lineWidth: 2,
			}
		},
		legend: {
			split: true,
			left_font_size: 12,
			right_font_size: 12
		}
	};