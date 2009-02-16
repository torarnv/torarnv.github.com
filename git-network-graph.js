
var colors = ["black", "red", "blue", "green",
//"#ECD078", "#D95B43", "#C02942", "#542437", "#53777A",
"#417DA6", "#AAD439", "#9339D4", "#D43972", "#50D439", "#4ABAFF", "#85487A", "#FF8F4A", "#FB6100"
];


function scaleTime(time) {
	return time * 30;
}

function scaleSpace(space) {
	return space * 18;
}


function drawGraph(data) {
 	var canvas = document.getElementById("network-graph");
    if (canvas.getContext) {
		var ctx = canvas.getContext("2d");

		var commits = data["commits"];

		var bgColor = window.getComputedStyle(canvas,null).backgroundColor;

		ctx.globalAlpha = 1;
		ctx.lineWidth = 2;

		//ctx.scale(2,2);

		var startTime = commits[0].time;
		ctx.translate(- scaleTime(startTime), 0);

		for (i = 0; i < commits.length; ++i) {

			var commit = commits[i]

			// How to draw it (based on place and user)
			ctx.strokeStyle = colorForSpace(commit.space);//"rgba(256, 0, 0, 1)";

			for (j = 0; j < commit.parents.length; ++j) {
				var parent = commit.parents[j];
				var parentTime = parent[1];
				var parentSpace = parent[2];

				if (parentSpace == commit.space) {
					// Linear history
					ctx.strokeStyle = colorForSpace(commit.space)
					ctx.beginPath();
					ctx.moveTo(scaleTime(parentTime) + 7, scaleSpace(parentSpace));
					ctx.lineTo(scaleTime(commit.time) - 7, scaleSpace(commit.space));
					ctx.stroke();
				} else {
					if (j == 0) {
						// Branch point in other branch
						ctx.strokeStyle = colorForSpace(commit.space)
						ctx.beginPath();
						ctx.moveTo(scaleTime(parentTime), scaleSpace(parentSpace) + 7);
						ctx.lineTo(scaleTime(parentTime), scaleSpace(commit.space));
						ctx.lineTo(scaleTime(commit.time) - 10, scaleSpace(commit.space));
						ctx.stroke();

						ctx.fillStyle = colorForSpace(commit.space)
						drawArrow(ctx, scaleTime(commit.time) - 10, scaleSpace(commit.space));


					} else {
						// Merge from other branch
						ctx.strokeStyle = colorForSpace(parentSpace);
						ctx.beginPath()
						var distance = 10;

						if (parentSpace < commit.space) {
							ctx.moveTo(scaleTime(parentTime), scaleSpace(parentSpace) + 7);
							ctx.lineTo(scaleTime(parentTime), scaleSpace(commit.space)  - distance);
							ctx.lineTo(scaleTime(commit.time) - distance, scaleSpace(commit.space) - distance);
					//		ctx.lineTo(scaleTime(commit.time), scaleSpace(commit.space));
							ctx.stroke();

							ctx.save();
							ctx.translate(scaleTime(commit.time) - 7, scaleSpace(commit.space) - 6.5);
							ctx.rotate((Math.PI/180) * 40);
							ctx.fillStyle = colorForSpace(parentSpace);
							drawArrow(ctx, 0, 0);
							ctx.restore();


						} else {
							ctx.moveTo(scaleTime(parentTime) + 7, scaleSpace(parentSpace));
							ctx.lineTo(scaleTime(commit.time) - distance - 1, scaleSpace(parentSpace));
							ctx.lineTo(scaleTime(commit.time) - distance - 1, scaleSpace(commit.space) + distance);
							ctx.lineTo(scaleTime(commit.time) - 7, scaleSpace(commit.space) + 7);
							ctx.stroke();

							ctx.save();
							ctx.translate(scaleTime(commit.time) - 7, scaleSpace(commit.space) + 7);
							ctx.rotate((Math.PI/180)*-50);
							ctx.fillStyle = colorForSpace(parentSpace);
							drawArrow(ctx, 0, 0);
							ctx.restore();
						}



					}
				}

			}
		}

		for (i = 0; i < commits.length; ++i) {
					var commit = commits[i]

					// How to draw it (based on place and user)
//					ctx.fillStyle = "black"; //'rgb('+(14 * commit.space)+','+(255- 14 * commit.space)+',255)';

					ctx.fillStyle = colorForSpace(commit.space)
					ctx.strokeStyle = "transparent";//bgColor;

					drawCommit(ctx, commit.time, commit.space);
		}
	}
}

function drawArrow(ctx, x, y) {
	ctx.beginPath();
	ctx.moveTo(x + 3, y);
	ctx.lineTo(x - 6, y - 4);
	ctx.lineTo(x - 6, y + 4);
	ctx.fill();
}

function colorForSpace(space) {
	//return 'rgb(' + (14 * space) + ',' + (255 - 14 * space) + ',255)';
	return colors[(space % colors.length) - 1];
}



function drawCommit(ctx, time, space) {
	ctx.beginPath();
	ctx.arc(scaleTime(time), scaleSpace(space), 5, 0, Math.PI*2, true);
	ctx.fill();
	ctx.stroke();
}


function fetchData() {
	var req = new XMLHttpRequest();
	req.open("GET", "foo.php", true);
	req.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var data = JSON.parse(this.responseText);
			drawGraph(data);
		}
	};

	req.send(null);
}