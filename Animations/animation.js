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
  })

  // check the rest of the elements are on screen
  // CheckScrollPosition('skills-bm-animation', 'Animations/skills.json');
  // CheckScrollPosition('contact-bm-animation','Animations/contact.json');
}
