function Animate(element, data, xOffset, yOffset, width, height, bool, svgAspectRatio)
{

  if(width === undefined)
  {
    width = 1920;
  }
  if(height === undefined)
  {
    height = 1080;
  }
  if(xOffset === undefined)
  {
    xOffset = 0;
  }
  if(yOffset === undefined)
  {
    yOffset = 0;
  }

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

  /*anim.addEventListener('DOMLoaded', function()
  {
    var svg = elem.querySelector('.bodymovin svg');
    var args = [xOffset, yOffset, width, height];
    svg.setAttribute('viewBox', args.join(' ').toString());
    svg.setAttribute('height', '' + height);
  });*/
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

function Init()
{
  // animate the first elements on load
  Animate('planet', 'Animations/planet.json', 0, 300, 1920, 500, true, "xMidYMin meet");
  Animate('skill-anim-web-dev', 'Animations/skills-web-development.json');
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


  // check the rest of the elements are on screen
  // CheckScrollPosition('skills-bm-animation', 'Animations/skills.json');
  // CheckScrollPosition('contact-bm-animation','Animations/contact.json');
}
