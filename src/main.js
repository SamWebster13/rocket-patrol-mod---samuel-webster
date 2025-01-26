/*
NAME: samuel webster
PROJECT TITLE: ROCKET PATROL: FIRST BLOOD PART 1
Id say maybe 4, 5 hours. I spent most of saturday night and from 12 to 2pm on sunday.
MOD LISTING:----------------------------------------------------------------------------------
Create a new enemy Spaceship type (w/ new artwork) that's smaller, moves faster, and is worth more points (5)
- UFOship, created by myself in photoshop. 

Implement a new timing/scoring mechanism that adds time to the clock for successful hits and subtracts time for misses (5)
- this one was tricky to get the time subtraction, and i had to rip up a bit of code from the rocket prefab, scattering it a bit into the play 
  scene so i could get it to all workout. 

Implement mouse control for player movement and left mouse click to fire (5)
- fairly easy, also incidentally allowed for another mod I will list directly after this:
---> Allow the player to control the Rocket after it's fired (1)
-----> (since the rocket follows the mouse, it just started following it after launch)

Implement parallax scrolling for the background (3)
- implemented a 3 layer parallax scroll, created all by sprites and backgrounds I made my self in photoshop

Create 4 new explosion sound effects and randomize which one plays on impact (3)
- used the sound creator given in the tutorial

Display the time remaining (in seconds) on the screen (3)
- honestly i NEEDED to do this one if i wanted to add / subtract time, displaying the time made it much easier to test.

Create a new scrolling tile sprite for the background (1)
- bi product of making the parallax scroll layers

total: 5 + 5 + 5 + 3 + 3 + 3 + 1 + 1 = 26


CITATIONS:
only assets i used were those given by nathan or created by me, in either photoshop or jsfxr 

*/ 

let config = {
    type: Phaser.AUTO,
    width: 640,
    height: 480,

    scene: [ Menu, Play ]
  }

let game = new Phaser.Game(config)

//reserve keyboard bindings
let keyFIRE, keyRESET, keyLEFT, keyRIGHT
// set UI sizes
let borderUISize = game.config.height / 15
let borderPadding = borderUISize / 3
