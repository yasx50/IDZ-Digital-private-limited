import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import './index.css'
import './App.css'

const Game = () => {
  const gameRef = useRef(null);

  useEffect(() => {
    const config = {
      type: Phaser.AUTO,
      width: window.innerWidth, // Full width
      height: window.innerHeight, // Full height
      parent: gameRef.current,
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 0 },
        },
      },
      scene: {
        preload,
        create,
        update,
      },
    };

    const game = new Phaser.Game(config);
    
    // Balloons array
    const balloons = [
      "ballon.png", "Symbol 100001.png", "Symbol 100002.png", 
      "Symbol 100003.png", "Symbol 100004.png", "Symbol 100005.png", 
      "Symbol 100007.png", "Symbol 100008.png", "Symbol 100009.png", 
      "Symbol 100010.png"
    ];

    function getRandomBalloon(exclude = null) {
      let randomIndex;
      do {
        randomIndex = Math.floor(Math.random() * balloons.length);
      } while (balloons[randomIndex] === exclude);
      return balloons[randomIndex];
    }

    function preload() {
      this.load.image('pump', '../public/Symbol 28.png');
      this.load.image('sky', '../public/background.png');
      // Load sound effects
      this.load.audio('pumpSound', '../public/balloon-deflate-squeak-1-184059.mp3');
      this.load.audio('burstSound', '../public/balloon-pop-48030.mp3');
    }

    function create() {
      // Main background
      this.add.image(window.innerWidth / 2, window.innerHeight / 2, 'sky').setDisplaySize(window.innerWidth, window.innerHeight);
      // Pump position
      const pumpX = window.innerWidth / 1.2; // Center X
      const pumpY = window.innerHeight / 1.4; // Center Y

      const pump = this.add.sprite(pumpX, pumpY, 'pump').setInteractive();
      pump.setScale(0.4);
      // Sound effects
      const pumpSound = this.sound.add('pumpSound');
      const burstSound = this.sound.add('burstSound');

      // Function to create a new balloon
      const createBalloon = (x, y, previousBalloon) => {
        const balloonImage = getRandomBalloon(previousBalloon);
        this.load.image('balloon', balloonImage); // Load the new balloon image
        this.load.once('complete', () => {
          const balloon = this.physics.add.sprite(x, y, 'balloon');
          balloon.setScale(0.04);
          balloon.setInteractive();
          balloon.setBounce(1); // Set bounce to 1 for elastic effect
          balloon.setCollideWorldBounds(true); // Ensure balloon doesn't go out of bounds

          let isBalloonInflated = false; // Flag to check if the balloon is inflated

          // Pump air into the balloon by scaling it up
          pump.on('pointerdown', () => {
            pumpSound.play(); // Play pump sound

            if (balloon.scale < 0.2) { // Limit maximum scale to keep it on the screen
              balloon.setScale(balloon.scale + 0.05);
            } else {
              if (!isBalloonInflated) {
                isBalloonInflated = true; // Set the flag to true
                balloon.setVelocity(Phaser.Math.Between(-200, 200), Phaser.Math.Between(-200, 200)); // Start moving the balloon

                // Create a new balloon next to the pump
                const newBalloonX =  pumpX -110; 
                const newBalloonY = pumpY - 25; // Above the pump
                createBalloon(newBalloonX, newBalloonY, balloonImage); // Call the function to create a new balloon
              }
            }
          });

          // Burst the balloon on tap
          balloon.on('pointerdown', () => {
            if (isBalloonInflated) { // Check if the balloon is inflated before bursting
              burstSound.play(); // Play burst sound
              balloon.destroy(); // Balloon burst
            }
          });
        });
        this.load.start(); // Start loading the new balloon image
      };

      // Create the first balloon
      createBalloon(pumpX - 110, pumpY - 25, null); // Initial balloon position
    }

    function update() {
      // Game loop logic
    }

    const resize = () => {
      game.scale.resize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', resize);

    return () => {
      window.removeEventListener('resize', resize);
      game.destroy(true);
    };
  }, []);

  return <>
  
    <h1 className=' p-10'> IDZ DIGITAL PRIVATE LIMITED</h1>
    <div ref={gameRef}></div>
  
  </>
};

export default Game;
