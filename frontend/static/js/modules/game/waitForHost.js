

import { LiveStartHelper } from "../live/liveStart.js";

var WaitForHost = {
    props: [
        "lobbyId",
        "promptId",
        "user",
        "isHost",
    ],

    data: function () {
        return {
            players: [],
            started: false,
        }
    },

    mounted: async function () {
        let setPlayers = (ps) => {
            console.log(ps);
            this.players = ps
        };


        // Condition 1: signal from host
        const promise1 = new Promise(resolve => {
            this.liveStartHelper = new LiveStartHelper(this.$props.lobbyId, this.$props.promptId, this.$props.user, resolve, setPlayers);
        });


        // Condition 2: "immediate start" button click
        const promise2 = new Promise(resolve =>
            document.getElementById("start-btn").addEventListener("click", resolve, { once: true })
        );

        // Condition 3: "immediate start" spacebar press
        const promise3 = new Promise(resolve => document.body.addEventListener("keydown",
            (event) => {
                if (event.code === 'Space') {
                    // prevent automatic scrolling when spacebar is pressed
                    event.preventDefault();
                    resolve();
                }
            },
            { once: true })
        );


        await Promise.any([promise1, promise2, promise3]);
        this.started = true;
        this.$emit('start-game');
    },

    methods: {
        triggerStart() {
            this.liveStartHelper.triggerStart();
        }
    },

    template: (`
    <div v-show="!started">
        <div class="text-center text-size-1">
            <slot></slot>

            <div><button id="start-btn" class="btn btn-outline-secondary">Click here or press spacebar to start immediately!</button></div>

            <div><button id="start-btn" class="btn btn-outline-secondary" @click="triggerStart">Start Game</button></div>


            <div>Waiting for host to start</div>
        
            <div v-for="p in players">
                {{p}}
            </div>
        </div>

    </div>
    `)

};

export { WaitForHost };
