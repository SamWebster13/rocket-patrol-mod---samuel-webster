class Play extends Phaser.Scene {
    constructor(){
        super('playScene')
    }

    create() {
        //place tile sprite
        this.layerFAR = this.add.tileSprite(0, 0, 640, 480, 'layerFAR').setOrigin(0,0)
        this.layerMID = this.add.tileSprite(0, 0, 640, 480, 'layerMID').setOrigin(0,0)
        this.layerCLOSE = this.add.tileSprite(0, 0, 640, 480, 'layerCLOSE').setOrigin(0,0)


        // green UI background
        this.add.rectangle(0, borderUISize + borderPadding, game.config.width, borderUISize * 2, 0x00FF00).setOrigin(0, 0)
        // white borders
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0)
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0)
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0)

        //add rocket (pl1)
        this.p1Rocket = new Rocket(this, game.config.width/2, game.config.height - borderUISize - borderPadding, 'rocket').setOrigin(0.5, 0)
        this.ship01 = new UFOship(this, game.config.width + borderUISize*6, borderUISize*4, 'UFOship', 0, 30).setOrigin(0, 0)
        this.ship02 = new Spaceship(this, game.config.width + borderUISize*3, borderUISize*5 + borderPadding*2, 'spaceship', 0, 20).setOrigin(0, 0)
        this.ship03 = new UFOship(this, game.config.width, borderUISize*6 + borderPadding*4, 'UFOship', 0, 10).setOrigin(0, 0)



        //define keys
        keyFIRE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F)
        keyRESET = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R)
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT)
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT)

        this.p1Score = 0

        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }
        this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding*2, this.p1Score, scoreConfig)
        
        this.timerText = this.add.text(game.config.width - 150, 10, 'Time: 60', {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 140


        })
        // GAME OVER flag
        this.gameOver = false
        
        // 60-second play clock
        scoreConfig.fixedWidth = 0
        this.startTime = this.time.now
        this.clock = this.time.delayedCall(60000, () => {
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5)
            this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart or ← for Menu’', scoreConfig).setOrigin(0.5)
            this.gameOver = true
        }, null, this)


    }

    updateTimer() {
        const remainingTime = Math.max(0, 60000 - (this.time.now - this.startTime))
        this.timerText.setText(`Time: ${Math.ceil(remainingTime / 1000)}`)
    }
    adjustTimer(seconds) {
        const newTime = Math.max(0, 60000 - (this.time.now - this.startTime) + seconds * 1000);
        this.startTime = this.time.now - (60000 - newTime);
    }

    update() {
        this.updateTimer()

        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyRESET)){
            this.scene.restart()
        }
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start("menuScene")
        }
        this.layerFAR.tilePositionX -= 3
        this.layerMID.tilePositionX -= 2
        this.layerCLOSE.tilePositionX -= .5
        if(!this.gameOver){
            this.p1Rocket.update()
            this.ship01.update()
            this.ship02.update()
            this.ship03.update()
        }
        

        if(this.checkCollision(this.p1Rocket, this.ship03)){
            this.adjustTimer(5); // Add 5 seconds for a hit
            this.p1Rocket.reset()
            this.shipExplode(this.ship03)
        }
        if(this.checkCollision(this.p1Rocket, this.ship02)){
            this.adjustTimer(5); // Add 5 seconds for a hit
            this.p1Rocket.reset()
            this.shipExplode(this.ship02)
        }
        
        if(this.checkCollision(this.p1Rocket, this.ship01)){
            this.adjustTimer(5); // Add 5 seconds for a hit
            this.p1Rocket.reset()
            this.shipExplode(this.ship01)
        }

        // Reset rocket position after firing
        if (this.p1Rocket.y <= borderUISize * 3 + borderPadding) {
            this.p1Rocket.isFiring = false;
            this.p1Rocket.y = game.config.height - borderUISize - borderPadding;
            this.adjustTimer(-5)
        }        
    }

    checkCollision(rocket, ship) {
        if(rocket.x < ship.x + ship.width && 
           rocket.x + rocket.width > ship.x &&
           rocket.y < ship.y + ship.height &&
           rocket.height + rocket.y > ship.y){
            return true
        } else{
            return false
         }
    }
    
    shipExplode(ship){
        ship.alpha = 0
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
        boom.anims.play('explode')
        boom.on('animationcomplete', ()=> {
            ship.reset()
            ship.alpha = 1
            boom.destroy()
        })
        this.p1Score += ship.points
        this.scoreLeft.text = this.p1Score

        let roll = Phaser.Math.Between(1, 4)
        if (roll == 1){
            this.sound.play('sound1')
        }else if(roll == 2){
            this.sound.play('sound2')
        }else if(roll == 3){
            this.sound.play('sound3')
        }else if(roll == 4){
            this.sound.play('sound4')
        }
    }
}