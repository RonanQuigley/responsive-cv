function Animate(element, data, xOffset, yOffset, width, height, bool)
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
      preserveAspectRatio:"xMidYMid meet"
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
  Animate('planet', 'Animations/planet.json', 0, 300, 1920, 500, true);
  Animate('anim-skill-web-dev', 'Animations/skills-web-development.json');
  Animate('anim-skill-html', 'Animations/skills-html.json');
  Animate('anim-skill-css', 'Animations/skills-css.json');
  Animate('anim-skill-jquery', 'Animations/skills-jquery.json');
  Animate('anim-skill-js', 'Animations/skills-javascript.json');
  Animate('anim-skill-animation', 'Animations/skills-animation.json');
  Animate('anim-rain', 'Animations/rain.json');
  Animate('anim-city-flyover-one', 'Animations/city-flyover-one.json');
  Animate('anim-city-flyover-three', 'Animations/city-flyover-three.json');
  Animate('anim-city-flyover-five', 'Animations/city-flyover-five.json');


  // check the rest of the elements are on screen
  // CheckScrollPosition('skills-bm-animation', 'Animations/skills.json');
  // CheckScrollPosition('contact-bm-animation','Animations/contact.json');
}
