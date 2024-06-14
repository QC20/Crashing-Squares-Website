// Importing Matter.js module aliases for easy access
let engine, ground, right, bodies, accentBody, accentLineWidth;

// Function to adjust positions of elements on window resize or orientation change
function reArrange(){
  Matter.Body.setPosition(ground, {
    x: window.innerWidth / 2,
    y: window.innerHeight + 500
  });
  Matter.Body.setPosition(right, {
    x: window.innerWidth + 500,
    y: 0
  });
}

// Function to initialize the Matter.js engine and create the simulation
function init() {
  console.log('%c👋', 'font-size: 120px;');
  console.log('%cWelcome to the interactive physics simulation!', 'font-size: 14px; font-weight: bold;');

  // Alias declarations for Matter.js modules
  let Engine = Matter.Engine,
      Render = Matter.Render,
      Runner = Matter.Runner,
      MouseConstraint = Matter.MouseConstraint,
      Mouse = Matter.Mouse,
      Bodies = Matter.Bodies,
      World = Matter.World,
      Events = Matter.Events,
      Composite = Matter.Composite;

  // Create a Matter.js engine
  engine = Engine.create();
  bodies = [];

  // Create static bodies (walls and ground)
  let top = Bodies.rectangle(window.innerWidth, -500, 10000, 1000, {isStatic: true});
  ground = Bodies.rectangle(window.innerWidth, window.innerHeight + 500, 10000, 1000, {isStatic: true});
  let left = Bodies.rectangle(-500, 0, 1000, 10000, {isStatic: true});
  right = Bodies.rectangle(window.innerWidth + 500, 0, 1000, 10000, {isStatic: true});

  // Add static bodies to the world
  Composite.add(engine.world, [ground, left, right]);

  // Parameters for creating interactive bodies
  const numberOfBlocks = 48;
  const existenceSpace = 300;
  let referenceSize = 60;
  let amountRatio = 2;
  accentLineWidth = 2;

  // Adjust sizes based on available screen space
  let spaceAvailable = window.innerWidth * window.innerHeight;
  if (spaceAvailable > 2000000) {
    referenceSize = 140;
    accentLineWidth = 8;
    amountRatio = 4;
  } else if (spaceAvailable > 1200000) {
    referenceSize = 130;
    accentLineWidth = 6;
    amountRatio = 3;
  } else if (spaceAvailable > 900000) {
    referenceSize = 120;
    accentLineWidth = 4;
  } else if (spaceAvailable > 400000) {
    referenceSize = 80;
    accentLineWidth = 3;
  }

  const restitution = 0.8;

  // Function to create interactive bodies (blocks and circles)
  function createBodies(count, sizeMultiplier, circle) {
    let i_to_3 = -1;
    let j = 0;
    for (let i = 0; i < count; i++) {
      // Create a new HTML div
      let div = document.createElement('div');

      // Set styles for the div
      div.style.width  = referenceSize * sizeMultiplier + 'px';
      div.style.height = referenceSize * sizeMultiplier + 'px';
      div.style.marginLeft = "-" + referenceSize * sizeMultiplier / 2 + 'px';
      div.style.marginTop  = "-" + referenceSize * sizeMultiplier / 2 + 'px';

      // Add the div to the document body
      stage.appendChild(div);

      // Cycle through colors
      i_to_3 < 2 ? i_to_3++ : i_to_3 = 0;

      // Create a physics body
      let b;
      let x = window.innerWidth * 0.1 + Math.random() * window.innerWidth * 0.6; // 20%–80% of screen width
      j++;
      let y = window.innerHeight - referenceSize * j * 0.8;
      if (circle) {
        div.classList = 'block circle color' + i_to_3;
        b = Bodies.circle(x, y, referenceSize / 2, {restitution: 0.7, friction: 0.2});
      } else {
        div.classList = 'block block' + sizeMultiplier + ' color' + i_to_3;
        b = Bodies.rectangle(x, y, referenceSize * sizeMultiplier, referenceSize * sizeMultiplier);
      }

      // Associate the HTML div with the physics body
      b.element = div;    
      Matter.Body.setAngle(b, Math.random(360));
      bodies.push(b);
      Composite.add(engine.world, b);
      b.restitution = restitution;
    }
  }

  // Create bodies of different sizes and shapes
  createBodies(12 * amountRatio, 1, false);
  createBodies(6 * amountRatio, 1, true);
  createBodies(1 * amountRatio, 2, false);


  // Add mouse constraint for interaction
  let mouse = Mouse.create(document.body);
  document.addEventListener('mousemove', function(event) {
    mouse.position.x = event.pageX;
    mouse.position.y = event.pageY;
  }, {passive: false});
  let mouseConstraint = Matter.MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {stiffness: 1.4}
  });

  // Add the mouse constraint to the world
  World.add(engine.world, mouseConstraint);   

  // Close the top boundary after a delay
  setTimeout(function() { Composite.add(engine.world, [top]); }, 3000);
  
  // Start the engine runner
  Runner.run(engine);
  
  // Update CSS transformations to match physics updates
  Events.on(engine, 'afterUpdate', function() {
    bodies.forEach(function(body) {
      body.element.style.transform = 'translate(' + body.position.x + 'px,' + body.position.y + 'px) rotate(' + body.angle + 'rad)';
    });
  });

  // Initial arrangement of elements
  reArrange();

  // Example code to change gravity direction (currently commented out)
  /*
  engine.world.gravity.y = -1;
  function changeGravity(){
    engine.world.gravity.y === 1 ? engine.world.gravity.y = -1 : engine.world.gravity.y = 1;
    setTimeout(changeGravity, 5000);
  }
  changeGravity();
  */
}

// Event listeners for initializing and rearranging the simulation
window.addEventListener('load', init);
window.addEventListener('resize', reArrange);
window.addEventListener('orientationchange', reArrange);

// Google Analytics setup
window.dataLayer = window.dataLayer || [];
function gtag() {
  dataLayer.push(arguments);
}
gtag('js', new Date());
gtag('config', 'G-YC4QBQ9DF1');
