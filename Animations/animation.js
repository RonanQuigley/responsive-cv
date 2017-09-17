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

function convertPXtoRem(px) {
    return px / parseFloat(getComputedStyle(document.documentElement).fontSize);
}

function resizeBlimpSVGRect(element, scaledWidth, fullWidth, scaledHeight, fullHeight, scaledX, fullX, scaledY, fullY)
{
  // assign all parameters to closure var's
  var _element = $('.' + element);
  var _scaledWidth = scaledWidth;
  var _fullWidth = fullWidth;
  var _scaledHeight = scaledHeight;
  var _fullHeight = fullHeight;
  var _scaledX = scaledX;
  var _scaledY = scaledY;
  var _fullX = fullX;
  var _fullY = fullY;
  var _sizeReset = false; // when the size has been reset to full size; prevents unnecessary repeat function calls
  return function resizer() // performs the resizing for the given element
  {
    var _bodyMinWidth = $('body').css('min-width');
    if(_bodyMinWidth <= "320px" && _bodyMinWidth > "0px" && !_sizeReset)
    {
      _element.attr('width', _scaledWidth);
      _element.attr('height', _scaledHeight);
      _element.attr('x', '' + _scaledX);
      _element.attr('y', '' + _scaledY);
      _sizeReset = true;
    }
    else if(_bodyMinWidth == "0px" && _sizeReset)
    {
      _element.attr('width', _fullWidth);
      _element.attr('height', _fullHeight);
      _element.attr('x', '' + _fullX);
      _element.attr('y', '' + _fullY);
      _sizeReset = false;
    }

  }
};


function doSomething()
{
  $('#road-sign-01').each(function(){
      var img         = $(this);
      var image_uri   = img.attr('src');

      $.get(image_uri, function(data) {
          var svg = $(data).find('svg');
          svg.removeAttr('xmlns:a');
          img.replaceWith(svg);
      }, 'xml');
  });
}


function Init()
{

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
  Animate('fire-01', 'Animations/fire.json', true, "xMidYMid meet");
  Animate('fire-02', 'Animations/fire.json', true, "xMidYMid meet");


  $(document).ready(function()
  {
    console.log("hello");
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



    var refreshRate = 30;
    var resizeWebBlimp = resizeBlimpSVGRect("blimp-web-svg", 170, 126, 60, 35, 88, 108.8, 170, 188.6);
    setInterval(resizeWebBlimp, refreshRate);
    var resizeHTMLBlimp = resizeBlimpSVGRect("blimp-html-svg", 70, 45, 40, 35, 158, 171.4, 150, 149.8);
    setInterval(resizeHTMLBlimp, refreshRate);
    var resizeCSSBlimp = resizeBlimpSVGRect("blimp-css-svg", 50, 34, 60, 35, 148, 155.4, 131.3, 150.3 );
    setInterval(resizeCSSBlimp, refreshRate);
    var resizeAnimationBlimp = resizeBlimpSVGRect("blimp-animation-svg", 100, 72, 60, 35, 123, 136.3, 130, 149.8);
    setInterval(resizeAnimationBlimp, refreshRate);
    var resizeJqueryBlimp = resizeBlimpSVGRect("blimp-jquery-svg", 70, 54, 60, 35, 158, 165.2, 140.3, 157.1);
    setInterval(resizeJqueryBlimp, refreshRate);
    var resizeJSBlimp = resizeBlimpSVGRect("blimp-js-svg", 97, 72, 60,35, 144, 154.6, 134, 150.3);


    // doSomething();

  })

}
