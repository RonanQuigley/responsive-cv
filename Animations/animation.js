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

function TranslateElement(element, minDuration, maxDuration,
  repeatEnabled, easing, force3dTranslate, yRandomMax, rotation)
{
  var _currentElement = $(element);
  var _parentElement = _currentElement.parent();
  var _flipStart = false;
  var _randomX = 0;
  var _startX = WidthPercentageToPixel(_parentElement, '-13%');
  var _endX = _parentElement.outerWidth();
  var _randomY = Math.random() * yRandomMax;
  var _yValue = HeightPercentageToPixel(element, '' + _randomY + '%');
  var _firstCall = true;
  var _duration = RandomDurationGenerator(minDuration, maxDuration);
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
  TweenMax.fromTo(element, _duration, {x: _startX, y: _yValue}, {x: _endX, y: _yValue,
     ease:easing,force3D:force3dTranslate, rotation: rotation, onComplete: AnimateLoop});

  function AnimateLoop()
  {
    _endX = _parentElement.outerWidth();
    _duration = RandomDurationGenerator(minDuration, maxDuration);
    if(_firstCall) // prevent FOUC
    {
      // _element.css({'left' : '0%', 'top' : '0%'});
      _firstCall = false;
    }
    _flipStart = GenerateRandomBool();
    _startX = WidthPercentageToPixel(_parentElement, '-13%');
    _randomY = Math.random() * yRandomMax;
    // base the yValue on our body as it is covers the entire visible screen
    _yValue = HeightPercentageToPixel(element, '' + _randomY + '%');
    TweenMax.fromTo(element, _duration, {x: (_flipStart == false ? _startX : _endX),
          y: _yValue}, {x: (_flipStart == false ? _endX : _startX), y: _yValue,
            ease:easing, onComplete:AnimateLoop, force3D:force3dTranslate});
  }
}

function MoveElement(element, sectionContainer, duration)
{
  function SetMoveDirection(container, endingValue)
  {
    console.log("endingValue: " + endingValue);
    console.log("container outer width / 2: " + container.outerWidth() / 2);
    if(parseFloat(endingValue) >= (container.innerWidth() / 2) - 150)
    {
      return WidthPercentageToPixel(container, '100%');
    }
    else
    {
      return WidthPercentageToPixel(container, '-30%');
    }
  }
  var _element = $(element); // convert to jquery object
  _element.css('visibility', 'hidden'); // hide the element initially
  var _endX = _element.css('left'); // take the current css position to use as our ending position
  var _yValue = _element.css('top'); // take the current css position to use as our ending position
  var _tween = null;
  var _startX = 0;
  var _sectionContainer = sectionContainer;
  console.log(_sectionContainer);
  // We use a waypoint to trigger it when it appears on screen
  var waypoint = new Waypoint({
    element: element,
    handler: function(direction) {
      _element.css('visibility', 'initial');
      function Move()
      {
        _startX = SetMoveDirection($(_sectionContainer), _endX);
        _element.css({"left": "inherit", "top" : "inherit"});
        _tween = TweenMax.fromTo(element, duration, {x: _startX, y:_yValue},
          {x: _endX, y: _yValue, force3D: false, rotation: 0.0000001});
      }
      $(window).resize(function()
      {
        _tween.kill();
        _startX = SetMoveDirection($(_sectionContainer), _endX);
        $(element).attr('style', '').css({"left": "inherit", "top" : "inherit"});
        TweenLite.to(element, 0, {x:_startX});
        waypoint.enable();
      })
      Move();
      waypoint.disable();
    },
    offset: '550'
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
            this.play(1, function(){GenerateClouds(6, 12, 20)});
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
    new Vivus(_svgElement[0], {duration: length, animTimingFunction: Vivus.LINEAR, scenarioType: _scenarioType,
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

function PopInFoliage(foliage)
{
  var _foliage = $(foliage);
  for(var i = 0; i < _foliage.length; i++)
  {
    var _currentFoliage = _foliage[i];
    GenerateFoliageWaypoint(_currentFoliage);
  }
}

function FadeInAnimation(element)
{
  $(element).css('visibility', 'visible');
  TweenLite.fromTo(element, 2, {opacity: 0},{opacity: 1})
}

function AnimateBalloon(element, duration, minHeight, maxHeight)
{
  TweenMax.fromTo(element, duration, {y: minHeight, force3D: true, rotation: 0.01}, {y: maxHeight,
  ease: Sine.easeInOut , repeat: -1, yoyo: true, rotation: 0.01, force3D: true});
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
      var vivus = AnimateStroke(roadElement, 60, Vivus.LINEAR,
        {startType: 'manual', scenarioType: 'delayed'});
      for(var i = 0; i < vivus.length; i++)
      {
        vivus[i].play();
      }
      waypoint.destroy();
    },
    offset: '550'
  });
}

function GenerateFoliageWaypoint(foliageElement)
{
  var waypoint = new Waypoint({
    element: foliageElement,
    handler: function(direction) {
        RevealElementByClass('foliage-show', $(foliageElement)); // set to visible by switching class
      var timeline = new TimelineMax();
      timeline.append(TweenMax.fromTo(foliageElement, 0.2,
        {scaleY: 0.0}, {scaleY: 1.10, force3D: true})).to(foliageElement, 0.3, {scaleY: 1, force3D: true});

      waypoint.destroy();
    },
    offset: '550'
  });
}



function GenerateClouds(numberOfClouds, minDuration, maxDuration)
{
  if(numberOfClouds % 2 != 0)
  {
    numberOfClouds -= 1; // we need to work with even numbers for this
    console.log("Number Of Clouds must be a multiple of 2; reducing requested amount by 1");
  }
  var _numOfCloudsHalved = numberOfClouds / 2;
  var i = 0;
  for(i = 0; i < numberOfClouds; i++)
  {
    if(i < _numOfCloudsHalved)
    {
      GenerateCloud('#cloud-01', i, minDuration, maxDuration)
    }
    else
    {
      GenerateCloud('#cloud-group-three-01', i, minDuration, maxDuration)
    }
  }
  // remove the unnecessary cloud group
  $('#cloud-group-three-01').parent().remove();

  function GenerateCloud(element, currentIndex, minDuration, maxDuration)
  {
    var _repeateEnabled = true;
    var _force3DTranslate = true;
    var _rotation = 0.01;
    var _yRandomMax = 95;
    // copy the cloud we want then change its ID
    var _cloudToCopy = $(element);
    var _cloud = _cloudToCopy.clone().
      attr('id', 'cloud-generated-sub-container-0' + (currentIndex + 1));
    // apply a unique class depending on the type of cloud we copied
    if(_cloudToCopy.attr('id') === "cloud-01")
    {
      _cloud.attr('class','cloud-one-generated-sub-container');
    }
    else if(_cloudToCopy.attr('id') === "cloud-group-three-01")
    {
      _cloud.attr('class','cloud-three-generated-sub-container');
      _cloud.children().attr('class', 'clouds-generated-background');
    }
    // all clouds just have an incremented id
    _cloud.children().attr('id', 'cloud-background-generated-0' + (currentIndex + 1));
    // make them invisible before adding to the document
    // cloudContainer.css('visibility', 'hidden');
    // add to container we previously created
    _cloud.appendTo('#generated-clouds-container');
    var _left = (Math.random() * 10 + '%');
    var _top = (Math.random() * 75 + '%');
    //cloud.css({'transform' : 'translate(' + _x + ', ' + _y + ')'});
    // cloud.css({'left' : _left, 'top' : _top})
    _cloud.find('path').css('fill', 'magenta');
    TranslateElement(_cloud, minDuration, maxDuration ,
      _repeateEnabled, Linear.easeNone, _force3DTranslate, _yRandomMax, _rotation);
  }
}

function RandomDurationGenerator(min, max)
{
  return Math.max(min, Math.random() * max);
}

function OnHoverOverEmail()
{
  var timeline = new TimelineMax();
  var email = $('#email');
  $(email.hover(function()
  {
    timeline.to(email, 0.2,{rotation: 10 });
    timeline.append(TweenMax.fromTo(email, 0.3, {rotation: 10}, {rotation: -10, repeat: -1}));

  }, function()
  {
    timeline.kill();
    TweenLite.to($(this)[0], 0.2, {rotation: 0});
  }));
}

function Init()
{



  AnimateBodymovin('planet', 'Animations/planet.json', true, "xMidYMin meet");
  AnimateBodymovin('skill-anim-web-dev', 'Animations/skills-web-development.json', true, "xMidYMid meet");
  AnimateBodymovin('skill-anim-html', 'Animations/skills-html.json', true, "xMidYMid meet");
  AnimateBodymovin('skill-anim-css', 'Animations/skills-css.json', true, "xMidYMid meet");
  AnimateBodymovin('skill-anim-jquery', 'Animations/skills-jquery.json', true, "xMidYMid meet");
  AnimateBodymovin('skill-anim-js', 'Animations/skills-javascript.json', true, "xMidYMid meet");
  AnimateBodymovin('skill-anim-animation', 'Animations/skills-animation.json', true, "xMidYMid meet");
  //AnimateBodymovin('anim-rain-01', 'Animations/rain.json', true, "xMidYMid meet");
  //AnimateBodymovin('anim-rain-02', 'Animations/rain.json', true, "xMidYMid meet");
  //AnimateBodymovin('anim-rain-03', 'Animations/rain.json', true, "xMidYMid meet");
  //AnimateBodymovin('anim-rain-04', 'Animations/rain.json', true, "xMidYMid meet");
  //AnimateBodymovin('fire-01', 'Animations/fire.json', true, "xMidYMid meet");
  //AnimateBodymovin('fire-02', 'Animations/fire.json', true, "xMidYMid meet");
  SetRoadIDs('.road-container');
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


  $(document).ready(function()
  {
    OnHoverOverEmail()
    var duration = 180;
    var easing = Vivus.LINEAR;
    var minDuration = 12;
    var maxDuration = 18;
    // DO NOT CALL THIS BEFORE ANIMATESTROKE!!!!!!!!
    // GenerateClouds(6, 12, 20);

    //TranslateElement('#cloud-rain-container',
    //minDuration, maxDuration, true, Linear.easeNone, true, 80, 0);
    AnimateBalloon('#hot-air-balloon-web', 2, '0%', '2%');
    //TranslateElement('#hot-air-balloon-web-container',
    //minDuration, maxDuration, true, Linear.easeNone, false, 30, 0);

    // put the first road separately for an automatic start without using waypoints
    AnimateStroke('#road-01', duration - 120, Vivus.LINEAR, {startType: 'autostart'});
    GenerateRoad('.road-container');
    AnimateStroke('#city-flatline', duration - 80, Vivus.LINEAR, {scenarioType: 'scenario-sync'});
    GeneratePaperPlaneLines('#paper-plane-line-01');
    GeneratePaperPlaneLines('#paper-plane-line-02');
    GeneratePaperPlaneLines('#paper-plane-line-03');
    ('#paper-plane-line-04');
    AnimateStroke('#cloud-01', duration - 100, Vivus.LINEAR);
    AnimateStroke('#cloud-02', duration - 125, Vivus.LINEAR);
    AnimateStroke('#cloud-03', duration - 150, Vivus.LINEAR);
    AnimateStroke('#city-buildings', duration - 50, Vivus.LINEAR);
    //AnimateStroke('#cloud-background-01', duration, easing);
    //AnimateStroke('#cloud-background-02', duration - 100, easing);
    //AnimateStroke('#cloud-background-03', duration - 80, easing);
    AnimateStroke('#hot-air-balloon-web', duration - 70, Vivus.LINEAR, {scenarioType: 'sync'});

    // AnimateFoliageStroke($('[class^=foliage]'), duration - 100, easing, {scenarioType: 'oneByOne'});
    PopInFoliage($('[class^=foliage]'));


    FadeInAnimation('#planet');
    // FadeInAnimation('#anim-rain-01');
    //setTimeout(function(){ FadeInAnimation('#anim-rain-02'); }, 3000);
    //setTimeout(function(){ FadeInAnimation('#anim-rain-03'); }, 3000);
    //setTimeout(function(){ FadeInAnimation('#anim-rain-04'); }, 3000);
    //setTimeout(function(){ FadeInAnimation('#anim-rain-05'); }, 3000);
    setTimeout(function(){
      AnimateBalloon('#hot-air-balloon-plain', 1, '0%', '0.75%')
    }, 1000);


    var _movementDuration = 0.75;

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



      // dynamic font sizing for blimps
      $("#blimp-web-font").fitText();
      $("#blimp-html-font").fitText();
      $("#blimp-css-font").fitText();
      $("#blimp-animation-font").fitText();
      $("#blimp-js-font").fitText();
      $("#blimp-jquery-font").fitText();

      var intervalRate = 30;
      var resizeWebBlimp = ResizeBlimpRect("blimp-web-svg", 170, 126, 60, 35, 88, 108.8, 170, 188.6);
      setInterval(resizeWebBlimp, intervalRate);
      var resizeHTMLBlimp = ResizeBlimpRect("blimp-html-svg", 70, 45, 40, 35, 158, 171.4, 150, 149.8);
      setInterval(resizeHTMLBlimp, intervalRate);
      var resizeCSSBlimp = ResizeBlimpRect("blimp-css-svg", 50, 34, 60, 35, 148, 155.4, 131.3, 150.3 );
      setInterval(resizeCSSBlimp, intervalRate);
      var resizeAnimationBlimp = ResizeBlimpRect("blimp-animation-svg", 100, 72, 60, 35, 123, 136.3, 130, 149.8);
      setInterval(resizeAnimationBlimp, intervalRate);
      var resizeJqueryBlimp = ResizeBlimpRect("blimp-jquery-svg", 70, 54, 60, 35, 158, 165.2, 140.3, 157.1);
      setInterval(resizeJqueryBlimp, intervalRate);
      var resizeJSBlimp = ResizeBlimpRect("blimp-js-svg", 97, 72, 60,35, 144, 154.6, 134, 150.3);
      setInterval(resizeJSBlimp, intervalRate);


  })
}
