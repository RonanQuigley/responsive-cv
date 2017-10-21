var documentBody = $('body');
var documentWindow = $(window);
var startingWindowWidth = documentWindow.width();

function convertPXtoRem(px)
{
    return px / parseFloat(getComputedStyle(document.documentElement).fontSize);
}

function getRandomArbitrary(min, max)
{
  return Math.random() * (max - min) + min;
}

function AnimateBodymovin(element, data, svgAspectRatio, autoPlay)
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
			loop: true,
			autoplay: autoPlay,
			rendererSettings: {
    		progressiveLoad:true,
        preserveAspectRatio:svgAspectRatio,
        frameRate: 30
			},
			path: data
	};
  var anim;
	anim = bodymovin.loadAnimation(animData);
  bodymovin.setQuality(2); // the lowest possible quality
  return anim;
}

function CheckIfAnimationIsOnScreen(element, animation)
{
  var waypoint = new Waypoint.Inview({
    element: element,
    enter: function()
    {
      animation.play();
    },
    exited: function()
    {
      animation.stop();
    }
  });
}

function CheckIfStrokeAnimIsOnScreen(element, vivus)
{
  var waypoint = new Waypoint.Inview({
    element: element,
    enter: function()
    {
      vivus[0].play(1);
    },
    exited: function()
    {
      vivus[0].finish();
      waypoint.destroy();
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
    if(_currentElement.css('display') == 'none')
    {
      _currentElement.css('display', 'block');
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
    _endX = documentBody.outerWidth(); // offset is due to the width of the clouds
    _randomY = Math.random() * yRandomMax;
    _yValue = HeightPercentageToPixel(element, '' + _randomY + '%');
    _duration = RandomDurationGenerator(minDuration, maxDuration);
    _tween = TweenLite.fromTo(element, _duration, {x: (_flipStart == false ? _startX : _endX),
          y: _yValue, rotation: rotation}, {x: (_flipStart == false ? _endX : _startX), y: _yValue,
            ease:easing, force3D:force3dTranslate, onComplete:Translate});
  }
  function CheckForWindowResize()
  {
    documentWindow.resize(function()
    {
      if (HasWindowWidthChanged())
      {
        _tween.kill(); // kill the animating tween
        Translate();
      }
    })
  }
  InitialiseVariables();
  CheckIfElementIsOnScreen();
  Translate();
  CheckForWindowResize();
}

function HasWindowWidthChanged()
{
  if (documentWindow.width() != startingWindowWidth)
  {
    return true;
  }
  else
  {
    return false;
  }
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
    return (documentBody.outerHeight() / 100) * parseFloat(_perc);
  }
}

function HideElements(elementContainer)
{
  var _elementContainer = $(elementContainer);
  var _elementContainerChildren = _elementContainer.children();
  for(var i = 0; i < _elementContainerChildren.length; i++)
  {
    $(_elementContainerChildren[i]).css('visibility', 'hidden');
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
    var _id = _element.attr('id');
    if(_id.substring(0, 4) == 'road')
    {
      _isRoad = true;
    }
    _animElements.push(new Vivus(_currentSVGElement[0], {duration: length, animTimingFunction:
      easing, type: _scenarioType, start: _startStype, onReady:
      function() // called when the stroke is ready to run
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
      function() // called when the stroke animation has finished
      {
        if(_id == 'city-buildings')
        {
          var _documentWidth = optionals.documentWidth;
          if(_documentWidth != undefined)
          {
            if(_documentWidth < 480)
            {
              AnimateBalloon('#hot-air-balloon-web', 2, '0%', '2%', false);
            }
            else if(_documentWidth > 480 && _documentWidth <= 1024)
            {
              AnimateBalloon('#hot-air-balloon-web', 2, '0%', '2%', false);
              AnimateBalloon('#hot-air-balloon-plain', 1, '0%', '0.75%', true);
            }
          }
          //TranslateElement('#cloud-group-three-01', 15, 20, true, Linear.easeNone, true, 60, 0);
        }
        else if(!_isRoad && _id != 'city-flatline')
        {
          SetFillToWhite(_currentSVGElement, length);
        }
      }
      ));
    }
  return _animElements;
}

function SetFillToNone(element)
{
  element.find('path').attr('fill', 'none');
}

function SetFillToWhite(svgElement, duration)
{
  var _hasCompleted = false;
  var _timeout = null;
  var _currentSVGElement = svgElement;
  var _currentSVGElementParentID = _currentSVGElement.parent().attr('id');
  // for some reason using .css('fill', "white")
  // gets converted by jquery to an rgb value
  // => set to the rgb value from the outset
  var _white = "rgb(255, 255, 255)";
  if(_currentSVGElementParentID == 'hot-air-balloon-web')
  {
    var _path = _currentSVGElement.find('#_Ellipse_'); // we just need to animate one path's fill
    TweenLite.fromTo($(_path), 1, {fill: _white, attr:{"fill-opacity":0}}, {attr:{"fill-opacity":1}});
  }
  else
  {
    for(var i = 0; i < _paths.length; i++)
    {
      var _paths = _currentSVGElement.find('path'); // find all the paths in our svg element
      TweenLite.fromTo($(_paths[i])[0], 1, {fill: _white, attr:{"fill-opacity":0}}, {attr:{"fill-opacity":1}});
    }
  }
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

function AnimateBalloon(element, duration, minHeight, maxHeight, force3D)
{
  var _tween = TweenMax.fromTo(element, duration, { y: minHeight},
    {y: maxHeight, ease: Sine.easeInOut , repeat: -1, yoyo: true,
      force3D: force3D, paused: true});
  function CheckIfBalloonIsOnScreen()
  {
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
  CheckIfBalloonIsOnScreen();
}

function SetRoadIDs(roadContainerElement)
{
  var _roadContainerChildren = $(roadContainerElement).children().slice(1);
  for(var i = 0; i < _roadContainerChildren.length; i++)
  {
    $(_roadContainerChildren[i]).attr('id', 'road-0' + (i + 2))
  }
}

function GenerateRoad(roadContainer, bodyWidth)
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
  var _force3D = true;
  var _foliageElement= $(foliageElement); // create a jquery object
  var _offset = _foliageElement.attr('id') == 'vegetation-group-02' ? '90%' : '65%';
  var waypoint = new Waypoint({
    element: foliageElement,
    handler: function(direction) {
      if(_foliageElement.css('display') != 'none') // fail safe to prevent unnecessary transformations on mobile browsers
      {
        _foliageElement.css('visibility', 'visible');
        var timeline = new TimelineMax();
        timeline.append(TweenMax.fromTo(foliageElement, 0.3,
          {scaleY: 0.0, force3D: _force3D, rotation: 0}, {scaleY: 1.05, force3D: _force3D, rotation: 0})).
          to(foliageElement, 0.3, {scaleY: 1, force3D: _force3D, rotation: 0});
        waypoint.disable();
      }
    },
    offset: _offset
  });
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
  FadeInAnimation('body', 0.7);
  SetRoadIDs('#road-container');

  var _autoPlay = false;
  var _duration = 180;
  var _easing = Vivus.LINEAR;
  var _isMobileDevice;

  var _animWebDev = AnimateBodymovin('skill-anim-web-dev', 'scripts/skills-web-development.json', "xMidYMid meet", _autoPlay);
  var _animHTML = AnimateBodymovin('skill-anim-html', 'scripts/skills-html.json', "xMidYMid meet", _autoPlay);
  var _animCSS = AnimateBodymovin('skill-anim-css', 'scripts/skills-css.json', "xMidYMid meet", _autoPlay);
  var _animJquery = AnimateBodymovin('skill-anim-jquery', 'scripts/skills-jquery.json', "xMidYMid meet", _autoPlay);
  var _animJavascript = AnimateBodymovin('skill-anim-js', 'scripts/skills-javascript.json', "xMidYMid meet", _autoPlay);
  var _animAnimation = AnimateBodymovin('skill-anim-animation', 'scripts/skills-animation.json', "xMidYMid meet", _autoPlay);
  // this optimisation actually causes jank on iPad so only do it for large displays

  CheckIfAnimationIsOnScreen('#skills-web-development', _animWebDev);
  CheckIfAnimationIsOnScreen('#skills-html', _animHTML);
  CheckIfAnimationIsOnScreen('#skills-css', _animCSS);
  CheckIfAnimationIsOnScreen('#skills-jquery', _animJquery);
  CheckIfAnimationIsOnScreen('#skills-js', _animJavascript);
  CheckIfAnimationIsOnScreen('#skills-animation', _animAnimation);

  var _cityBuildingsStrokeAnim = null;
  var _cityBuildings = $('#city-buildings');
  var _documentBodyWidth = documentBody.outerWidth();
  if(_documentBodyWidth > 480)
  {
    _cityBuildingsStrokeAnim = AnimateStroke(_cityBuildings, - 100, _easing, {scenarioType: 'oneByOne', documentWidth : _documentBodyWidth});
    CheckIfStrokeAnimIsOnScreen(_cityBuildings, _cityBuildingsStrokeAnim);
    if(_documentBodyWidth > 1024) // for ipad landscape displays
    {
      AnimateStroke('#hot-air-balloon-web', _duration - 80, _easing, {scenarioType: 'oneByOne'});
      // Hide the elements through JS that will appear on screen later
      HideElements('#foliage-container');
      HideElements('#road-container');
      AnimateBalloon('#hot-air-balloon-web', 2, '0%', '2%', true);
      AnimateBalloon('#hot-air-balloon-plain', 1, '0%', '0.75%', true);
      AnimateStroke('#city-flatline', _duration - 120, _easing, {scenarioType: 'scenario-sync'});
      PopInFoliage($('#foliage-container'));
      var _fireAnimA = AnimateBodymovin('fire-01', 'scripts/fire.json', "xMidYMid meet", _autoPlay);
      CheckIfAnimationIsOnScreen('#fire-01', _fireAnimA);
      var _fireAnimB = AnimateBodymovin('fire-02', 'scripts/fire.json', "xMidYMid meet", _autoPlay);
      CheckIfAnimationIsOnScreen('#fire-02', _fireAnimB);
      setTimeout(function()
      {
        // put the first road separately for an automatic start without using waypoints
        AnimateStroke('#road-01', _duration - 120, _easing, {startType: 'autostart'});
        GenerateRoad($('#road-container'), _documentBodyWidth);
      }, 200);
    }
    else
    {
      // for performance reasons we won't be using stroke animations so just do a fade
      FadeInAnimation('.road-container', 0.8);
    }
  }
  else
  {
    AnimateBalloon('#hot-air-balloon-plain', 1, '0%', '0.75%', false);
    _cityBuildingsStrokeAnim = AnimateStroke(_cityBuildings, - 100, _easing, {scenarioType: 'oneByOne', documentWidth : _documentBodyWidth});
    CheckIfStrokeAnimIsOnScreen(_cityBuildings, _cityBuildingsStrokeAnim);
  }
  OnHoverOverEmail();
  OnHoverOverPhone();
}
$(document).ready(function()
{
  /*
  document.addEventListener('gesturestart', function (e) {
    e.preventDefault();
  });*/
  $('html,body').animate({scrollTop:0},0);
  Init();
})

$(window).on('load', function()
{
  setTimeout(function()
  {
    var _animPlanet = AnimateBodymovin('planet', 'scripts/planet-fonts.json', "xMidYMin meet", false);
    CheckIfAnimationIsOnScreen('#planet', _animPlanet);
  }, 100);

})
