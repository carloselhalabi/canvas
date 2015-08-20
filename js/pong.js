            /*
             * CLASSIC PONG GAME MADE FOR THE LULZ
             * SUCK THIS D MADURO.
             * This code sucks, but it works.
             * \m/
             */
			var width=700, height=300, pi=Math.PI;
			var UpArrow=38, DownArrow=40;
			var canvas, c, keystate;
			var jugador, ai, bola;

			var imgBola=new Image();
			imgBola.onload=function(){
				init();
			}
			imgBola.src='img/cute.gif';

			var imgJugador=new Image();
			imgJugador.onload=function() {
				init();
			}
			imgJugador.src='img/capriles.jpeg';

			var imgAi=new Image();
			imgAi.onload=function(){
				init();
			}
			imgAi.src='img/maduro.jpg';

			jugador = {
				x: null,
				y: null,
				width: 48,
				height: 48,

				//The update function will provide movement inside the canvas. \m/
                
				update: function() {
					if (keystate[UpArrow]) this.y -= 7;
					if (keystate[DownArrow]) this.y += 7;
					this.y = Math.max(Math.min(this.y, height - this.height), 0);
					},
				draw: function() {

                /* For the classic rectangle instead of images
                 * c.fillRect(this.x, this.y, this.width, this.height);
                 * will do the trick.
                 */

				c.drawImage(imgJugador, this.x, this.y);
				}
			};

            //The AI, or the enemy. On a sunday morning I thought Maduro was a good candidate.

			ai = {
				x: null,
				y: null,
				width: 50,
				height: 48,

				update: function() {

					var desty = bola.y - (this.height - bola.side)*0.001;

                    /* The difficulty of the AI is set by the factor 0.1,
                     * the closer the factor is to one (1) the more chances of loosing your head.
                     * If you set it to one (1), Maduro will be unvincible.
                     */

					this.y += (desty - this.y) * 0.1;
					this.y = Math.max(Math.min(this.y, height - this.height), 0);
				},
				draw: function() {

                    // We draw the previously declared image, its better if it is 64x64.
                    
                    c.drawImage(imgAi, this.x, this.y)

				}
			};

            //The ball, or a caca LGBT. >_<

			bola = {
				x: null,
				y: null,
				vel: null,
				side: 20,
				speed: 10,

				serve: function(side) {

					var r = Math.random();
					this.x = side ===1 ? jugador.x+jugador.width : ai.x - this.side;
					this.y = (height - this.side)*r;

					var phi = 0.1*pi*(1 - 2*r);
					this.vel = {
						x: side*this.speed*Math.cos(phi),
						y: this.speed*Math.sin(phi)
					}
				},
				update: function() {
					this.x += this.vel.x;
					this.y += this.vel.y;

					if(0 > this.y || this.y+this.side > height) {
						var offset = this.vel.y < 0 ? 0 - this.y : height - (this.y+this.side);
						this.y += 2*offset;
						this.vel.y *= -1;
					}

					/* 
                     * Thanks to YouTube guides and tutorials:
                     * AABB (Axis Aligned Bounding Boxes) algorithm that calculates when two boxes
                     * intersect each other. Our boxes are the jugador and Maduro.
                    */
					var AABBIntersect = function(ax, ay, aw, ah, bx, by, bw, bh) {

						return ax < bx+bw && ay < by+bh && bx < ax+aw && by < ay+ah;
					};

					var pdle = this.vel.x < 0 ? jugador : ai;

					if (AABBIntersect(pdle.x, pdle.y, pdle.width, pdle.height,
						this.x, this.y, this.side, this.side)) {

						this.x = pdle===jugador ?  jugador.x+jugador.width : ai.x - this.side;

						var n = (this.y+this.side - pdle.y)/(pdle.height+this.side);
						var phi = 0.25*pi*(2*n-1); 
                        
                        /* 
                         * pi/4 = 45°; Our angle will be given by an even number multiplied by pi, divided by 4.
                         * The 'smash' function will give us the bounce effect of the ball.
                        */

						var smash = Math.abs(phi) > 0.2*pi ? 1.5 : 1;
						this.vel.x = smash*(pdle===jugador ? 1 : -1)*this.speed*Math.cos(phi);
                        
                        // The cosine function will give us translation on the x axis. Cateto adyacente, bitch.

						this.vel.y = smash*this.speed*Math.sin(phi);

                        // The sine function will give us translation on the y axis. Cateto opuesto, bitch.
					}

					// We'll tell the canvas to redraw the ball if it gets out of the (width).

					if (0 > this.x+this.side || this.x > width) {

                        // The ball will be given to the one scoring.

						this.serve(pdle===jugador ? 1 : -1); 
                        
					}
				},
				draw: function() {

					//c.fillRect(this.x, this.y, this.side, this.side);

					c.drawImage(imgBola, this.x, this.y)
				}
			};

			/* 
             * We'll draw the canvas using Javascript, 
             * main will allow us to detect keyboard input (UpArrow, DownArrow) 
             * so it can be used on the update function
            */

			function main() {

				canvas = document.getElementById("cs");// or createElement("canvas");
				canvas.width = width;
				canvas.height = height;
				c = canvas.getContext('2d');
				// or document.body.appendChild(canvas);

				c.fillStyle = "green";
				c.fillRect(0, 0, canvas.width, canvas.height);

				// WHERE ARE MY KEY PRESSESSSSSS >:(
				keystate = {};
				document.addEventListener("keydown", function(evt) {
					keystate[evt.keyCode] = true;
				});

				document.addEventListener("keyup", function(evt) {
					delete keystate[evt.keyCode];
				});


				init();

				/*
                 * The 'loop' function will call update() and draw() functions previously defined,
                 * and window.requestAnimationFrame() will draw the canvas again depending on the parameters.
                */

				var loop = function(){
					update();
					draw();

					window.requestAnimationFrame(loop, canvas);
				};
				window.requestAnimationFrame(loop, canvas);
			}

			function init() {
				jugador.x = jugador.width;
				jugador.y = (height - jugador.height)/2;

				ai.x = width - (jugador.width + ai.width);
				ai.y = (height - ai.height)/2;

				bola.serve(1);
                
               /* 
                bola.x = (width - bola.side) / 2; //so it can be placed on the middle of the canvas.
                bola.y = (height - bola.side) / 2; //the same here.
                bola.vel = {
                    x: 0;
                    y: 0;
                }
               */
			};

			function update() {
				bola.update();
				jugador.update();
				ai.update();
			};

			function draw() {

				c.fillRect(0,0,width,height);

				c.save();

				c.fillStyle = "#fff";

				bola.draw();
				jugador.draw();
				ai.draw();

				var w = 4;
				var x = (width - w)*0.5;
				var y = 0;
				var step = height/20;
				while (y < height) {
					c.fillRect(x, y+step*0.25, w, step*0.5);
					y += step;
				}

				c.restore();
			}

			main();
