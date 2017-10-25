var documentBody = $('body');
var documentBodyWidth = null;
var documentWindow = $(window);
var previousWindowWidth = null;
var deviceScreenWidth = screen.width;
var skillAnims = [];

function convertPXtoRem(px)
{
    return px / parseFloat(getComputedStyle(document.documentElement).fontSize);
}

function GetRandomArbitrary(min, max)
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
        preserveAspectRatio:svgAspectRatio
			},
			path: data
	};
  var anim;
	anim = bodymovin.loadAnimation(animData);
  bodymovin.setQuality(2); // the lowest possible quality
  return anim;
}

function EnableHWAcceleration(element)
{
  var _element = $(element);
  if(_element.attr('class') == 'hw-off')
  {
    _element.removeClass("hw-off").addClass("hw-on");
  }
  else
    return;
}

function DisableHWAcceleration(element)
{
  var _element = $(element);
  if(_element.attr('class') == 'hw-on')
  {
    _element.removeClass("hw-on").addClass("hw-off");
  }
  else
    return;
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
      animation.pause();
    }
  });
}

function CheckIfCityBuildingsAnimIsOnScreen(element, vivus)
{
  var _cityBuildingsSVG = $('#city-buildings-svg');
  var waypoint = new Waypoint.Inview({
    element: element,
    enter: function()
    {
      vivus[0].play(1, function(){
        EnableSkillAnims();
        //DisableHWAcceleration(_cityBuildingsSVG);
        waypoint.destroy();
      });
      //EnableHWAcceleration(_cityBuildingsSVG)
      DisableSkillAnims();
    },
    exited: function()
    {
      //DisableHWAcceleration(_cityBuildingsSVG);
      if(documentBody.outerWidth() <= 480)
      {
        vivus[0].stop();
        EnableSkillAnims();
      }
      else
      {
        vivus[0].finish();
        waypoint.destroy();
      }
    }
  });
}

function DisableSkillAnims()
{
  for(var i = 0; i < skillAnims.length; i++)
  {
    skillAnims[i].pause();
  }
}

function EnableSkillAnims()
{
  for(var i = 0; i < skillAnims.length; i++)
  {
    skillAnims[i].play();
  }
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
      _currentElement.css('display', 'inline-block');
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
    _startX = WidthPercentageToPixel(_parentElement, '-40%'); // offset is due to the width of the clouds
    _endX = documentBody.outerWidth();
    _randomY = Math.random() * yRandomMax;
    _yValue = HeightPercentageToPixel(element, '' + _randomY + '%');
    _duration = RandomDurationGenerator(minDuration, maxDuration);
    _tween = TweenLite.fromTo(element, _duration, {x: (_flipStart == false ? _startX : _endX),
          y: _yValue, rotation: rotation}, {x: (_flipStart == false ? _endX : _startX), y: _yValue,
            ease:easing, force3D:force3dTranslate, onComplete:Translate});
  }
  function Reset()
  {
      _tween.kill(); // kill the animating tween
      Translate();
  }
  // attempt to discern if this is a mobile; we prevent calls stacking due to zoom
  if(!IsZoomed())
  {
    documentWindow.resize(Reset)
  }
  InitialiseVariables();
  CheckIfElementIsOnScreen();
  Translate();
}


function IsZoomed()
{

  if (documentWindow.outerWidth() != deviceScreenWidth)
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
  var _elementContainerChildren = null;
  if(_elementContainer.attr('id') == 'foliage-container')
  {
    _elementContainerChildren = _elementContainer.children().slice(2);
  }
  else
  {
    _elementContainerChildren = _elementContainer.children().slice(1);
  }
  for(var i = 0; i < _elementContainerChildren.length; i++)
  {
    var _currentChild = $(_elementContainerChildren[i]);
    if(_currentChild.css('display') != 'none')
    {
      _currentChild.css('visibility', 'hidden');
    }
  }
}

function AnimateStroke(element, length, easing, optionals)
{
  var parentElement = $(element);
  var _svgElements = parentElement.children(); // get all child elements from the div container
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
    var _parentID = parentElement.attr('id');
    if(_parentID.substring(0, 4) == 'road' && _isRoad == false)
    {
      _isRoad = true;
    }
    _animElements.push(new Vivus(_currentSVGElement[0], {duration: length, animTimingFunction:
      easing, type: _scenarioType, start: _startStype, selfDestroy: true, onReady:
      function() // called when the stroke is ready to run
      {
        if(_isRoad)
        {
          parentElement.css('visibility', 'visible');
          return;
        }
        // SetFillToNone(_currentSVGElement);
        this.play(); // we can just play the element automatically
        }
      },
      function() // called when the stroke animation has finished
      {
        if(_parentID == 'city-buildings')
        {
          var _documentWidth = optionals.documentWidth;
          if(_documentWidth != undefined)
          {
            if(_documentWidth <= 480)
            {
              AnimateBalloon('#hot-air-balloon-web', 2, '0%', '2%', false);
            }
            else if(_documentWidth > 480 && _documentWidth <= 1024)
            {
              AnimateBalloon('#hot-air-balloon-web', 2, '0%', '2%', false);
              AnimateBalloon('#hot-air-balloon-plain', 1, '0%', '0.75%', false);
              TranslateElement('#cloud-group-three-01', 15, 20, true, Linear.easeNone, true, 60, 0);
            }
            else
            {
              TranslateElement('#cloud-group-three-01', 15, 20, true, Linear.easeNone, true, 60, 0);
            }
          }
        }
        else if(_parentID == 'city-flatline')
        {
          //DisableHWAcceleration(_currentSVGElement[0]);
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
    var _foliageChildren = $(_foliage).children().slice(2);
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
  var _documentWindowWidth = documentWindow.outerWidth();
  var _paused = false;
  if(_documentWindowWidth <=  480)
  {
    _paused = true;
  }
  var _tween = TweenMax.fromTo(element, duration, { y: minHeight},
    {y: maxHeight, ease: Sine.easeInOut , repeat: -1, yoyo: true,
      force3D: force3D, paused: _paused});
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
  if(_documentWindowWidth > 1024 || _documentWindowWidth <=  480 )
  {
    CheckIfBalloonIsOnScreen();
  }
}

function SetRoadIDs(roadContainerElement)
{
  var _roadString = "road-0";
  var _roadContainerChildren = $(roadContainerElement).children().slice(1);
  for(var i = 0; i < _roadContainerChildren.length; i++)
  {
    $(_roadContainerChildren[i]).attr('id', '' + _roadString + '' + (i + 2))
  }
}

function GenerateRoad(roadContainer, bodyWidth)
{
  var _children = roadContainer.children().slice(1);
  for(var i = 0; i < _children.length; i++)
  {
    if($(_children[i]).css('display') != 'none')
    {
      GenerateRoadWaypoint(_children[i]);
    }
  }
}

function GenerateRoadWaypoint(roadElement)
{
  var vivus = AnimateStroke(roadElement, 40, Vivus.LINEAR,
  {startType: 'manual', scenarioType: 'oneByOne'});
  var waypoint = new Waypoint({
    element: roadElement,
    handler: function() {
      // iterate over each path i
      for(var i = 0; i < vivus.length; i++)
      {
        if(i == vivus.length - 1)
        {
          vivus[i].play(1, function(){waypoint.destroy});
        }
        else
          vivus[i].play();
      }
    },
    offset: '70%'
  });
}

function GenerateFoliageWaypoint(foliageElement)
{
  var timeline = new TimelineMax();
  var _foliageElement= $(foliageElement); // create a jquery object
  var _offset = '' + GetRandomArbitrary(50, 95) + '%';
  var _delay = GetRandomArbitrary(0, 0.1);
  var _force3D = true;
  /*
  var _foliageIDNumber = parseInt(_foliageElement.attr('id').substring(14, 16));
  if(_foliageIDNumber >= 8 && _foliageIDNumber <= 14 )
  {
    _force3D = false;
  }*/
  var waypoint = new Waypoint({
    element: foliageElement,
    handler: function(direction) {
      if(_foliageElement.css('display') != 'none') // fail safe to prevent unnecessary transformations on mobile browsers
      {
        _foliageElement.css('visibility', 'visible');
        timeline.append(TweenMax.fromTo(foliageElement, 0.3,
          {scaleY: 0.0, force3D: _force3D, rotation: 0}, {scaleY: 1.05, force3D: _force3D, rotation: 0})).
          to(foliageElement, 0.3, {scaleY: 1, force3D: _force3D, rotation: 0});
        timeline.delay(_delay);
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
var _hasTouch = false;

$('#email').on('touchstart touchend', function (e) {
  _hasTouch = true;
});
function OnHoverOverEmail()
{
  if(!_hasTouch)
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
  else
  {
      console.log(_hasTouch);
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

  SetRoadIDs('#road-container');
  var _autoPlay = false;
  var _duration = 180;
  var _easing = Vivus.LINEAR;
  var _isMobileDevice;
  var _cityBuildingsStrokeAnim = null;
  var _cityBuildings = $('#city-buildings');
  documentBodyWidth = documentBody.outerWidth();
  skillAnims[0] = AnimateBodymovin('skill-anim-web-dev', 'scripts/skills-web-development.json', "xMidYMid meet", _autoPlay);
  skillAnims[1] = AnimateBodymovin('skill-anim-html', 'scripts/skills-html.json', "xMidYMid meet", _autoPlay);
  skillAnims[2] = AnimateBodymovin('skill-anim-css', 'scripts/skills-css.json', "xMidYMid meet", _autoPlay);
  skillAnims[3] = AnimateBodymovin('skill-anim-jquery', 'scripts/skills-jquery.json', "xMidYMid meet", _autoPlay);
  skillAnims[4] = AnimateBodymovin('skill-anim-js', 'scripts/skills-javascript.json', "xMidYMid meet", _autoPlay);
  skillAnims[5] = AnimateBodymovin('skill-anim-animation', 'scripts/skills-animation.json', "xMidYMid meet", _autoPlay);
  if(documentBodyWidth > 480)
  {
    FadeInAnimation('body', 0.7);
    var _fireAnimB = null;
    _fireAnimB = AnimateBodymovin('fire-02', 'scripts/fire.json', "xMidYMid meet", _autoPlay);
    CheckIfAnimationIsOnScreen('#fire-02', _fireAnimB);
    CheckIfAnimationIsOnScreen('#skills-web-development', skillAnims[0]);
    CheckIfAnimationIsOnScreen('#skills-html', skillAnims[1]);
    CheckIfAnimationIsOnScreen('#skills-css', skillAnims[2]);
    CheckIfAnimationIsOnScreen('#skills-jquery', skillAnims[3]);
    CheckIfAnimationIsOnScreen('#skills-js', skillAnims[4]);
    CheckIfAnimationIsOnScreen('#skills-animation', skillAnims[5]);
    _cityBuildingsStrokeAnim = AnimateStroke(_cityBuildings, _duration - 100, _easing, {scenarioType: 'oneByOne', documentWidth : documentBodyWidth});
    CheckIfCityBuildingsAnimIsOnScreen(_cityBuildings, _cityBuildingsStrokeAnim);
    if(documentBodyWidth > 1024) // for ipad landscape displays
    {
      AnimateStroke('#hot-air-balloon-web', _duration - 80, _easing, {scenarioType: 'oneByOne'});
      // Hide the elements through JS that will appear on screen later
      HideElements('#foliage-container');
      HideElements('#road-container');
      //FadeInAnimation('#road-01', 1);
      // AnimateStroke('#road-01', _duration - 120, _easing, {startType: 'autostart', scenarioType: 'delayed'});
      GenerateRoad($('#road-container'), documentBodyWidth);
      AnimateBalloon('#hot-air-balloon-web', 2, '0%', '2%', false);
      AnimateBalloon('#hot-air-balloon-plain', 1, '0%', '0.75%', false);
      // AnimateStroke('#city-flatline', _duration - 120, _easing, {scenarioType: 'scenario-sync'});
      PopInFoliage($('#foliage-container'));
      var _fireAnimA = AnimateBodymovin('fire-01', 'scripts/fire.json', "xMidYMid meet", _autoPlay);
      CheckIfAnimationIsOnScreen('#fire-01', _fireAnimA);
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
    _cityBuildingsStrokeAnim = AnimateStroke(_cityBuildings, - 100, _easing, {scenarioType: 'oneByOne', documentWidth : documentBodyWidth});
    CheckIfCityBuildingsAnimIsOnScreen(_cityBuildings, _cityBuildingsStrokeAnim);
  }
  OnHoverOverEmail();
  OnHoverOverPhone();
}




documentWindow.resize(IsZoomed);
$(document).ready(function()
{
  $('html,body').animate({scrollTop:0},0);
  Init();
})

// safari bug with font loading - fix is to load it as the very last thing with the laod event
$(window).on('load', function()
{
    setTimeout(function()
    {
      if(documentBody.outerWidth() > 480)
      {
        var _animPlanet = AnimateBodymovin('planet', 'scripts/planet-fonts.json', "xMidYMin meet", false);
        CheckIfAnimationIsOnScreen('#planet', _animPlanet);
      }
      else
      {
        // don't bother pausing for small devices - waypoint zooming bug
        AnimateBodymovin('planet', 'scripts/planet-fonts.json', "xMidYMin meet", true);
      }
    }, 100);
})
