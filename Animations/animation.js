function convertPXtoRem(px) {
    return px / parseFloat(getComputedStyle(document.documentElement).fontSize);
}

function getRandomArbitrary(min, max) {
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
  var _bodyMinWidth = $('body').css('min-width');
  if(_bodyMinWidth <= "320px" && _bodyMinWidth > "0px" && !_sizeReset)
  {
    _element.attr({width : _scaledWidth, height: _scaledHeight, x: _scaledX, y: _scaledY});
    _sizeReset = true;
  }
  else if(_bodyMinWidth == "0px" && _sizeReset)
  {
    _element.attr({width : _fullWidth, height: _fullWidth, x: _fullX, y: _fullY});
    _sizeReset = false;
  }
  /*
  if(_bodyMinWidth <= "320px" && _bodyMinWidth > "0px" && !_sizeReset)
  {
    _element.attr({'width'}'width', _scaledWidth);
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
  */
};

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

function BodymovinWayPoint(container, animations)
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

function WidthPercentageToPixel(_elem, _perc){
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
  var animElements = []; // each of our svgs will be stored in an array for f() returning
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
      else if(_id.substring(0, 18) == 'paper-plane-line-0')
      {
        _isPaper = true;
      }
      animElements.push(new Vivus(_currentSVGElement[0], {duration: length, animTimingFunction:
        easing, type: _scenarioType, start: _startStype, onReady: function(){
          if(_isRoad || _isPaper)
          {
            _element.css('visibility', 'visible');
            return;
          }
          SetFillToNone(_currentSVGElement);
          if(_id == 'city-buildings')
          {
            this.play(1, function(){
              // GenerateClouds(6, 12, 20)
              TranslateElement('#cloud-group-three-01', 15, 20, true, Linear.easeNone, true, 60, 0.01);
            });
          }
          else
          {
            this.play(); // we can just play the element automatically
          }
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
    new Vivus(_svgElement[0], {duration: length, animTimingFunction: easing, scenarioType: _scenarioType,
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
  var _foliageChildren = $(_foliage).children();
  for(var i = 0; i < _foliageChildren.length; i++)
  {
    var _currentFoliage = _foliageChildren[i];
    if($(_currentFoliage).css('display') != 'none')
    {
      GenerateFoliageWaypoint(_currentFoliage);
    }
  }
}

function FadeInAnimation(element)
{
  $(element).css('visibility', 'visible');
  TweenLite.fromTo(element, 2, {opacity: 0},{opacity: 1})
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
    /*
    if(i == 0)
    {
      $(_children[i]).css('top', '' + (37 * (i + 1)) + 'rem');
    }
    else
    {
      $(_children[i]).css('top', '' + (70 * (i) + 68 * 0.5 - 10) + 'rem');
    }*/
    GenerateRoadWaypoint(_children[i]);
  }
}

function GenerateRoadWaypoint(roadElement)
{
  var waypoint = new Waypoint({
    element: roadElement,
    handler: function(direction) {
      var vivus = AnimateStroke(roadElement, 50, Vivus.LINEAR,
      {startType: 'manual', scenarioType: 'delayed'});
      // iterate over each path i
      for(var i = 0; i < vivus.length; i++)
      {
        vivus[i].play();
      }
      waypoint.disable();
    },
    offset: '750'
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
      RevealElementByClass('foliage-show', _foliageElement); // set to visible by switching class
      var timeline = new TimelineMax();
      timeline.append(TweenMax.fromTo(foliageElement, 0.3,
        {scaleY: 0.0, force3D: _force3D, rotation: 0.00001}, {scaleY: 1.05, force3D: _force3D, rotation: 0.00001})).
        to(foliageElement, 0.3, {scaleY: 1, force3D: _force3D, rotation: 0.00001});
      waypoint.destroy();
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

  // remove the unnecessary cloud group
  // $('#cloud-group-three-01').parent().remove();

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
    // all clouds just have an incremented id
    // _copiedCloud.children().attr('id', 'cloud-background-generated-0' + (currentIndex + 1));
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
  var _elementTimeline = new TimelineMax({repeat:-1, paused: true, yoyo: true});
  var _email = $('#email');
  var _emailContainer = $('#cloud-contact-01');
  var _emailBox = $('#email-box');
  _elementTimeline.add(TweenMax.fromTo(_email, 0.15, {rotation: 10}, {rotation: -10, ease: Linear.easeNone}));
  TweenLite.to(_email, 0, {rotation: 0}); // timeline initially pauses at a rotation of 10; we don't want that
  $(_emailContainer.hover(function()
  {
    // animate the box which contains the email text
    TweenLite.to(_emailBox, 0.1, {y: 140, force3D: "auto"});
    // console.log("rotate email");
    TweenLite.to(_email, 0.1, {rotation: 10, force3D: "auto", ease: Linear.easeNone, onComplete: function()
    {
      // console.log("rotating");
      _elementTimeline.restart();
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
  var _element = $('#phone');
  var _elementContainer = $('#cloud-contact-03');
  // console.log(_elementContainer);
  var _phoneBox = $('#phone-box');
  TweenLite.to(_element, 0, {rotation: 0.000001}); // timeline initially pauses at a rotation of 10; we don't want that
  $(_elementContainer.hover(function()
  {
    // console.log("HOVER PHONE");
    // animate the box which contains the email text
    TweenLite.to(_phoneBox, 0.1, {y: 140, force3D: "auto"});
  }, function()
  {
    TweenLite.to(_phoneBox, 0.2, {y: 100, force3D: "auto"});
  }));
}

function Init()
{

  // TranslateElement('#cloud-rain', 20, 20, true, Linear.easeNone, true, 60, 0.01);
  var skillAnims = [];
  var introAnims = [];
  var fireAnimA = [];
  var fireAnimB = [];

  skillAnims.push(AnimateBodymovin('skill-anim-web-dev', 'Animations/skills-web-development.json', true, "xMidYMid meet", false));
  skillAnims.push(AnimateBodymovin('skill-anim-html', 'Animations/skills-html.json', true, "xMidYMid meet", false));
  skillAnims.push(AnimateBodymovin('skill-anim-css', 'Animations/skills-css.json', true, "xMidYMid meet", false));
  skillAnims.push(AnimateBodymovin('skill-anim-jquery', 'Animations/skills-jquery.json', true, "xMidYMid meet", false));
  skillAnims.push(AnimateBodymovin('skill-anim-js', 'Animations/skills-javascript.json', true, "xMidYMid meet", false));
  skillAnims.push(AnimateBodymovin('skill-anim-animation', 'Animations/skills-animation.json', true, "xMidYMid meet", false));
  // introAnims.push(AnimateBodymovin('anim-rain-01', 'Animations/rain.json', true, "xMidYMid meet", false));
  introAnims.push(AnimateBodymovin('planet', 'Animations/planet.json', true, "xMidYMin meet", false));
  //AnimateBodymovin('anim-rain-02', 'Animations/rain.json', true, "xMidYMid meet");
  //AnimateBodymovin('anim-rain-03', 'Animations/rain.json', true, "xMidYMid meet");
  //AnimateBodymovin('anim-rain-04', 'Animations/rain.json', true, "xMidYMid meet");
  fireAnimA[0] = AnimateBodymovin('fire-01', 'Animations/fire.json', true, "xMidYMid meet", false);
  fireAnimB[0] = AnimateBodymovin('fire-02', 'Animations/fire.json', true, "xMidYMid meet", false);
  SetRoadIDs('.road-container');

  SetSVGAspectRatio('blimp-web', "xMidYMid meet");
  SetSVGAspectRatio('blimp-html', "xMidYMid meet");
  SetSVGAspectRatio('blimp-css', "xMidYMid meet");
  SetSVGAspectRatio('blimp-anim', "xMidYMid meet");
  SetSVGAspectRatio('blimp-jquery', "xMidYMid meet");
  SetSVGAspectRatio('blimp-js', "xMidYMid meet");

  $(document).ready(function()
  {
    SetSVGViewBox('#skill-anim-web-dev', -500, -385, 2292, 1340);
    SetSVGViewBox('#skill-anim-html', -840, -220, 2292, 1340);
    SetSVGViewBox('#skill-anim-css', -450, -130, 2322, 1600);
    SetSVGViewBox('#skill-anim-jquery', -850, -320, 2292, 1340);
    SetSVGViewBox('#skill-anim-js', -865, -140, 2292, 1340);
    SetSVGViewBox('#skill-anim-animation', -510, -250, 2292, 1340);

    BodymovinWayPoint('#skills-container', skillAnims);
    BodymovinWayPoint('#intro-container', introAnims);
    BodymovinWayPoint('#fire-01', fireAnimA);
    BodymovinWayPoint('#fire-02', fireAnimB);

    OnHoverOverEmail();
    OnHoverOverPhone();

    var duration = 180;
    var easing = Vivus.LINEAR;
    var minDuration = 12;
    var maxDuration = 18;
    // DO NOT CALL THIS BEFORE ANIMATESTROKE!!!!!!!!
    // GenerateClouds(6, 12, 20);

    // AnimateBalloon('#hot-air-balloon-web', 2, '0%', '2%');

    /* ------------------ ROAD STROKES ----------------- */
    // put the first road separately for an automatic start without using waypoints
    AnimateStroke('#road-01', duration - 120, easing, {startType: 'autostart'});
    GenerateRoad($('.road-container'));
    AnimateStroke('#city-flatline', duration - 80, easing, {scenarioType: 'scenario-sync'});
    AnimateStroke('#cloud-background-stroked-01', duration - 75, easing);
    AnimateStroke('#cloud-background-stroked-02', duration - 125, easing);
    AnimateStroke('#cloud-background-stroked-03', duration - 100, easing);
    AnimateStroke('#city-buildings', duration - 50, easing);
    AnimateStroke('#hot-air-balloon-web', duration - 90, easing);
    PopInFoliage($('#foliage-container'));
    FadeInAnimation('#planet');
    FadeInAnimation('#anim-rain-01');
    //setTimeout(function(){ FadeInAnimation('#anim-rain-02'); }, 3000);
    //setTimeout(function(){ FadeInAnimation('#anim-rain-03'); }, 3000);
    //setTimeout(function(){ FadeInAnimation('#anim-rain-04'); }, 3000);
    //setTimeout(function(){ FadeInAnimation('#anim-rain-05'); }, 3000);
    setTimeout(function(){
      AnimateBalloon('#hot-air-balloon-plain', 1, '0%', '0.75%')
    }, 1000);

    var _movementDuration = 0.75;
/*
    MoveElement('#about-content-01', '#about-container', _movementDuration);
    MoveElement('#about-content-02', '#about-container', _movementDuration);
    MoveElement('#about-content-03', '#about-container', _movementDuration);
    MoveElement('#about-content-04', '#about-container', _movementDuration);
    MoveElement('#skills-web-development', '#skills-container', _movementDuration);
    MoveElement('#skills-html', '#skills-container', _movementDuration);
    MoveElement('#skills-css', '#skills-container', _movementDuration);
    MoveElement('#skills-js', '#skills-container', _movementDuration);
    MoveElement('#skills-animation', '#skills-container', _movementDuration);
    MoveElement('#skills-jquery', '#skills-container', _movementDuration);
    MoveElement('#skills-js', '#skills-container', _movementDuration);
    MoveElement('#skills-animation', '#skills-container', _movementDuration);
    MoveElement('#skills-jquery', '#skills-container', _movementDuration);
    MoveElement('#cloud-grouping-section', '#contact-container', _movementDuration);
    MoveElement('#email-section', '#contact-container', _movementDuration);
    MoveElement('#cv-section', '#contact-container', _movementDuration);
    MoveElement('#phone-section', '#contact-container', _movementDuration);
*/
    // dynamic font sizing for blimps
    $("#blimp-web-font").fitText();
    $("#blimp-html-font").fitText();
    $("#blimp-css-font").fitText();
    $("#blimp-animation-font").fitText();
    $("#blimp-js-font").fitText();
    $("#blimp-jquery-font").fitText();

  $(window).resize(function()
  {
    ResizeBlimpRect("blimp-web-svg", 170, 126, 60, 35, 88, 108.8, 170, 188.6);
    ResizeBlimpRect("blimp-html-svg", 70, 45, 40, 35, 158, 171.4, 150, 149.8);
    ResizeBlimpRect("blimp-css-svg", 50, 34, 60, 35, 148, 155.4, 131.3, 150.3 );
    ResizeBlimpRect("blimp-animation-svg", 100, 72, 60, 35, 123, 136.3, 130, 149.8);
    ResizeBlimpRect("blimp-jquery-svg", 70, 54, 60, 35, 158, 165.2, 140.3, 157.1);
    ResizeBlimpRect("blimp-js-svg", 97, 72, 60,35, 144, 154.6, 134, 150.3);
  })

    //MoveElement('#about-header-cloud-container', '#about-header', 0.6, '750');
    //MoveElement('#skills-header-container', '#skills-header', 0.6, '750');
    //MoveElement('#contact-header-cloud-container', '#contact-header', 0.6, '750');

    /*
    setTimeout(function()
    {
      //TranslateElement('#cloud-group-three-01-container', minDuration,
      //maxDuration, true, Linear.easeNone, true, 60, 0.01);
    }, 250)
    */
  })
}
