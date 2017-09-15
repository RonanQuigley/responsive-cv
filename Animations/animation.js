function Animate(element, data, bool, svgAspectRatio)
{

  if(svgAspectRatio === undefined)
  {
    svgAspectRatio = "xMidYMid meet";
  }

  var elem = document.getElementById(element);

  if(elem == null)
  {
    throw Error("Cannot find element to animate: " + element.toString());
  }

	var animData = {
			container: elem,
			renderer: 'svg',
			opacity: 0,
			loop: bool,
			autoplay: true,
			rendererSettings: {
			progressiveLoad:false,
      preserveAspectRatio:svgAspectRatio
			},
			path: data
	};

  var anim;
	anim = bodymovin.loadAnimation(animData);
}

function CheckScrollPosition(element, data)
{
  var waypoint = new Waypoint({
    element: document.getElementById(element),
    handler: function() {
      Animate(element, data)
      this.destroy(); // destroy the instance to prevent stacking
    },
    offset: "100%" // makes the element appear at the bottom of the page
  })
}


function setSvgViewBox(svgID, xOffset, yOffset, width, height)
{
    $(document).ready(function()
    {
      var svg = document.getElementById(svgID); // get the svg we are working with
      if(svg.length != 0) // if a div with this id exists...
      {
        var viewBox = xOffset + " " + yOffset + " " + width + " " + height;
        svg.setAttribute("viewBox", viewBox); // apply our viewbox
      }
      else
      {
        console.error("Cannot find element with id: " + svg.id);
      }
    })
}

function setSvgAspectRatio(id, aspectRatio)
{
  var svg = document.getElementById(id); // get the relevant svg element
  if(svg.length != 0) // if an svg with this id exists...
  {
    var att = document.createAttributeNS(null, "preserveAspectRatio");
    att.value = aspectRatio;
    svg.setAttributeNode(att); // set preserveAspectRatio onto our svg
  }
  else
  {
    console.error("Cannot find element with id: " + svg.id);
  }
}


function generateRoad(numOfRoads, svgElement, initialYOneValue, initialYTwoValue)
{
  var $roadArray = [];
  var x1 = "x1";
  var x2 = "x2";
  var y1 = "y1";
  var y2 = "y2";
  var numOfLines = numOfRoads * 3;
  var evenShift = 27;
  var oddShift = 3;

  for(var i = 0; i < numOfLines; i+=3)
  {
    var topLine = document.createElementNS('http://www.w3.org/2000/svg','line');
    var middleLine = document.createElementNS('http://www.w3.org/2000/svg','line');
    var bottomLine = document.createElementNS('http://www.w3.org/2000/svg','line');

    var x1Value;
    var x2Value;

    var y1Value;
    var y2Value;

    if(i & 1) // check if the current i bit results in an odd number
    {

      // flip the values
      x1Value="100%";
      x2Value="0%";
      y1Value = initialYTwoValue;
      y2Value = initialYOneValue;
    }
    else
    {
      x1Value ="0%";
      x2Value = "100%";
      y1Value = initialYOneValue;
      y2Value = initialYTwoValue;
    }

    topLine.setAttribute('class', 'road-top');
    topLine.setAttribute(x1, x1Value);
    topLine.setAttribute(y1, "" + i + "%");
    topLine.setAttribute(x2, x2Value);
    topLine.setAttribute(y2, "" + i + "%");

    middleLine.setAttribute('class', 'road-middle');
    middleLine.setAttribute(x1, x1Value);
    middleLine.setAttribute(y1, "" + i + "%");
    middleLine.setAttribute(x2, x2Value);
    middleLine.setAttribute(y2, "" + i + "%");

    bottomLine.setAttribute('class', 'road-bottom');
    bottomLine.setAttribute(x1, x1Value);
    bottomLine.setAttribute(y1, "" + i + "%");
    bottomLine.setAttribute(x2, x2Value);
    bottomLine.setAttribute(y2, "" + i + "%");

    console.log(i);
    console.log(j);

    $roadArray[i] = topLine;
    $roadArray[i+1] = middleLine;
    $roadArray[i+2] = bottomLine;
    $(svgElement).append($roadArray);
  }


  // y1 and y2 incrementers switch on every new road
}



function Init()
{
  // animate the first elements on load
  /*Animate('planet', 'Animations/planet.json', 0, 300, 1920, 500, true, "xMidYMin meet");
  Animate('skill-anim-web-dev', 'Animations/skills-web-development.json', 0, 0, 1146, 670, true, "xMidYMid meet");
  Animate('skill-anim-html', 'Animations/skills-html.json');
  Animate('skill-anim-css', 'Animations/skills-css.json');
  Animate('skill-anim-jquery', 'Animations/skills-jquery.json');
  Animate('skill-anim-js', 'Animations/skills-javascript.json');
  Animate('skill-anim-animation', 'Animations/skills-animation.json');
  Animate('anim-rain-01', 'Animations/rain.json');
  Animate('anim-rain-02', 'Animations/rain.json');
  Animate('anim-rain-03', 'Animations/rain.json');
  Animate('anim-rain-04', 'Animations/rain.json');
  Animate('anim-city-flyover-one', 'Animations/city-flyover-one.json', 0, 0, 700, 300, true, "xMidYMax meet");
  Animate('anim-city-flyover-three', 'Animations/city-flyover-three.json', 0, 0, 700, 300, true, "xMidYMax meet");
  Animate('anim-city-flyover-five', 'Animations/city-flyover-five.json', 0, 0, 700, 300, true, "xMidYMax meet");
  */

/*
  Animate('skill-anim-web-dev', 'Animations/skills-web-development.json', true, "xMidYMax meet");
  Animate('skill-anim-html', 'Animations/skills-html.json', true, "xMidYMax meet");
  Animate('skill-anim-css', 'Animations/skills-css.json', true, "xMidYMax meet");
  Animate('skill-anim-jquery', 'Animations/skills-jquery.json', true, "xMidYMax meet");
  Animate('skill-anim-js', 'Animations/skills-javascript.json', true, "xMidYMax meet");
  Animate('skill-anim-animation', 'Animations/skills-animation.json', true, "xMidYMax meet");
*/


    Animate('planet', 'Animations/planet.json', true, "xMidYMin meet");
    Animate('skill-anim-web-dev', 'Animations/skills-web-development.json', true, "xMidYMid meet");
    Animate('skill-anim-html', 'Animations/skills-html.json', true, "xMidYMid meet");
    Animate('skill-anim-css', 'Animations/skills-css.json', true, "xMidYMid meet");
    Animate('skill-anim-jquery', 'Animations/skills-jquery.json', true, "xMidYMid meet");
    Animate('skill-anim-js', 'Animations/skills-javascript.json', true, "xMidYMid meet");
    Animate('skill-anim-animation', 'Animations/skills-animation.json', true, "xMidYMid meet");
    Animate('anim-rain-01', 'Animations/rain.json', true, "xMidYMid meet");
    Animate('anim-rain-02', 'Animations/rain.json', true, "xMidYMid meet");
    Animate('anim-rain-03', 'Animations/rain.json', true, "xMidYMid meet");
    Animate('anim-rain-04', 'Animations/rain.json', true, "xMidYMid meet");

  $(document).ready(function()
  {

    setSvgViewBox('skill-anim-web-dev', -500, -385, 2292, 1340);
    setSvgViewBox('skill-anim-html', -840, -220, 2292, 1340);
    setSvgViewBox('skill-anim-css', -450, -130, 2322, 1600);
    setSvgViewBox('skill-anim-jquery', -850, -320, 2292, 1340);
    setSvgViewBox('skill-anim-js', -860, -120, 2292, 1340);
    setSvgViewBox('skill-anim-animation', -510, -250, 2292, 1340);

    setSvgAspectRatio('blimp-web', "xMidYMid meet");
    setSvgAspectRatio('blimp-html', "xMidYMid meet");
    setSvgAspectRatio('blimp-css', "xMidYMid meet");
    setSvgAspectRatio('blimp-anim', "xMidYMid meet");
    setSvgAspectRatio('blimp-jquery', "xMidYMid meet");
    setSvgAspectRatio('blimp-js', "xMidYMid meet");


    // dynamic font sizing for blimps
    $("#blimp-web-font").fitText();
    $("#blimp-html-font").fitText();
    $("#blimp-css-font").fitText();
    $("#blimp-animation-font").fitText();
    $("#blimp-js-font").fitText();
    $("#blimp-jquery-font").fitText();
    // generateRoad(6, ".road", 13, 24);

  })

  // check the rest of the elements are on screen
  // CheckScrollPosition('skills-bm-animation', 'Animations/skills.json');
  // CheckScrollPosition('contact-bm-animation','Animations/contact.json');
}
