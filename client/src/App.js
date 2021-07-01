import React, {Component} from 'react';

const loadImage = (key, src) => {

}
const CANVAS_WIDTH = 640
const CANVAS_HEIGHT = 512
const TILE_WIDTH = 64
const TILE_HEIGHT = 64

class Player {
    constructor(ctx, game) {
        this.ctx = ctx
        this.game = game
        //position info
        this.x = 0
        this.y = 0
        this.dirX = 0
        this.dirY = 0
        this.health = 100
        this.coins = 0
        this.bullets = 0
        this.medKits = 0
    }

    //update and draw to screen
    update = () => {

    }
    draw = () => {
        this.ctx.drawImage(
            this.game.images.user0,
            0,
            0,
            TILE_WIDTH,
            TILE_HEIGHT,
            0,
            0,
            TILE_WIDTH,
            TILE_HEIGHT
        )
    }
}

class Game {
    constructor(ctx) {
        this.ctx = ctx

        this.images = {}

        this.layers = [
            [
                1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                1, 0, 0, 0, 0, 0, 0, 0, 0, 1,
                1, 0, 0, 0, 0, 0, 0, 0, 0, 1,
                1, 0, 0, 0, 0, 0, 0, 0, 0, 1,
                1, 0, 0, 0, 0, 0, 0, 0, 0, 1,
                1, 0, 0, 0, 0, 0, 0, 0, 0, 1,
                1, 0, 0, 0, 0, 0, 0, 0, 0, 1,
                1, 1, 1, 1, 1, 1, 1, 1, 1, 1
            ]
        ]
        this.players = [
            new Player(this.ctx, this)
        ]
    }

    init = async () => {
        console.log('load')
        const tile0 = await this.loadImage('./assets/layers/0.png')
        const tile1 = await this.loadImage('./assets/layers/1.png')
        const user0 = await this.loadImage('./assets/users/8.png')
        this.images = {
            user0: user0,
            0: tile0,
            1: tile1,
        }
    }
    loadImage = (src) => {
        let img = new Image()
        let d = new Promise(function (resolve, reject) {
            img.onload = function () {
                resolve(img)
            }.bind(this)

            img.onerror = function () {
                reject('Could not load image: ' + src)
            }
        }.bind(this))

        img.src = src
        return d
    }
    update = () => {
        console.log('update')
    }
    draw = () => {
        this.ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

        const cols = CANVAS_WIDTH / TILE_WIDTH
        const rows = CANVAS_HEIGHT / TILE_HEIGHT
        for (let i = 0; i < this.layers.length; i++) {
            const layer = this.layers[i]
            for (let j = 0; j < rows; j++) {
                for (let k = 0; k < cols; k++) {
                    const imageType = layer[j * cols + k]
                    this.ctx.drawImage(
                        this.images[imageType],
                        0,
                        0,
                        TILE_WIDTH,
                        TILE_HEIGHT,
                        k * TILE_WIDTH,
                        j * TILE_HEIGHT,
                        TILE_WIDTH,
                        TILE_HEIGHT
                    )
                }
            }
        }

        for (let m = 0; m < this.players.length; m++) {
            const player = this.players[m]
            player.draw()
        }
    }
}

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            CURRENT_STEP: '',
            isGameRunning: false
        }

        this.canvasRef = React.createRef()
        this.lastLoop = null
    }

    start = async () => {
        if (this.state.isGameRunning) {
            this.game = new Game(this.getCtx())
            await this.game.init()
            this.loop()
        }
        this.setState(state => ({isGameRunning: !state.isGameRunning}))
    }

    loop = () => {
        requestAnimationFrame(() => {
            const now = Date.now()
            if ((now - this.lastLoop) > (1000 / 30))
                this.game.update()
            this.game.draw()

            this.lastLoop = Date.now()
            if (this.state.isGameRunning) {
                this.loop()
            }
        })
    }

    getCtx = () => this.canvasRef.current.getContext('2d')

    render() {
        return (
            <div style={{
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'black'
            }}>
                <button onClick={this.start}>Start</button>
                <canvas ref={this.canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT}>
                </canvas>
            </div>
        );
    }
}

export default App;