function convertPXtoRem(px) {
    return px / parseFloat(getComputedStyle(document.documentElement).fontSize);
}

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

function SetSVGViewBox(svgID, xOffset, yOffset, width, height)
{
    $(document).ready(function()
    {
      var svg = $(svgID); // get the svg we are working with
      if(svg.length != 0) // if a div with this id exists...
      {
        var viewBox = xOffset + " " + yOffset + " " + width + " " + height;
        svg.attr("viewBox", viewBox); // apply our viewbox
      }
      else
      {
        console.error("Cannot find element with id: " + svg.id);
      }
    })
}

function SetSVGAspectRatio(id, aspectRatio)
{
  var svg = document.getElementById(id); // get the relevant svg element
  if(svg.length != 0) // if an svg with this id exists...
  {
    var attr = document.createAttributeNS(null, "preserveAspectRatio");
    attr.value = aspectRatio;
    svg.setAttributeNode(attr); // set preserveAspectRatio onto our svg
  }
  else
  {
    console.error("Cannot find element with id: " + svg.id);
  }
}

function ResizeBlimpRect(element, scaledWidth, fullWidth, scaledHeight, fullHeight, scaledX, fullX, scaledY, fullY)
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

function AnimateBodymovin(element, data, bool, svgAspectRatio)
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
			progressiveLoad:true,
      preserveAspectRatio:svgAspectRatio
			},
			path: data
	};

  var anim;
	anim = bodymovin.loadAnimation(animData);
  bodymovin.setQuality('low');
}

function TranslateElement(element, minDuration, maxDuration, repeatEnabled, easing, force3dTranslate, yRandomMax, rotation)
{
  var _duration = RandomDurationGenerator(minDuration, maxDuration);
  var _element = $(element);
  var _elementParent = _element.parent();
  if(rotation == undefined)
  {
    rotation = 0;
  }
  if(yRandomMax == undefined)
  {
    yRandomMax = 70;
  }
  if(force3dTranslate == undefined)
  {
    force3dTranslate = false;
  }
  if(_elementParent.css('visibility') == 'hidden')
  {
    _elementParent.css('visibility', 'visible');
  }
  var _endX = _elementParent.outerWidth();
  var _firstCall = true;
  /// USE PERCENTAGES
  TweenLite.to(element, 10, {x: '100%', y: '100%',ease: easing, force3D: force3dTranslate, rotation: rotation});
  //TweenMax.to(element, _duration, {x: _endX, ease:easing,
    //onComplete: AnimateLoop, force3D:force3D});
  function AnimateLoop()
  {
    _endX = _elementParent.outerWidth();
    _duration = RandomDurationGenerator(minDuration, maxDuration);
    if(_firstCall) // prevent FOUC
    {
      // _element.css({'left' : '0%', 'top' : '0%'});
      _firstCall = false;
    }
    var _randomBool = GenerateRandomBool();
    var _startX = parentPercentageWidthToPixel(element, '-13%');
    var _randomY = Math.random() * yRandomMax;
    var _yValue = parentPercentageHeightToPixel(element, '' + _randomY + '%');
    TweenMax.fromTo(element, _duration, {x: (_randomBool == false ? _startX : _endX),
          y: _yValue}, {x: (_randomBool == false ? _endX : _startX), y: _yValue,
            ease:easing, onComplete:AnimateLoop, force3D:force3dTranslate});
  }
}

function GenerateRandomBool()
{
  return Math.random() >= 0.5;
}

function parentPercentageWidthToPixel(_elem, _perc){
  return ($(_elem).parent().outerWidth()/100)* parseFloat(_perc);
}

function parentPercentageHeightToPixel(_elem, _perc){
  return ($(_elem).parent().outerHeight()/100)* parseFloat(_perc);
}
function AnimateStroke(element, length, easing, optionals)
{
  var _svgElements = $(element).children(); // get all child elements from the div container
  console.log(_svgElements);
  var _scenarioType = 'delayed';
  var _startStype = 'inViewport';
  if(optionals !== undefined)
  {
    _scenarioType =  (typeof optionals.scenarioType === 'undefined') ? 'delayed' : optionals.scenarioType;
    _startStype = (typeof optionals.startType === 'undefined') ? 'inViewport' : optionals.startType;
  }
  var animElements = [];
  for(var i = 0; i < _svgElements.length; i++)
  {
    var _currentSVGElement = $(_svgElements[i]); // get current svg element from array
      var _isRoad = false;
      var _isPaper = false;
      var _id = $(element).attr('id');
      if(_id.substring(0, 4) == 'road')
      {
        _isRoad = true;
      }
      else if(_id.substring(0, 18) == 'paper-plane-line-0')
      {
        _isPaper = true;
      }
      animElements.push(new Vivus(_currentSVGElement[0], {duration: length, animTimingFunction:
        easing, type: _scenarioType, start: _startStype, onReady: function(){
          if(_isRoad || _isPaper)
          {
            $(element).css('visibility', 'visible');
            return;
          }
          SetFillToNone(_currentSVGElement);
          this.play(); // we can just play the element automatically if it's not a road
        }}));
      if(!_isRoad && !_isPaper)
      {
        SetFillToWhite(_currentSVGElement, length);
      }
    }
  return animElements;
}

function AnimateFoliageStroke(foliageElement, length, easing, optionals)
{
  var _scenarioType = 'delayed';
  if(optionals !== undefined)
  {
    _scenarioType = (typeof optionals.animType !== undefined) ? optionals.animType : _scenarioType;
  }
  foliageElement.children("svg").each(function()
  {
    var _svgElement = $(this); // svg element we are working with
    new Vivus(_svgElement[0], {duration: length, animTimingFunction: Vivus.LINEAR, type: _scenarioType,
    onReady: function()
    {
      SetFillToNone(_svgElement);
      RevealElementByClass('foliage-show', _svgElement.parent()); // set to visible by switching class
    }});
    SetFillToWhite(_svgElement, length);
  });
}

function RevealElementByClass(className, element)
{
  element.attr('class', className);
}

function SetFillToNone(element)
{
  element.find('path').attr('fill', 'none');
}

// a faster call than Vivus' built-in callbacks
// vivus for some reason takes a second after completion to call them
function SetFillToWhite(svgElement, duration)
{
  var _hasCompleted = false;
  var _timeout = null;
  var _currentSVGElement = svgElement;
  // for some reason using .css('fill', "white")
  // gets converted by jquery to an rgb value >:(
  // so to prevent the pain and suffering of debugging again
  // everything is set to the rgb value from the outset
  var _white = "rgb(255, 255, 255)";
  var strokeDashOffsetCheck = function()
  {
    var _paths = _currentSVGElement.find('path'); // find all the paths in our svg element

    _paths.each(function() // operate on each path
    {
      var _path = $(this); // the current path we are working with
      var _strokeDashOffset = _path.css('stroke-dashoffset'); // get the inline style we need
      // chrome specifies px units, so we need a separate check for that
      if(_strokeDashOffset  === '0' || _strokeDashOffset ==='0px') // upon completion of animation...
      {
        TweenLite.fromTo($(_path)[0], 1, {fill: _white, attr:{"fill-opacity":0}}, {attr:{"fill-opacity":1}});
        /*d3.select($(_path)[0]).style('fill', _white).style('fill-opacity', '0').transition().
        duration(duration + 700).style('fill-opacity', '1');*/
        // set the offset to a tiny number that is not 0
        _path.css({"stroke-dashoffset": Number.EPSILON});
      }
    });
     if(_paths.last().css('fill') === _white)
     {
       _hasCompleted = true;
     }
     if(!_hasCompleted)
     {
       _timeout = setTimeout(strokeDashOffsetCheck, 100);
     }
     else
     {
       clearTimeout(_timeout);
     }
  }
  strokeDashOffsetCheck();
}

function FadeInAnimation(element)
{
  $(element).css('visibility', 'visible');
  TweenLite.fromTo(element, 2, {opacity: 0},{opacity: 1})
  /*d3.select(element).style('opacity', 0).transition().
  duration(3500).style('opacity', 1);*/
}

function AnimateBalloon(element)
{
  TweenMax.fromTo(element, 1, {y: '0%'}, {y: '1%', ease: Sine.easeInOut ,repeat: -1, yoyo: true});
}

function GeneratePaperPlaneLines(element)
{
  var _vivus = AnimateStroke(element, 80, Vivus.LINEAR, {startType: 'manual'});
  for(var i = 0; i < _vivus.length; i++)
  {
    _vivus[i].play();
  }
}

function SetRoadIDs(roadContainerElement)
{
  var i = 2;
  $(roadContainerElement).children().slice(1).each(function()
  {
    $(this).attr('id', 'road-' + i);
    i++;
  });
}

function GenerateRoad(roadContainer)
{
  var _children = $(roadContainer).children().slice(1);
  _children.each(function()
  {
    var _roadElement = $(this);
    var waypoint = new Waypoint({
      element: this,
      handler: function(direction) {
        var vivus = AnimateStroke(_roadElement, 80, Vivus.LINEAR, {startType: 'manual'});
        for(var i = 0; i < vivus.length; i++)
        {
          vivus[i].play();
        }
        waypoint.disable();
      },
      triggerOnce: true,
      offset: '550'
    })

  });
}

function GenerateClouds(numberOfClouds, minDuration, maxDuration)
{
  if(numberOfClouds > 9)
  {
    numberOfClouds = 9;
    alert("you sure about generating 9 clouds? performance hog!")
  }
  var i = 0;
  for(i = 0; i < numberOfClouds; i++)
  {
    if(i < 3)
    {
      GenerateCloud('#cloud-01', i)
    }
    else
    {
      GenerateCloud('#cloud-group-three-01', i)
    }
  }

  function GenerateCloud(element, currentIndex)
  {
    /*
    // create cloud container
    var cloudContainer = $('<div/>',{
         id: 'cloud-generated-container-0' + (currentIndex + 1),
         class: 'cloud-generated-container'
     });
    // add the cloud container to the overall container
    cloudContainer.appendTo('#generated-clouds-container');*/
    // copy existing cloud
    var cloud = $(element).clone().attr('id', 'cloud-generated-sub-container-0' + (currentIndex + 1));
    cloud.attr('class','cloud-generated-sub-container');
    cloud.children().attr('id', 'cloud-background-generated-0' + (currentIndex + 1));
    // make them invisible before adding to the document
    // cloudContainer.css('visibility', 'hidden');
    // add to container we previously created
    cloud.appendTo('#generated-clouds-container');
    var _left = (Math.random() * 10 + '%');
    var _top = (Math.random() * 75 + '%');
    //cloud.css({'transform' : 'translate(' + _x + ', ' + _y + ')'});
    // cloud.css({'left' : _left, 'top' : _top})
    cloud.find('path').css('fill', 'red');
    // TranslateElement(cloud, minDuration, maxDuration , true, Linear.easeNone, false, 90, 0);
  }
}

function RandomDurationGenerator(min, max)
{
  return Math.max(min, Math.random() * max);
}

function Init()
{
  var duration = 180;
  var easing = Vivus.LINEAR;
  var minDuration = 9;
  var maxDuration = 16;
  // DO NOT CALL THIS BEFORE ANIMATESTROKE!!!!!!!!
  // GenerateClouds(6, 12, 20);

  //AnimateBodymovin('planet', 'Animations/planet.json', true, "xMidYMin meet");
  // AnimateBodymovin('skill-anim-web-dev', 'Animations/skills-web-development.json', true, "xMidYMid meet");
  //AnimateBodymovin('skill-anim-html', 'Animations/skills-html.json', true, "xMidYMid meet");
  //AnimateBodymovin('skill-anim-css', 'Animations/skills-css.json', true, "xMidYMid meet");
  //AnimateBodymovin('skill-anim-jquery', 'Animations/skills-jquery.json', true, "xMidYMid meet");
  //AnimateBodymovin('skill-anim-js', 'Animations/skills-javascript.json', true, "xMidYMid meet");
  //AnimateBodymovin('skill-anim-animation', 'Animations/skills-animation.json', true, "xMidYMid meet");
  //AnimateBodymovin('anim-rain-01', 'Animations/rain.json', true, "xMidYMid meet");
  //AnimateBodymovin('anim-rain-02', 'Animations/rain.json', true, "xMidYMid meet");
  //AnimateBodymovin('anim-rain-03', 'Animations/rain.json', true, "xMidYMid meet");
  //AnimateBodymovin('anim-rain-04', 'Animations/rain.json', true, "xMidYMid meet");
  //AnimateBodymovin('fire-01', 'Animations/fire.json', true, "xMidYMid meet");
  //AnimateBodymovin('fire-02', 'Animations/fire.json', true, "xMidYMid meet");

  /*SetRoadIDs('.road-container');
  SetSVGViewBox('#skill-anim-web-dev', -500, -385, 2292, 1340);
  SetSVGViewBox('#skill-anim-html', -840, -220, 2292, 1340);
  SetSVGViewBox('#skill-anim-css', -450, -130, 2322, 1600);
  SetSVGViewBox('#skill-anim-jquery', -850, -320, 2292, 1340);
  SetSVGViewBox('#skill-anim-js', -865, -140, 2292, 1340);
  SetSVGViewBox('#skill-anim-animation', -510, -250, 2292, 1340);

  SetSVGAspectRatio('blimp-web', "xMidYMid meet");
  SetSVGAspectRatio('blimp-html', "xMidYMid meet");
  SetSVGAspectRatio('blimp-css', "xMidYMid meet");
  SetSVGAspectRatio('blimp-anim', "xMidYMid meet");
  SetSVGAspectRatio('blimp-jquery', "xMidYMid meet");
  SetSVGAspectRatio('blimp-js', "xMidYMid meet");

  // dynamic font sizing for blimps
  $("#blimp-web-font").fitText();
  $("#blimp-html-font").fitText();
  $("#blimp-css-font").fitText();
  $("#blimp-animation-font").fitText();
  $("#blimp-js-font").fitText();
  $("#blimp-jquery-font").fitText();

  var intervalRate = 240;
  var resizeWebBlimp = ResizeBlimpRect("blimp-web-svg", 170, 126, 60, 35, 88, 108.8, 170, 188.6);
  //setInterval(resizeWebBlimp, intervalRate);
  var resizeHTMLBlimp = ResizeBlimpRect("blimp-html-svg", 70, 45, 40, 35, 158, 171.4, 150, 149.8);
  //setInterval(resizeHTMLBlimp, intervalRate);
  var resizeCSSBlimp = ResizeBlimpRect("blimp-css-svg", 50, 34, 60, 35, 148, 155.4, 131.3, 150.3 );
  //setInterval(resizeCSSBlimp, intervalRate);
  var resizeAnimationBlimp = ResizeBlimpRect("blimp-animation-svg", 100, 72, 60, 35, 123, 136.3, 130, 149.8);
  //setInterval(resizeAnimationBlimp, intervalRate);
  var resizeJqueryBlimp = ResizeBlimpRect("blimp-jquery-svg", 70, 54, 60, 35, 158, 165.2, 140.3, 157.1);
  //setInterval(resizeJqueryBlimp, intervalRate);
  var resizeJSBlimp = ResizeBlimpRect("blimp-js-svg", 97, 72, 60,35, 144, 154.6, 134, 150.3);
  //setInterval(resizeJSBlimp, intervalRate);
  */

  $(document).ready(function()
  {

    //TranslateElement('#cloud-rain-container', minDuration, maxDuration, true, Linear.easeNone, true);
    setTimeout(function()
    {
      // TranslateElement('#cloud-group-three-01-container', minDuration, maxDuration, true, Linear.easeNone, true, 60, 0.01);
    }, 250);
    //TranslateElement('#hot-air-balloon-web-container', minDuration, maxDuration, true, Linear.easeNone, true, 40);

    // put the first road separately for an automatic start without using waypoints
    //AnimateStroke('#road-01', duration - 120, Vivus.LINEAR, {startType: 'autostart'});
    // GenerateRoad('.road-container');

    setTimeout(function()
    {
      // AnimateStroke('#city-flatline', duration - 80, Vivus.LINEAR, {scenarioType: 'scenario-sync'});
    }, 250);

    //GeneratePaperPlaneLines('#paper-plane-line-01');
    //GeneratePaperPlaneLines('#paper-plane-line-02');
    //GeneratePaperPlaneLines('#paper-plane-line-03');
    //GeneratePaperPlaneLines('#paper-plane-line-04');
    //AnimateStroke('#cloud-01', duration - 100, Vivus.LINEAR);
    //AnimateStroke('#cloud-02', duration - 125, Vivus.LINEAR);
    //AnimateStroke('#cloud-03', duration - 150, Vivus.LINEAR);
    //AnimateStroke('#city-buildings', duration - 50, Vivus.LINEAR);
    //AnimateStroke('#cloud-background-01', duration, easing);
    //AnimateStroke('#cloud-background-02', duration - 100, easing);
    //AnimateStroke('#cloud-background-03', duration - 80, easing);
    //AnimateStroke('#hot-air-balloon-web', duration - 20, Vivus.LINEAR, {scenarioType: 'async'});
    //AnimateStroke('#hot-air-balloon-plain', duration - 125, Vivus.LINEAR, {scenarioType: 'oneByOne'});
    // AnimateFoliageStroke($('[class^=foliage]'), duration - 140, easing);
    //FadeInAnimation('#planet');
    //FadeInAnimation('#anim-rain-01');
    //setTimeout(function(){ FadeInAnimation('#anim-rain-02'); }, 3000);
    //setTimeout(function(){ FadeInAnimation('#anim-rain-03'); }, 3000);
    //setTimeout(function(){ FadeInAnimation('#anim-rain-04'); }, 3000);
    //setTimeout(function(){ FadeInAnimation('#anim-rain-05'); }, 3000);
    // setTimeout(function(){ AnimateBalloon('#hot-air-balloon-plain') }, 1000);




  })
}
