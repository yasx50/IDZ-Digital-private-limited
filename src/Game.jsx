import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import './index.css';
import './App.css';

const Game = () => {
  const gameRef = useRef(null);

  useEffect(() => {
    const config = {
      type: Phaser.AUTO,
      width: window.innerWidth,
      height: window.innerHeight,
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
      this.load.image('pump', 'Symbol 28.png');
      this.load.image('sky', 'background.png');
      this.load.audio('pumpSound', 'balloon-deflate-squeak-1-184059.mp3');
      this.load.audio('burstSound', 'balloon-pop-48030.mp3');
    }

    function create() {
      this.add.image(window.innerWidth / 2, window.innerHeight / 2, 'sky').setDisplaySize(window.innerWidth, window.innerHeight);
      const pumpX = window.innerWidth / 1.2;
      const pumpY = window.innerHeight / 1.4;

      const pump = this.add.sprite(pumpX, pumpY, 'pump').setInteractive();
      pump.setScale(0.4);
      const pumpSound = this.sound.add('pumpSound');
      const burstSound = this.sound.add('burstSound');

      const createBalloon = (x, y, previousBalloon) => {
        const balloonImage = getRandomBalloon(previousBalloon);
        this.load.image('balloon', balloonImage);
        this.load.once('complete', () => {
          const balloon = this.physics.add.sprite(x, y, 'balloon');
          balloon.setScale(0.04);
          balloon.setInteractive();
          balloon.setBounce(1);
          balloon.setCollideWorldBounds(true);
          let isBalloonInflated = false;

          pump.on('pointerdown', () => {
            pumpSound.play();
            if (balloon.scale < 0.2) {
              balloon.setScale(balloon.scale + 0.05);
            } else {
              if (!isBalloonInflated) {
                isBalloonInflated = true;
                balloon.setVelocity(Phaser.Math.Between(-200, 200), Phaser.Math.Between(-200, 200));
                const newBalloonX = pumpX - 110;
                const newBalloonY = pumpY - 25;
                createBalloon(newBalloonX, newBalloonY, balloonImage);
              }
            }
          });

          balloon.on('pointerdown', () => {
            if (isBalloonInflated) {
              burstSound.play();
              balloon.destroy();
            }
          });
        });
        this.load.start();
      };

      createBalloon(pumpX - 110, pumpY - 25, null);
    }

    function update() {}

    const resize = () => {
      game.scale.resize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', resize);

    return () => {
      window.removeEventListener('resize', resize);
      game.destroy(true);
    };
  }, []);

  return (
    <>
      <h1 className='p-10'>IDZ DIGITAL PRIVATE LIMITED</h1>
      <div ref={gameRef}></div>
    </>
  );
};

export default Game;
