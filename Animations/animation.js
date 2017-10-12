function convertPXtoRem(px)
{
    return px / parseFloat(getComputedStyle(document.documentElement).fontSize);
}

function getRandomArbitrary(min, max)
{
  return Math.random() * (max - min) + min;
}

function SetSVGViewBox(svgID, xOffset, yOffset, width, height)
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

function GetFullSizedSVGRectValues(element)
{
  var _element = $(element);
  var _x = _element.attr('x');
  var _y = _element.attr('y');
  var _width = _element.attr('width');
  var _height = _element.attr('height');
  var _obj =
  {
    fullX : _x,
    fullY : _y,
    fullWidth : _width,
    fullHeight : _height
  };
  return _obj;
}

function ResizeSVGTextRectangle(element, scaledWidth, fullWidth,
  scaledHeight, fullHeight, scaledX, fullX, scaledY, fullY)
{
  var _element = $('.' + element);
  var _bodyMinWidth = $('body').css('min-width');
  if(_bodyMinWidth <= "320px" && _bodyMinWidth > "0px")
  {
    _element.attr({width : scaledWidth, height: scaledHeight, x: scaledX, y: scaledY});
  }
  else if(_bodyMinWidth == "0px")
  {
    _element.attr({width : fullWidth, height: fullHeight, x: fullX, y: fullY});
  }
}

function AnimateBodymovin(element, data, bool, svgAspectRatio, autoPlay)
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
			autoplay: autoPlay,
			rendererSettings: {
			progressiveLoad:true,
      preserveAspectRatio:svgAspectRatio
			},
			path: data
	};
  var anim;
	anim = bodymovin.loadAnimation(animData);
  bodymovin.setQuality('low');
  return anim;
}

function CheckIfAnimationIsOnScreen(container, animations)
{
  var i = 0;
  var waypoint = new Waypoint.Inview({
    element: container,
    enter: function()
    {
      for(i = 0; i < animations.length; i++)
      {
        animations[i].play();
      }
    },
    exited: function()
    {
      for(i = 0; i < animations.length; i++)
      {
        animations[i].pause();
      }
    }
  });
}

function TranslateElement(element, minDuration, maxDuration, repeatEnabled, easing, force3dTranslate, yRandomMax, rotation)
{
  var _currentElement = $(element); // the current element we wish to translate
  var _parentElement = _currentElement.parent();
  var _flipStart = false; // used for starting on the opposite side of the page
  var _randomX = 0; // randomisation on the x axis
  var _startX = 0;
  var _endX = 0;
  var _randomY = 0; // randoomisation on the y axis
  var _yValue = 0; // resultant y value we wish to go to
  var _duration = 0;
  var _tween = null;
  function InitialiseVariables()
  {
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
    if(_currentElement.css('visibility') == 'hidden')
    {
      _currentElement.css('visibility', 'visible');
    }
  }
  // used to know when we can pause the animation
  function CheckIfElementIsOnScreen()
  {
    var waypoint = new Waypoint.Inview({
      element: _parentElement,
      enter: function() // element is on screen
      {
        if(_tween != null)
        {
          _tween.resume();
        }
        else
        {
          console.error("Missing Tween Animation For: " + $(element).attr('id'));
        }
      },
      exited: function() // element is now off screen
      {
        if(_tween != null)
        {
          _tween.paused(true);
        }
        else
        {
          console.error("Missing Tween Animation For: " + $(element).attr('id'));
        }
      }
    });
  }
  function Translate()
  {
    _flipStart = GenerateRandomBool();
    _startX = WidthPercentageToPixel(_parentElement, '-40%');
    _endX = _parentElement.outerWidth(); // offset is due to the width of the clouds
    _randomY = Math.random() * yRandomMax;
    _yValue = HeightPercentageToPixel(element, '' + _randomY + '%');
    _duration = RandomDurationGenerator(minDuration, maxDuration);
    _tween = TweenLite.fromTo(element, _duration, {x: (_flipStart == false ? _startX : _endX),
          y: _yValue, rotation: rotation}, {x: (_flipStart == false ? _endX : _startX), y: _yValue,
            ease:easing, force3D:force3dTranslate, onComplete:Translate});
  }
  function CheckForWindowResize()
  {
    $(window).resize(function()
    {
      _tween.kill(); // kill the animating tween
      Translate();
    })
  }
  InitialiseVariables();
  CheckIfElementIsOnScreen();
  Translate();
  CheckForWindowResize();
}

function MoveElement(element, sectionContainer, duration, screenOffset)
{
  function SetMoveDirection(container, endingValue)
  {
    // console.log("container is: " + $(container).attr('id'));
    // console.log("endingValue for element " + $(element).attr('id') + " is: " + endingValue );
    // console.log("container outer width / 2: " + container.outerWidth() / 2);
    if(parseFloat(endingValue) >= (container.innerWidth() / 2) - 150)
    {
      // console.log("element: " + $(element).attr('id') + " starts on right hand side");
      // console.log("return value for Width % to pixel is: " + WidthPercentageToPixel(container, '100%'));
      return WidthPercentageToPixel(container, '100%');
    }
    else
    {
      // console.log("element: " + $(element).attr('id') + " starts on left hand side");
      // console.log("return value for Width % to pixel is: " + WidthPercentageToPixel(container, '100%'));
      return WidthPercentageToPixel(container, '-30%');
    }
  }
  if(offset = undefined)
  {
    offset = '650';
  }
  var _element = $(element); // convert to jquery object
  _element.css('visibility', 'hidden'); // hide the element initially
  var _endX = _element.css('left'); // take the current css position to use as our ending position
  var _yValue = _element.css('top'); // take the current css position to use as our ending position
  var _tween = null;
  var _startX = 0;
  var _sectionContainer = sectionContainer;
  // We use a waypoint to trigger it when it appears on screen
  var waypoint = new Waypoint({
    element: element,
    handler: function(direction) {
      _element.css('visibility', 'initial');
      function Move()
      {
        _startX = SetMoveDirection($(_sectionContainer), _endX);
        // console.log("Start X value for: " + $(_element).attr('id') + " is: " + _startX);
        // console.log("");
        _element.css({"left": "inherit", "top" : "inherit"});
        _tween = TweenMax.fromTo(element, duration, {x: _startX, y:_yValue, scale: 1,
          force3D: "auto"}, {x: _endX, y: _yValue, scale: 1, force3D:"auto"});
      }
      $(window).resize(function()
      {
        _tween.kill();
        _startX = SetMoveDirection($(_sectionContainer), _endX);
        _element.attr('style', '').css({"left": "inherit", "top" : "inherit"});
        TweenLite.to(element, 0, {x:_startX});
        waypoint.enable();
      })
      Move();
      waypoint.disable();
    },
    offset: screenOffset
  });
}

function GenerateRandomBool()
{
  return Math.random() >= 0.5;
}

function WidthPercentageToPixel(_elem, _perc)
{
  return ($(_elem).outerWidth()/100)* parseFloat(_perc);
}

function HeightPercentageToPixel(_elem, _perc){
  var _parentElementHeight = $(_elem).parent().outerHeight();
  if(_parentElementHeight != 0)
  {
    return (_parentElementHeight / 100) * parseFloat(_perc);
  }
  else
  {
    return ($("body").outerHeight() / 100) * parseFloat(_perc);
  }
}

function AnimateStroke(element, length, easing, optionals)
{
  var _element = $(element);
  var _svgElements = _element.children(); // get all child elements from the div container
  var _scenarioType = 'delayed';
  var _startStype = 'inViewport';
  var _animElements = []; // each of our svgs will be stored in an array for f() returning
  if(optionals !== undefined)
  {
    _scenarioType =  (typeof optionals.scenarioType === 'undefined') ? 'delayed' : optionals.scenarioType;
    _startStype = (typeof optionals.startType === 'undefined') ? 'inViewport' : optionals.startType;
  }
  for(var i = 0; i < _svgElements.length; i++)
  {
    var _currentSVGElement = $(_svgElements[i]); // get current svg element from array
      var _isRoad = false;
      var _isPaper = false;
      var _id = _element.attr('id');
      if(_id.substring(0, 4) == 'road')
      {
        _isRoad = true;
      }
      _animElements.push(new Vivus(_currentSVGElement[0], {duration: length, animTimingFunction:
        easing, type: _scenarioType, start: _startStype, onReady:
        function()
        {
          if(_isRoad)
          {
            _element.css('visibility', 'visible');
            return;
          }
          SetFillToNone(_currentSVGElement);
          this.play(); // we can just play the element automatically
          }
        },
        function()
        {
          if(_id == 'city-buildings')
          {
          TranslateElement('#cloud-group-three-01', 15, 20, true, Linear.easeNone, false, 60, 0.01);
          }
        }
        ));
      if(!_isRoad && _id != 'city-flatline')
      {
        SetFillToWhite(_currentSVGElement, length);
      }
    }
  return _animElements;
}

function IsOrientatedLandscape()
{
  if(window.innerWidth > window.innerHeight){
      return true;
  }
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
  // gets converted by jquery to an rgb value
  // => everything is set to the rgb value from the outset
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

function PopInFoliage(foliage)
{
  var _foliage = $(foliage);
  if(_foliage.css('display') != "none")
  {
    var _foliageChildren = $(_foliage).children();
    for(var i = 0; i < _foliageChildren.length; i++)
    {
      var _currentFoliage = _foliageChildren[i];
      GenerateFoliageWaypoint(_currentFoliage);
    }
  }
}

function FadeInAnimation(element, duration)
{
  $(element).css('visibility', 'visible');
  TweenLite.fromTo(element, duration, {opacity: 0},{opacity: 1, ease: Power1.easeIn})
}

function AnimateBalloon(element, duration, minHeight, maxHeight)
{
  var _tween = TweenMax.fromTo(element, duration, { y: minHeight, force3D: true},
    {y: maxHeight, ease: Sine.easeInOut , repeat: -1, yoyo: true, rotation: 0.01,
      force3D: true, paused: true});
  var waypoint = new Waypoint.Inview({
    element: element,
    enter: function()
    {
      _tween.play();
    },
    exited: function()
    {
      _tween.paused(true);
    }
  });
}

function GeneratePaperPlaneLines(element)
{
  var _vivus = AnimateStroke(element, 80, Vivus.LINEAR, {startType: 'inViewport'});
  for(var i = 0; i < _vivus.length; i++)
  {
    _vivus[i].play();
  }
}

function SetRoadIDs(roadContainerElement)
{
  var _roadContainerChildren = $(roadContainerElement).children().slice(1);
  for(var i = 0; i < _roadContainerChildren.length; i++)
  {
    $(_roadContainerChildren[i]).attr('id', 'road-0' + (i + 2))
  }
}

function GenerateRoad(roadContainer)
{
  var _children = roadContainer.children().slice(1);
  for(var i = 0; i < _children.length; i++)
  {
    GenerateRoadWaypoint(_children[i]);
  }
}

function GenerateRoadWaypoint(roadElement)
{
  var waypoint = new Waypoint({
    element: roadElement,
    handler: function(direction) {
      var vivus = AnimateStroke(roadElement, 40, Vivus.LINEAR,
      {startType: 'manual', scenarioType: 'delayed'});
      // iterate over each path i
      for(var i = 0; i < vivus.length; i++)
      {
        vivus[i].play();
      }
      waypoint.disable();
    },
    offset: '83%'
  });
}

function GenerateFoliageWaypoint(foliageElement)
{
  var _force3D = "auto";
  var _foliageElement= $(foliageElement); // create a jquery object
  var _offset = _foliageElement.attr('id') == 'vegetation-group-02' ? '900' : '650';
  var waypoint = new Waypoint({
    element: foliageElement,
    handler: function(direction) {
      if(_foliageElement.css('display') != 'none') // fail safe to prevent unnecessary transformations on mobile browsers
      {
        RevealElementByClass('foliage-show', _foliageElement); // set to visible by switching class
        var timeline = new TimelineMax();
        timeline.append(TweenMax.fromTo(foliageElement, 0.3,
          {scaleY: 0.0, force3D: _force3D, rotation: 0.00001}, {scaleY: 1.05, force3D: _force3D, rotation: 0.00001})).
          to(foliageElement, 0.3, {scaleY: 1, force3D: _force3D, rotation: 0.00001});
        waypoint.disable();
      }
    },
    offset: _offset
  });
}

function GenerateClouds(numberOfClouds, minDuration, maxDuration)
{
  if(numberOfClouds % 2 != 0)
  {
    numberOfClouds -= 1; // we need to work with even numbers for this
    // console.log("Number Of Clouds must be a multiple of 2; reducing requested amount by 1");
  }
  var _numOfCloudsHalved = numberOfClouds / 2;
  var _generatedCloudsContainer = $('#generated-clouds-container');
  for(var i = 0; i < numberOfClouds; i++)
  {
    if(i < _numOfCloudsHalved)
    {
      GenerateCloud('#cloud-01', i, minDuration, maxDuration, _generatedCloudsContainer)
    }
    else
    {
      GenerateCloud('#cloud-group-three-01', i, minDuration, maxDuration, _generatedCloudsContainer)
    }
  }

  function GenerateCloud(element, currentIndex, minDuration, maxDuration, container)
  {
    var _repeateEnabled = true;
    var _force3DTranslate = true;
    var _rotation = 0.00001;
    var _yRandomMax = 95;
    // copy the cloud we want then change its ID
    var _cloudToCopy = $(element);
    var _copiedCloud = _cloudToCopy.clone();
    // apply a unique class depending on the type of cloud we copied
    if(_cloudToCopy.attr('id') === "cloud-01")
    {
      _copiedCloud.attr({'class' : 'cloud-one-generated-sub-container', id : 'cloud-generated-sub-container-0' + (currentIndex + 1)});
    }
    else if(_cloudToCopy.attr('id') === "cloud-group-three-01")
    {
      _copiedCloud.attr({'class' : 'cloud-three-generated-sub-container', id : 'cloud-generated-sub-container-0' + (currentIndex + 1)});
      _copiedCloud.children().attr('class', 'clouds-generated-background');
    }
    // add to iterated container;
    var cloudContainer = $("<div>", {id: "cloud-generated-0" + (currentIndex + 1), "class" : "cloud-generated"});
    container.append(cloudContainer);
    _copiedCloud.appendTo(cloudContainer);
    var _left = (Math.random() * 10 + '%');
    var _top = (Math.random() * 75 + '%');
    _copiedCloud.find('path').css('fill', 'magenta');
    TranslateElement(_copiedCloud, minDuration, maxDuration ,
      _repeateEnabled, Linear.easeNone, _force3DTranslate, _yRandomMax, _rotation);
  }
}

function RandomDurationGenerator(min, max)
{
  return Math.max(min, Math.random() * max);
}

function OnHoverOverEmail()
{
  var _emailBox = $('#email-box');
  var _elementTimeline = new TimelineMax({repeat:-1, paused: true, yoyo: true});
  var _email = $('#email');
  var _emailContainer = $('#cloud-contact-01');
  _elementTimeline.add(TweenMax.fromTo(_email, 0.15, {rotation: 10}, {rotation: -10, ease: Linear.easeNone}));
  TweenLite.to(_email, 0, {rotation: 0}); // timeline initially pauses at a rotation of 10; we don't want that
  $(_emailContainer.hover(function()
  {
    // animate the box which contains the email text
    TweenLite.to(_emailBox, 0.1, {y: 140, force3D: "auto"});
    // console.log("rotate email");
    TweenLite.to(_email, 0.1, {rotation: 10, force3D: "auto", ease: Linear.easeNone, onComplete: function()
    {
      //_elementTimeline.restart();
    }});
  }, function()
  {
      TweenLite.to(_emailBox, 0.2, {y: 100, force3D: false});
      _elementTimeline.kill();
      // console.log("set back to normal");
      TweenLite.to(_email, 0.1, {rotation: 0});
  }));

}

function MoveChildElements(element, duration)
{
  var _parentElement = $(element);
  var _parentElementID = _parentElement.attr('id');
  var _parentElementChildren = _parentElement.children();
  var _sectionContainer = null;
  switch(_parentElementID)
  {
    case "about-header-cloud-container" :
    {
      _sectionContainer = '#about-header-cloud-container';
      // console.log("section container set to: " +  _sectionContainer);
      break;
    }
    case 'skills-header-container' :
    {
      _sectionContainer = '#skills-header-container';
      // console.log("section container set to: " +  _sectionContainer);
      break;
    }
    case 'contact-header-cloud-container' :
    {
      _sectionContainer = '#contact-header-cloud-container';
      // console.log("section container set to: " +  _sectionContainer);
      break;
    }
  }
  for(var i = 0; i < _parentElementChildren.length; i++)
  {
    MoveElement(_parentElementChildren[i], _sectionContainer, duration, '750');
  }
}

function OnHoverOverPhone()
{
  var _phoneBox = $('#phone-box');
  var _element = $('#phone');
  var _elementContainer = $('#cloud-contact-03');
  // console.log(_elementContainer);

  TweenLite.to(_element, 0, {rotation: 0.000001}); // timeline initially pauses at a rotation of 10; we don't want that
  $(_elementContainer.hover(function()
  {
    TweenLite.to(_phoneBox, 0.1, {y: 140, force3D: "auto"});
  }, function()
  {
    TweenLite.to(_phoneBox, 0.2, {y: 100, force3D: "auto"});
  }));
}

function Init()
{
  // fade in the whole page
  FadeInAnimation('body', 0.75);
  // IsOrientatedLandscape();


  var _skillAnims = [];
  var _introAnims = [];
  var fireAnimA = [];
  var fireAnimB = [];
  var duration = 180;
  var easing = Vivus.LINEAR;
  _skillAnims.push(AnimateBodymovin('skill-anim-web-dev', 'Animations/skills-web-development.json', true, "xMidYMid meet", false));
  _skillAnims.push(AnimateBodymovin('skill-anim-html', 'Animations/skills-html.json', true, "xMidYMid meet", false));
  _skillAnims.push(AnimateBodymovin('skill-anim-css', 'Animations/skills-css.json', true, "xMidYMid meet", false));
  _skillAnims.push(AnimateBodymovin('skill-anim-jquery', 'Animations/skills-jquery.json', true, "xMidYMid meet", false));
  _skillAnims.push(AnimateBodymovin('skill-anim-js', 'Animations/skills-javascript.json', true, "xMidYMid meet", false));
  _skillAnims.push(AnimateBodymovin('skill-anim-animation', 'Animations/skills-animation.json', true, "xMidYMid meet", false));
  _introAnims.push(AnimateBodymovin('planet', 'Animations/planet.json', true, "xMidYMin meet", false));
  fireAnimA[0] = AnimateBodymovin('fire-01', 'Animations/fire.json', true, "xMidYMid meet", false);
  fireAnimB[0] = AnimateBodymovin('fire-02', 'Animations/fire.json', true, "xMidYMid meet", false);
  SetRoadIDs('.road-container');
  SetSVGAspectRatio('blimp-web', "xMidYMid meet");
  SetSVGAspectRatio('blimp-html', "xMidYMid meet");
  SetSVGAspectRatio('blimp-css', "xMidYMid meet");
  SetSVGAspectRatio('blimp-anim', "xMidYMid meet");
  SetSVGAspectRatio('blimp-jquery', "xMidYMid meet");
  SetSVGAspectRatio('blimp-js', "xMidYMid meet");
  SetSVGViewBox('#skill-anim-web-dev', -500, -385, 2292, 1340);
  SetSVGViewBox('#skill-anim-html', -840, -220, 2292, 1340);
  SetSVGViewBox('#skill-anim-css', -450, -130, 2322, 1600);
  SetSVGViewBox('#skill-anim-jquery', -850, -320, 2292, 1340);
  SetSVGViewBox('#skill-anim-js', -865, -140, 2292, 1340);
  SetSVGViewBox('#skill-anim-animation', -510, -250, 2292, 1340);

/*
  var _startingRectValuesWeb = GetFullSizedSVGRectValues("#blimp-web-svg");
  var _startingRectValuesHtml = GetFullSizedSVGRectValues("#blimp-html-svg");
  var _startingRectValuesCss = GetFullSizedSVGRectValues("#blimp-css-svg");
  var _startingRectValuesAnim = GetFullSizedSVGRectValues("#blimp-animation-svg");
  var _startingRectValuesJquery = GetFullSizedSVGRectValues("#blimp-jquery-svg");
  var _startingRectValuesJS = GetFullSizedSVGRectValues("#blimp-js-svg");
*/


  ResizeSVGTextRectangle("blimp-web-svg", 170, 126, 60, 35, 88, 108.8, 170, 188.6);
  ResizeSVGTextRectangle("blimp-html-svg", 70, 45, 40, 35, 158, 171.4, 150, 149.8);
  ResizeSVGTextRectangle("blimp-css-svg", 50, 34, 60, 35, 148, 155.4, 131.3, 150.3 );
  ResizeSVGTextRectangle("blimp-animation-svg", 100, 72, 60, 35, 123, 136.3, 130, 149.8);
  ResizeSVGTextRectangle("blimp-jquery-svg", 70, 54, 60, 35, 158, 165.2, 140.3, 157.1);
  ResizeSVGTextRectangle("blimp-js-svg", 97, 72, 60,35, 144, 154.6, 134, 150.3);
  $(document).ready(function()
  {
    CheckIfAnimationIsOnScreen('#skills-container', _skillAnims);
    CheckIfAnimationIsOnScreen('#intro-container', _introAnims);
    CheckIfAnimationIsOnScreen('#fire-01', fireAnimA);
    CheckIfAnimationIsOnScreen('#fire-02', fireAnimB);
    PopInFoliage($('#foliage-container'));
    AnimateBalloon('#hot-air-balloon-plain', 1, '0%', '0.75%')
    AnimateBalloon('#hot-air-balloon-web', 2, '0%', '2%');
    // put the first road separately for an automatic start without using waypoints
    AnimateStroke('#road-01', duration - 120, easing, {startType: 'autostart'});
    GenerateRoad($('.road-container'));
    AnimateStroke('#city-flatline', duration - 80, easing, {scenarioType: 'scenario-sync'});
    AnimateStroke('#cloud-background-stroked-01', duration - 75, easing);
    AnimateStroke('#cloud-background-stroked-02', duration - 125, easing);
    AnimateStroke('#cloud-background-stroked-03', duration - 100, easing);
    AnimateStroke('#city-buildings', duration - 50, easing);

    // dynamic font sizing for blimps
    $("#blimp-web-font").fitText();
    $("#blimp-html-font").fitText();
    $("#blimp-css-font").fitText();
    $("#blimp-animation-font").fitText();
    $("#blimp-js-font").fitText();
    $("#blimp-jquery-font").fitText();

    // $('#email-text').fitText();
    // $('#phone-text').fitText();

    $(window).resize(function()
    {
      // IsOrientatedLandscape();
      ResizeSVGTextRectangle("blimp-web-svg", 170, 126, 60, 35, 88, 108.8, 170, 188.6);
      ResizeSVGTextRectangle("blimp-html-svg", 70, 45, 40, 35, 158, 171.4, 150, 149.8);
      ResizeSVGTextRectangle("blimp-css-svg", 50, 34, 60, 35, 148, 155.4, 131.3, 150.3 );
      ResizeSVGTextRectangle("blimp-animation-svg", 100, 72, 60, 35, 123, 136.3, 130, 149.8);
      ResizeSVGTextRectangle("blimp-jquery-svg", 70, 54, 60, 35, 158, 165.2, 140.3, 157.1);
      ResizeSVGTextRectangle("blimp-js-svg", 97, 72, 60,35, 144, 154.6, 134, 150.3);
      // ResizeSVGTextRectangle("email-rect", 175, 150, 50, 50, -12.5, 0, 0, 0);
      //ResizeBlimpRect("phone-rect", 97, 72, 60,35, 144, 154.6, 134, 150.3);
    })

    OnHoverOverEmail();
    OnHoverOverPhone();

  })
}
