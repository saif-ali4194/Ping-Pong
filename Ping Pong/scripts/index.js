let canvas = document.querySelector("canvas");
let c = canvas.getContext("2d");
canvas.width = 500;
canvas.height = 600;
let curScore = 0;
let highScore = 0;
let flag = true;
let random;
let table_img = new Image();
table_img.src = "./data/table.png";
table_img.width = canvas.width;
table_img.height = canvas.height;

let popSound = new Audio("./data/pop.mp3");
let pop_table_sound = new Audio("./data/pop_table.mp3");
pop_table_sound.volume = 0.2;

class Rac {
	constructor(x, y, dx, w, h) {
		this.x = x;
		this.y = y;
		this.dx = dx;
		this.w = w;
		this.h = h;
		this.velocity = dx;
	}
	draw() {
		c.fillRect(this.x, this.y, this.w, this.h);
	}
	update(dir) {
		if (dir == 2) {
			if (this.x + this.w >= canvas.width - 5) this.velocity = 0;
			else {
				this.velocity += 3;
				this.x += this.velocity;
			}
		} else if (dir == 1) {
			if (this.x <= 1) this.velocity = 0;
			else {
				this.velocity += 3;
				this.x -= this.velocity;
			}
		}

		c.fillStyle = "black";
		c.fill();
		this.draw();
	}

	reset() {
		this.velocity = this.dx;
	}
}
class Enemy {
	constructor(x, y, w, h) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
	}
	draw() {
		c.fillRect(this.x, this.y, this.w, this.h);
	}
	update() {
		this.x = b.x - this.w / 2;
		this.draw();
	}
}
class Ball {
	constructor(x, y, rad, speed) {
		this.strx = this.x = x;
		this.stry = this.y = y;
		this.str_rad = this.rad = rad;
		this.str_vel = this.velx = speed;
		this.vely = speed;
	}
	draw() {
		c.beginPath();
		c.strokeStyle = "dark grey";
		c.arc(this.x, this.y, this.rad, 0, 2 * Math.PI);
		c.fillStyle = "white";
		c.fill();
	}
	update() {
		if (this.x - 30 < 0 || this.x + 30 > canvas.width - 2) {
			pop_table_sound.play();
			this.velx = -this.velx;
		}

		if (this.y - this.rad < r.h / 2) {
			flag = false;
			setScore();
			document.getElementById("gameover").style.display = "flex";
		}

		if (this.y + this.rad >= e.y) {
			popSound.play();
			random = Math.floor(Math.random() * 2);
			if (random == 0 && this.velx > 0) this.velx = -this.velx;
			else if (random == 1 && this.velx < 0) this.velx = -this.velx;

			this.vely = -this.vely;
		}
		if (
			this.x + this.rad >= r.x &&
			this.x - this.rad <= r.x + r.w &&
			this.y - this.rad <= r.y + r.h &&
			this.y + this.rad >= r.y
		) {
			popSound.play();
			this.vely = -this.vely;
			curScore += 50;
			document.getElementById("CSG").textContent = curScore;
			if (this.rad >= 5 && b.str_vel <= 23) {
				this.rad -= 0.5;
				this.velx += 0.5;
				this.vely += 0.5;
			}
		}
		this.x += this.velx;
		this.y += this.vely;
		this.draw();
	}
	reset() {
		this.x = this.strx;
		this.y = this.stry;
		this.rad = this.str_rad;
		this.velx = this.str_vel;
		this.vely = this.str_vel;
	}
}
let r = new Rac(200, 10, 80, 100, 20);
// let e = new Enemy(0, canvas.height - 30, canvas.width, 20);
let e = new Enemy(200, canvas.height - 30, 100, 20);
let b = new Ball(canvas.width / 2, canvas.height / 2, 30, 3);

function animate() {
	if (flag) {
		requestAnimationFrame(animate);
		c.drawImage(table_img, 0, 0);
		r.update(0);
		e.update();
		b.update();
	}
}

window.addEventListener("keydown", (e) => {
	switch (e.key) {
		case "a":
			r.update(1);
			break;
		case "d":
			r.update(2);
			break;
	}
});

window.addEventListener("keyup", () => {
	r.reset();
});

// document.getElementById("back").addEventListener("click", () => {
// 	document.getElementById("menu").style.display = "flex";
// });
document.getElementById("start").addEventListener("click", () => {
	b.reset();
	flag = true;
	animate();
	document.getElementById("menu").style.display = "none";
});

document.getElementById("back_1").addEventListener("click", () => {
	b.reset();
	location.reload();
});

window.addEventListener("load", () => {
	if (localStorage.getItem("HS") == null) localStorage.setItem("HS", highScore);
	else highScore = localStorage.getItem("HS");

	document.getElementById("HS").textContent = highScore;
});

function setScore() {
	if (curScore > highScore) {
		localStorage.setItem("HS", curScore);
		document.getElementById("CS").textContent = curScore;
		document.getElementById("HS_GO").textContent = curScore;
	} else {
		document.getElementById("CS").textContent = curScore;
		document.getElementById("HS_GO").textContent = highScore;
	}
}
