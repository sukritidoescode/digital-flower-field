const canvas = document.getElementById('bouquet');
const ctx = canvas.getContext('2d');

// Set canvas size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Set canvas background color (fallback)
canvas.style.backgroundColor = '#000';

// Flower class
class Flower {
  constructor(x, y, size, petalCount, color) {
    this.x = x;
    this.y = y;
    this.size = size; // Size of the flower
    this.petalCount = petalCount; // Number of petals (greater than 6)
    this.color = color; // Flower color
    this.alpha = 0; // Fade-in opacity
    this.fadeSpeed = Math.random() * 0.02 + 0.01; // Fade-in speed
    this.stars = []; // Array to store stars
  }

  // Draw the flower
  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.globalAlpha = this.alpha; // Apply fade-in opacity

    // Draw petals using polar coordinates (rose curve)
    ctx.beginPath();
    for (let theta = 0; theta < Math.PI * 2; theta += 0.01) {
      const r = this.size * (0.7 + Math.cos(this.petalCount * theta) * 0.3); // Broader petals
      const x = r * Math.cos(theta); // Convert polar to Cartesian coordinates
      const y = r * Math.sin(theta);
      ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fillStyle = this.color;
    ctx.fill();

    // Draw center of the flower
    ctx.beginPath();
    ctx.arc(0, 0, this.size / 6, 0, Math.PI * 2);
    ctx.fillStyle = '#ffcc00'; // Yellow center
    ctx.fill();
    ctx.closePath();

    // Draw stalk
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, this.size * 2); // Stalk length
    ctx.strokeStyle = '#4CAF50'; // Green stalk
    ctx.lineWidth = this.size / 10; // Stalk thickness
    ctx.stroke();
    ctx.closePath();

    ctx.restore();
  }

  // Update flower for fade-in animation and stars
  update() {
    if (this.alpha < 1) {
      this.alpha += this.fadeSpeed; // Increase opacity
    }
    this.draw();

    // Add 3-4 stars occasionally
    if (Math.random() < 0.1 && this.stars.length < 4) { // Limit stars to 3-4
      for (let i = 0; i < 3 + Math.floor(Math.random() * 2); i++) { // Emit 3-4 stars
        this.stars.push(new Star(this.x, this.y));
      }
    }

    // Update and draw stars
    this.stars.forEach((star, index) => {
      star.update();
      star.draw();
      if (star.alpha <= 0) {
        this.stars.splice(index, 1); // Remove faded-out stars
      }
    });
  }
}

// Star class
class Star {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = Math.random() * 3 + 2; // Random size
    this.color = 'white'; // White color
    this.alpha = 1; // Initial opacity
    this.angle = Math.random() * Math.PI * 2; // Random starting angle
    this.radius = Math.random() * 20 + 10; // Small orbit radius
    this.speed = Math.random() * 0.002 + 0.001; // Extremely slow orbit speed
  }

  // Draw the star
  draw() {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.translate(this.x, this.y);
    ctx.rotate((Math.PI / 4) * Math.floor(Math.random() * 4)); // Random rotation for star shape

    // Draw a simple star shape
    ctx.beginPath();
    ctx.moveTo(0, 0 - this.size);
    for (let i = 0; i < 5; i++) {
      ctx.rotate((Math.PI * 2) / 10);
      ctx.lineTo(0, 0 - this.size / 2);
      ctx.rotate((Math.PI * 2) / 10);
      ctx.lineTo(0, 0 - this.size);
    }
    ctx.closePath();
    ctx.fillStyle = this.color;
    ctx.shadowBlur = 10;
    ctx.shadowColor = 'white'; // White glow
    ctx.fill();
    ctx.restore();
  }

  // Update the star's position and opacity
  update() {
    // Move in a circular orbit around the flower
    this.angle += this.speed;
    this.x += Math.cos(this.angle) * this.radius * 0.01; // Very slow movement
    this.y += Math.sin(this.angle) * this.radius * 0.01;

    // Fade out over time
    this.alpha -= 0.002; // Very slow fade-out
  }
}

// Array to store flowers
const flowers = [];

// Function to add a new flower at a specific position
function addFlower(x, y) {
  const size = Math.random() * 30 + 20; // Random size
  const petalCount = Math.floor(Math.random() * 6) + 7; // Random petal count (7 to 12)
  const color = `hsl(${Math.random() * 360}, 70%, 60%)`; // Random color
  flowers.push(new Flower(x, y, size, petalCount, color));
}

// Handle canvas clicks
canvas.addEventListener('click', (event) => {
  const x = event.clientX;
  const y = event.clientY;
  addFlower(x, y);
});

// Animation loop
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw and update each flower
  flowers.forEach(flower => {
    flower.update();
  });

  requestAnimationFrame(animate);
}

// Start animation
animate();